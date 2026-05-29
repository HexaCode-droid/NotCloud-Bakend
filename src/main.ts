import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('NotCloud API')
    .setDescription('Documentación de la API de NotCloud')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  
  // Usar CDNs para Swagger UI garantiza que funcione en Vercel (Serverless)
  SwaggerModule.setup('api', app, documentFactory, {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-standalone-preset.js',
    ],
  });

  app.enableCors(); // Opcional: útil si vas a consumir la API desde un frontend distinto
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
