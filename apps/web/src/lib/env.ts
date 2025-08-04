/**
 * Environment variable validation and type safety
 */

// Define the shape of our environment variables
type Env = {
  // Required variables
  NODE_ENV: 'development' | 'test' | 'production';
  NEXT_PUBLIC_API_URL: string;
  
  // Optional variables with defaults
  NEXT_PUBLIC_AUTH0_DOMAIN?: string;
  NEXT_PUBLIC_AUTH0_CLIENT_ID?: string;
  NEXT_PUBLIC_AUTH0_AUDIENCE?: string;
  NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
  [key: string]: string | undefined; // For dynamic access
};

// Runtime validation of environment variables
function validateEnv(env: NodeJS.ProcessEnv): Env {
  const requiredVars = ['NODE_ENV', 'NEXT_PUBLIC_API_URL'] as const;
  const missingVars = requiredVars.filter(key => !env[key]);
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
      'Please check your .env.local file and refer to docs/ENVIRONMENT.md'
    );
  }

  // Validate NODE_ENV
  const nodeEnv = env.NODE_ENV;
  if (nodeEnv !== 'development' && nodeEnv !== 'test' && nodeEnv !== 'production') {
    throw new Error(
      `Invalid NODE_ENV: ${nodeEnv}. ` +
      'Must be one of: development, test, production'
    );
  }

  // Validate URLs
  if (env.NEXT_PUBLIC_API_URL) {
    try {
      // eslint-disable-next-line no-new
      new URL(env.NEXT_PUBLIC_API_URL);
    } catch {
      throw new Error(`Invalid NEXT_PUBLIC_API_URL: ${env.NEXT_PUBLIC_API_URL}`);
    }
  }

  return env as unknown as Env;
}

// Export validated environment variables
export const env = validateEnv(process.env);

// Helper to check if we're in development
export const isDev = env.NODE_ENV === 'development';

// Helper to check if we're in production
export const isProd = env.NODE_ENV === 'production';

// Helper to check if a feature is enabled
export const isFeatureEnabled = (feature: string): boolean => {
  const value = env[`NEXT_PUBLIC_FEATURE_${feature}`];
  return value === 'true' || value === '1';
};
