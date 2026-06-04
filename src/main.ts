import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Notification Preferences Service')
    .setDescription('API documentation for Notification Preferences Service')
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  const port = process.env.PORT ?? 3000;

  await app.listen(port);

  const appUrl = await app.getUrl();

  logger.log(`Application is running on ${appUrl}`);
  logger.log(`Swagger documentation is available on ${appUrl}/api/docs`);
}
bootstrap().catch((error: unknown) => {
  const logger = new Logger('Bootstrap');
  const stack = error instanceof Error ? error.stack : String(error);

  logger.error('Failed to start application', stack);
  process.exit(1);
});
