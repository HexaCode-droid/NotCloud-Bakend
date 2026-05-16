import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import type {
    RegisterCommand,
    RegisterSuccess,
    RegisterUseCase,
} from "../../domain/port/in/RegisterUseCase";
import { User } from "../../domain/model/User";
import type { PasswordHasher } from "../../domain/port/out/PasswordHasher";
import type { TokenGeneratorPort } from "../../domain/port/out/TokenGeneratorPort";
import type { UserRepository } from "../../domain/port/out/UserRepository";
import { ExisteUserException } from "../exception/ExisteUserException";
import { AppConfigService } from "../../config/app-config.service";

export const USER_REPOSITORY = "UserRepository";
export const PASSWORD_HASHER = "PasswordHasher";
export const TOKEN_GENERATOR = "TokenGeneratorPort";

@Injectable()
export class RegisterUseCaseService implements RegisterUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
        @Inject(PASSWORD_HASHER)
        private readonly passwordHasher: PasswordHasher,
        @Inject(TOKEN_GENERATOR)
        private readonly tokenGenerator: TokenGeneratorPort,
        private readonly appConfig: AppConfigService,
    ) {}

    async execute(command: RegisterCommand): Promise<RegisterSuccess> {
        const email = command.email.trim().toLowerCase();
        const fullName = command.fullName.trim();

        const existing = await this.userRepository.findByEmail(email);
        if (existing) {
            throw new ExisteUserException();
        }

        const passwordHash = await this.passwordHasher.hash(command.password);
        const id = randomUUID();
        const user = User.createNew({
            id,
            email,
            fullName,
            passwordHash,
        });

        await this.userRepository.save(user);

        const [token, RefreshToken] = await Promise.all([
            this.tokenGenerator.generateAccessToken({ userId: user.getId() }),
            this.tokenGenerator.generateRefreshToken({ userId: user.getId() }),
        ]);

        return {
            token,
            RefreshToken,
            expiresIn: this.appConfig.jwt.expiresInSeconds,
        };
    }
}
