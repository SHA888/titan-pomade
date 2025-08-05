# Development Guide

This guide provides detailed instructions for setting up and working with the Titan Pomade Stack in a development environment.

## Prerequisites

- Node.js 18+
- pnpm 8.x
- Docker and Docker Compose
- Git

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/titan-pomade.git
   cd titan-pomade
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development services**

   ```bash
   # Start all services (PostgreSQL, Redis, MeiliSearch)
   docker-compose up -d

   # Run database migrations
   pnpm db:migrate

   # Start development servers
   pnpm dev
   ```

## Project Structure

- `apps/client` - Next.js frontend application
- `apps/server` - NestJS backend application
- `packages/database` - Database schema and migrations
- `packages/shared` - Shared types and utilities

## Available Scripts

- `pnpm dev` - Start development servers
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm lint` - Lint code
- `pnpm format` - Format code
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:migrate` - Run database migrations
- `pnpm db:seed` - Seed the database

## Code Style

- Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
- Use Prettier for code formatting
- Follow ESLint rules for code quality
- Write tests for new features

## Git Workflow

1. Create a new branch for your feature or bugfix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. Push your changes and create a pull request

## Testing

Run tests with:

```bash
pnpm test
```

Write tests in the `__tests__` directory next to the code being tested.

## Debugging

- Use `console.log` for simple debugging
- For VS Code, use the built-in debugger with the provided launch configuration
- Check container logs with `docker-compose logs -f`

## API Documentation

Access the API documentation at `http://localhost:5000/api/docs` when the server is running.

## Troubleshooting

- **Database connection issues**: Ensure PostgreSQL is running and credentials in `.env` are correct
- **Port conflicts**: Check if ports 3000, 5000, 5432, 6379, or 7700 are in use
- **Docker issues**: Try rebuilding containers with `docker-compose up -d --build`
