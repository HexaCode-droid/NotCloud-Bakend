import { Inject, Injectable } from "@nestjs/common";
import type {
    LoginCommand,
    LoginSuccess,
    LoginUseCase,
} from "../../domain/port/in/LoginUseCase";
import type { PasswordHasher } from "../../domain/port/out/PasswordHasher";
import type { UserRepository } from "../../domain/port/out/UserRepository";
import { InvalidCredentialsException } from "../exception/InvalidCredentialsException";

export const USER_REPOSITORY = "UserRepository";
export const PASSWORD_HASHER = "PasswordHasher";

@Injectable()
export class LoginUseCaseService implements LoginUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
        @Inject(PASSWORD_HASHER)
        private readonly passwordHasher: PasswordHasher,
    ) {}

    async execute(_command: LoginCommand): Promise<LoginSuccess> {
        const user = await this.userRepository.findByEmail(_command.email);

        if(!user){
            throw new InvalidCredentialsException();
        }

        const isPasswordValid = await this.passwordHasher.match (
            _command.password,
            user.getPassword()
        )

        if(!isPasswordValid){
            throw new InvalidCredentialsException();
        }


        // Esto devuelve si el login es correcto
        return {
        id: user.getId(),
        email: user.getEmail(),
        fullName: user.getFullName(),
    };
    }
}
