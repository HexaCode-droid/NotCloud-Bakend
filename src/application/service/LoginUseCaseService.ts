import { Inject, Injectable } from "@nestjs/common";
import type { LoginCommand, LoginSuccess, LoginUseCase } from "../../domain/port/in/LoginUseCase";
import type { PasswordHasher } from "../../domain/port/out/PasswordHasher";
import type { TokenGeneratorPort } from "../../domain/port/out/TokenGeneratorPort";
import type { UserRepository } from "../../domain/port/out/UserRepository";
import { AppConfigService } from "../../config/app-config.service";
import { InvalidCredentialsException } from "../exception/InvalidCredentialsException";
import { TOKEN_GENERATOR } from "./RegisterUseCaseService";

export const USER_REPOSITORY = "UserRepository";
export const PASSWORD_HASHER = "PasswordHasher";

@Injectable()
export class LoginUseCaseService implements LoginUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
        @Inject(PASSWORD_HASHER)
        private readonly passwordHasher: PasswordHasher,
        @Inject(TOKEN_GENERATOR)
        private readonly tokenGenerator: TokenGeneratorPort,
        private readonly appConfig: AppConfigService,
    ) {}

    async execute(command: LoginCommand): Promise<LoginSuccess> {
        const user = await this.userRepository.findByEmail(command.email);

        if (!user) {
            throw new InvalidCredentialsException();
        }

        const isPasswordValid = await this.passwordHasher.match(
            command.password,
            user.getPassword(),
        );

        if (!isPasswordValid) {
            throw new InvalidCredentialsException();
        }

        const [token, refreshToken] = await Promise.all([
            this.tokenGenerator.generateAccessToken({ userId: user.getId() }),
            this.tokenGenerator.generateRefreshToken({ userId: user.getId() }),
        ]);

        return {
            id: user.getId(),
            email: user.getEmail(),
            fullName: user.getFullName(),
            token,
            refreshToken,
            expiresIn: this.appConfig.jwt.expiresInSeconds,
        };
    }
}
