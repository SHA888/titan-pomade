import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from '../logger/logger.module';
import configuration, { AppConfig } from '../config/configuration';
import { HealthModule } from '../health/health.module';

// Extend ConfigService with our AppConfig type
declare module '@nestjs/config' {
  // Extend the ConfigService with our AppConfig type
  // This adds type safety to the ConfigService without needing an empty interface
  type IConfigService = ConfigService<AppConfig>;
}

@Global()
@Module({})
export class CoreModule {
  static forRoot(): DynamicModule {
    return {
      module: CoreModule,
      imports: [
        // Configuration
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
          cache: true,
          expandVariables: true,
        }),

        // Rate limiting configuration with hardcoded values for now
        ThrottlerModule.forRoot({
          throttlers: [
            {
              ttl: 60000, // 1 minute in milliseconds
              limit: 100, // 100 requests per minute
            },
          ],
        }),

        // Logger
        LoggerModule.forRoot(),

        // Health checks
        HealthModule,
      ],
      exports: [ConfigModule, ThrottlerModule, LoggerModule, HealthModule],
    };
  }
}
