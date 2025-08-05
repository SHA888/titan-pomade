import { Controller, Get, Logger } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheckResult,
} from '@nestjs/terminus';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly healthService: HealthService,
  ) {}

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    const healthCheck = async () => {
      try {
        return await this.healthService.isHealthy('api');
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(
          `Health check failed: ${errorMessage}`,
          error instanceof Error ? error.stack : '',
        );
        throw error;
      }
    };

    try {
      const result = await this.health.check([healthCheck]);
      this.logger.log('Health check completed successfully');
      return result;
    } catch (error) {
      this.logger.error(
        'Health check endpoint failed',
        error instanceof Error ? error.stack : '',
      );
      throw error;
    }
  }
}
