import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AppConfigService } from "./config/app-config.service";
import { applyCors } from "./infrastructure/config/cors.config";
import { setupSwagger } from "./infrastructure/config/swagger.config";
import { ProblemDetailsFilter } from "./infrastructure/exception/problem-details.filter";

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    const appConfig = app.get(AppConfigService);

    applyCors(app, appConfig);
    setupSwagger(app, appConfig);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );
    app.useGlobalFilters(new ProblemDetailsFilter());

    const port = Number(process.env.PORT ?? "3000");
    await app.listen(port);
}

void bootstrap();
