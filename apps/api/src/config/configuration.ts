import { registerAs } from '@nestjs/config';

export interface AppConfig {
  nodeEnv: string;
  port: number;
  api: {
    prefix: string;
    version: string;
  };
  cors: {
    origin: string | string[];
    methods: string[];
  };
  throttle: {
    ttl: number;
    limit: number;
  };
  logging: {
    level: string;
    prettyPrint: boolean;
  };
  health: {
    url: string;
  };
  security: {
    helmet: boolean;
    rateLimit: boolean;
  };
}

export default registerAs<AppConfig>('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  api: {
    prefix: process.env.API_PREFIX || 'api',
    version: process.env.API_VERSION || 'v1',
  },
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    methods: process.env.CORS_METHODS?.split(',') || [
      'GET',
      'HEAD',
      'PUT',
      'PATCH',
      'POST',
      'DELETE',
    ],
  },
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    prettyPrint: process.env.LOG_PRETTY_PRINT === 'true',
  },
  health: {
    url: process.env.HEALTH_CHECK_URL || '/health',
  },
  security: {
    helmet: process.env.HELMET_ENABLED !== 'false',
    rateLimit: process.env.RATE_LIMIT_ENABLED !== 'false',
  },
}));