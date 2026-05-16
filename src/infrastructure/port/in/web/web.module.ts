import { Module } from "@nestjs/common";
import { LoginUseCaseService } from "../../../../application/service/LoginUseCaseService";
import {
    PASSWORD_HASHER,
    RegisterUseCaseService,
    TOKEN_GENERATOR,
    USER_REPOSITORY,
} from "../../../../application/service/RegisterUseCaseService";
import { RefreshTokenUseCaseService } from "../../../../application/service/RefreshTokenUseCaseService";
import { TypeOrmUserRepository } from "../../out/persistence/adapter/typeorm-user.repository";
import { PersistenceModule } from "../../out/persistence/persistence.module";
import { BcryptPasswordHasher } from "../../../security/BcryptPasswordHasher";
import { SecurityModule } from "../../../security/security.module";
import { TokenGeneratorAdapter } from "../../../security/TokenGeneratorAdapter";
import {
    AuthController,
    LOGIN_USE_CASE,
    REFRESH_TOKEN_USE_CASE,
    REGISTER_USE_CASE,
} from "./controller/auth.controller";
@Module({
    imports: [SecurityModule, PersistenceModule],
    controllers: [AuthController],
    providers: [
        { provide: USER_REPOSITORY, useExisting: TypeOrmUserRepository },
        { provide: PASSWORD_HASHER, useExisting: BcryptPasswordHasher },
        { provide: TOKEN_GENERATOR, useExisting: TokenGeneratorAdapter },
        { provide: REGISTER_USE_CASE, useExisting: RegisterUseCaseService },
        { provide: LOGIN_USE_CASE, useExisting: LoginUseCaseService },
        {
            provide: REFRESH_TOKEN_USE_CASE,
            useExisting: RefreshTokenUseCaseService,
        },
        RegisterUseCaseService,
        LoginUseCaseService,
        RefreshTokenUseCaseService,
    ],
})
export class AuthWebModule {}
