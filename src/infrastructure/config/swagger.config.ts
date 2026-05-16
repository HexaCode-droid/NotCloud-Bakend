import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import type { AppConfigService } from "../../config/app-config.service";

export function setupSwagger(app: INestApplication, appConfig: AppConfigService): void {
    if (!appConfig.swagger.enabled) {
        return;
    }

    const document = SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
            .setTitle("NotCloud API")
            .setDescription("API de NotCloud — autenticación y gestión de usuarios")
            .setVersion("1.0")
            .addTag("Auth", "Registro, login y renovación de tokens")
            .build(),
    );

    SwaggerModule.setup(appConfig.swagger.path, app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
}
