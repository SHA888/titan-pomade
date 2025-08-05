# Environment Variables

This document describes the environment variables used in the Next.js application.

## Setup

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Update the values in `.env.local` with your configuration.

## Required Variables

| Variable              | Description                                             | Required |         Default         |
| --------------------- | ------------------------------------------------------- | :------: | :---------------------: |
| `NODE_ENV`            | Application environment (development, test, production) |   Yes    |      `development`      |
| `NEXT_PUBLIC_API_URL` | Base URL for API requests                               |   Yes    | `http://localhost:3000` |

## Authentication (Auth0)

These variables are required if using Auth0 for authentication:

| Variable                      | Description             | Required |
| ----------------------------- | ----------------------- | :------: |
| `NEXT_PUBLIC_AUTH0_DOMAIN`    | Your Auth0 domain       |    No    |
| `NEXT_PUBLIC_AUTH0_CLIENT_ID` | Your Auth0 client ID    |    No    |
| `NEXT_PUBLIC_AUTH0_AUDIENCE`  | Your Auth0 API audience |    No    |

## Feature Flags

Feature flags allow you to enable/disable features without deploying new code:

| Variable                      | Description          | Default |
| ----------------------------- | -------------------- | :-----: |
| `NEXT_PUBLIC_FEATURE_EXAMPLE` | Example feature flag | `false` |

## Analytics

| Variable                        | Description                     | Required |
| ------------------------------- | ------------------------------- | :------: |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics Measurement ID |    No    |

## Validation

Environment variables are validated at runtime. If required variables are missing or invalid, the application will fail to start with a descriptive error message.

## Best Practices

1. Never commit sensitive information in `.env.local`
2. Prefix client-side variables with `NEXT_PUBLIC_`
3. Document all new environment variables in this file
4. Update `.env.example` when adding new variables
5. Use descriptive names for feature flags

## Development vs Production

- `.env.local` is used for local development
- `.env.development` can be used for development-specific overrides
- Environment variables are validated on application startup
