import { registerAs } from '@nestjs/config';

export const JWT_CONFIG = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'your-secret-key', // In production, use a strong secret from environment variables
  accessTokenExpiresIn: '15m', // 15 minutes
  refreshTokenExpiresIn: '7d', // 7 days
}));

export const JWT_STRATEGY = 'jwt';
export const REFRESH_TOKEN_STRATEGY = 'jwt-refresh';
