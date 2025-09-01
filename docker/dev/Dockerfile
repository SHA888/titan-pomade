# Development Dockerfile - Optimized for hot reloading
FROM node:18-alpine

# Install system dependencies and tools for development
RUN apk add --no-cache \
    libc6-compat \
    git \
    openssh-client \
    bash \
    curl \
    vim

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@8.15.5

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies with frozen lockfile for consistency
RUN pnpm install --frozen-lockfile

# Copy Prisma schema for generation
COPY apps/api/prisma ./apps/api/prisma

# Generate Prisma client
RUN cd apps/api && pnpm db:generate

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose ports for both services
EXPOSE 3000 5000

# Default command (can be overridden in docker-compose)
CMD ["pnpm", "dev"]
