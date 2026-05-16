import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppConfigModule } from "./config/app-config.module";
import { validateEnv } from "./config/env.validation";
import { AuthWebModule } from "./infrastructure/port/in/web/web.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate: validateEnv,
        }),
        AppConfigModule,
        AuthWebModule,
    ],
})
export class AppModule {}
