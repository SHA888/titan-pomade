// Using jest.mock to properly mock the environment variables

// Mock the process.env before importing the module
const originalEnv = { ...process.env };

// Helper to set environment variables for a test
const setEnvVars = (vars: Record<string, string | undefined>) => {
  // Clear existing env vars
  Object.keys(process.env).forEach((key) => {
    if (process.env[key] !== undefined) {
      delete process.env[key];
    }
  });

  // Set new env vars
  Object.assign(process.env, vars);
};

// Reset env vars after each test
afterEach(() => {
  // Clear all env vars
  Object.keys(process.env).forEach((key) => {
    if (process.env[key] !== undefined) {
      delete process.env[key];
    }
  });

  // Restore original env vars
  Object.assign(process.env, originalEnv);

  // Reset the module cache
  jest.resetModules();
});

describe('env', () => {
  it('should validate required environment variables', async () => {
    // Arrange
    setEnvVars({
      NODE_ENV: 'test',
      // Missing NEXT_PUBLIC_API_URL
    });

    // Act & Assert
    await expect(import('../env')).rejects.toThrow(
      'Missing required environment variables: NEXT_PUBLIC_API_URL'
    );
  });

  it('should validate NODE_ENV values', async () => {
    // Arrange
    setEnvVars({
      NODE_ENV: 'invalid',
      NEXT_PUBLIC_API_URL: 'http://localhost:3000',
    });

    // Act & Assert
    await expect(import('../env')).rejects.toThrow(
      'Invalid NODE_ENV: invalid. Must be one of: development, test, production'
    );
  });

  it('should validate URL format for NEXT_PUBLIC_API_URL', async () => {
    // Arrange
    setEnvVars({
      NODE_ENV: 'test',
      NEXT_PUBLIC_API_URL: 'not-a-url',
    });

    // Act & Assert
    await expect(import('../env')).rejects.toThrow('Invalid NEXT_PUBLIC_API_URL: not-a-url');
  });

  it('should correctly identify development environment', async () => {
    // Arrange
    setEnvVars({
      NODE_ENV: 'development',
      NEXT_PUBLIC_API_URL: 'http://localhost:3000',
    });

    // Act
    const { isDev, isProd } = await import('../env');

    // Assert
    expect(isDev).toBe(true);
    expect(isProd).toBe(false);
  });

  it('should correctly identify production environment', async () => {
    // Arrange
    setEnvVars({
      NODE_ENV: 'production',
      NEXT_PUBLIC_API_URL: 'http://localhost:3000',
    });

    // Act
    const { isDev, isProd } = await import('../env');

    // Assert
    expect(isDev).toBe(false);
    expect(isProd).toBe(true);
  });

  describe('isFeatureEnabled', () => {
    it('should return true for enabled features', async () => {
      // Arrange
      setEnvVars({
        NODE_ENV: 'test',
        NEXT_PUBLIC_API_URL: 'http://localhost:3000',
        NEXT_PUBLIC_FEATURE_TEST: 'true',
      });

      // Act
      const { isFeatureEnabled } = await import('../env');

      // Assert
      expect(isFeatureEnabled('TEST')).toBe(true);
    });

    it('should return false for disabled features', async () => {
      // Arrange
      setEnvVars({
        NODE_ENV: 'test',
        NEXT_PUBLIC_API_URL: 'http://localhost:3000',
        NEXT_PUBLIC_FEATURE_TEST: 'false',
      });

      // Act
      const { isFeatureEnabled } = await import('../env');

      // Assert
      expect(isFeatureEnabled('TEST')).toBe(false);
    });

    it('should return false for undefined features', async () => {
      // Arrange
      setEnvVars({
        NODE_ENV: 'test',
        NEXT_PUBLIC_API_URL: 'http://localhost:3000',
        // No feature flags set
      });

      // Act
      const { isFeatureEnabled } = await import('../env');

      // Assert
      expect(isFeatureEnabled('UNDEFINED_FEATURE')).toBe(false);
    });
  });
});
