import { Injectable } from "@nestjs/common";
import { JwtService, type JwtSignOptions } from "@nestjs/jwt";
import { AppConfigService } from "../../config/app-config.service";
import type { TokenGeneratorPort } from "../../domain/port/out/TokenGeneratorPort";

type TokenPayload = {
    userId: string;
};

@Injectable()
export class TokenGeneratorAdapter implements TokenGeneratorPort {
    constructor(
        private readonly jwtService: JwtService,
        private readonly appConfig: AppConfigService,
    ) {}

    async generateAccessToken(payload: { userId: string }): Promise<string> {
        return this.jwtService.signAsync({ userId: payload.userId } satisfies TokenPayload, {
            secret: this.appConfig.jwt.accessSecret,
            expiresIn: this.appConfig.jwt.accessExpiresIn as JwtSignOptions["expiresIn"],
        });
    }

    async generateRefreshToken(payload: { userId: string }): Promise<string> {
        return this.jwtService.signAsync({ userId: payload.userId } satisfies TokenPayload, {
            secret: this.appConfig.jwt.refreshSecret,
            expiresIn: this.appConfig.jwt.refreshExpiresIn as JwtSignOptions["expiresIn"],
        });
    }

    async verifyRefreshToken(refreshToken: string): Promise<string> {
        try {
            const decoded = await this.jwtService.verifyAsync<TokenPayload>(refreshToken, {
                secret: this.appConfig.jwt.refreshSecret,
            });

            return decoded.userId ?? "";
        } catch {
            return "";
        }
    }
}
