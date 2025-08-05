# Development Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8.x

# Install system dependencies
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application code
COPY . .

# Expose ports
EXPOSE 3000 5000

# Start development servers
CMD ["pnpm", "dev"]
