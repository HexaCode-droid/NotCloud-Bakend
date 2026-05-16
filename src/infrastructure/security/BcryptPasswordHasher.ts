import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { AppConfigService } from "../../config/app-config.service";
import type { PasswordHasher } from "../../domain/port/out/PasswordHasher";

@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
    constructor(private readonly appConfig: AppConfigService) {}

    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.appConfig.bcrypt.saltRounds);
    }

    async match(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}
