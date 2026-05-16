import { Inject, Injectable } from "@nestjs/common";
import {
    RefreshTokenCommand,
    RefreshTokenSuccess,
    RefreshTokenUseCase,
} from "../../domain/port/in/RefreshTokenUseCase";
import type { UserRepository } from "../../domain/port/out/UserRepository";
import type { TokenGeneratorPort } from "../../domain/port/out/TokenGeneratorPort";
import { TokenExpired } from "../exception/TokenExpired";
import { AppConfigService } from "../../config/app-config.service";

export const USER_REPOSITORY = "UserRepository";
export const TOKEN_GENERATOR = "TokenGeneratorPort";

@Injectable()
export class RefreshTokenUseCaseService implements RefreshTokenUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
        @Inject(TOKEN_GENERATOR)
        private readonly tokenGenerator: TokenGeneratorPort,
        private readonly appConfig: AppConfigService,
    ) {}

    async execute(command: RefreshTokenCommand): Promise<RefreshTokenSuccess> {
        const userId = await this.tokenGenerator.verifyRefreshToken(command.refreshToken);

        if (!userId) {
            throw new TokenExpired();
        }

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new TokenExpired();
        }

        const [token, refreshToken] = await Promise.all([
            this.tokenGenerator.generateAccessToken({ userId: user.getId() }),
            this.tokenGenerator.generateRefreshToken({ userId: user.getId() }),
        ]);

        return {
            token,
            refreshToken,
            expiresIn: this.appConfig.jwt.expiresInSeconds,
        };
    }
}
