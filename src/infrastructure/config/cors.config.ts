import type { INestApplication } from "@nestjs/common";
import type { AppConfigService } from "../../config/app-config.service";

export function applyCors(app: INestApplication, appConfig: AppConfigService): void {
    if (!appConfig.cors.enabled) {
        return;
    }

    app.enableCors({
        origin: appConfig.cors.origin,
        methods: appConfig.cors.methods,
        allowedHeaders: appConfig.cors.allowedHeaders,
    });
}
