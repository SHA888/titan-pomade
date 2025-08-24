import { Module, ValidationPipe, type INestApplication } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ThrottlerGuard } from '@nestjs/throttler';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    CoreModule.forRoot(),
    PrismaModule,
    AuthModule,
    AdminModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          transform: true,
          forbidNonWhitelisted: true,
          transformOptions: {
            enableImplicitConversion: true,
          },
        }),
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.logger.log(
      `Application is running in ${this.configService.get('app.nodeEnv')} mode`,
    );
  }

  configure(consumer: {
    getHttpAdapter: () => { getInstance: () => NestExpressApplication };
  }): void {
    const app = consumer.getHttpAdapter().getInstance();

    // Apply security middleware
    if (this.configService.get<boolean>('app.security.helmet')) {
      app.use(helmet());
    }
  }

  // Configure Swagger after application is initialized
  onApplicationBootstrap(): void {
    if (this.configService.get<string>('app.nodeEnv') !== 'production') {
      // Swagger will be set up by the main.ts bootstrap function
      // This is a workaround until we can properly type the application instance
    }
  }

  // This method is called from main.ts after the app is created
  setupSwagger(app: INestApplication): void {
    this.setupSwaggerDocs(app);
  }

  private setupSwaggerDocs(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('API Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }
}
