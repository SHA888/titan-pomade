import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export class HealthService extends HealthIndicator {
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Add more health checks here as needed
      const isHealthy = true;
      // Simulate async operation
      await Promise.resolve();

      return this.getStatus(key, isHealthy, {
        status: isHealthy ? 'up' : 'down',
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return this.getStatus(key, false, {
        status: 'down',
        error: errorMessage,
      });
    }
  }
}
