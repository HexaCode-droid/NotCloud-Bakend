import { Module } from "@nestjs/common";
import { JwtModule, type JwtSignOptions } from "@nestjs/jwt";
import { AppConfigService } from "../../config/app-config.service";
import { BcryptPasswordHasher } from "./BcryptPasswordHasher";
import { TokenGeneratorAdapter } from "./TokenGeneratorAdapter";

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [AppConfigService],
            useFactory: (appConfig: AppConfigService) => ({
                secret: appConfig.jwt.accessSecret,
                signOptions: {
                    expiresIn: appConfig.jwt.accessExpiresIn as JwtSignOptions["expiresIn"],
                },
            }),
        }),
    ],
    providers: [TokenGeneratorAdapter, BcryptPasswordHasher],
    exports: [TokenGeneratorAdapter, BcryptPasswordHasher],
})
export class SecurityModule {}
