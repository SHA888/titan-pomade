import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT ?? 5000;

  try {
    // Create the application
    const app = await NestFactory.create(AppModule);

    // Get config service
    const configService = app.get(ConfigService);

    // Set up API versioning
    const apiPrefix = configService.get<string>('app.api.prefix', 'api');
    const apiVersion = configService.get<string>('app.api.version', 'v1');
    app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);

    // Enable CORS if needed
    app.enableCors();

    // Setup Swagger in non-production environments
    if (configService.get<string>('app.nodeEnv') !== 'production') {
      // Get the AppModule instance and call setupSwagger
      const appModule = app.get(AppModule);
      appModule.setupSwagger(app);

      // Log Swagger URL
      logger.log(
        `Swagger documentation available at http://localhost:${port}/${apiPrefix}/docs`,
      );
    }

    // Start the application
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}/${apiPrefix}/${apiVersion}`);
  } catch (error) {
    logger.error('Failed to start the application', error);
    process.exit(1);
  }
}

// Execute bootstrap and handle any uncaught promise rejections
bootstrap().catch((error) => {
  console.error('Failed to bootstrap application:', error);
  process.exit(1);
});