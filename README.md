<div align="center">

# Titan Pomade (TTNNPMDTS) Stack

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A modern, full-stack web application template built with cutting-edge technologies for building scalable and maintainable web applications.

</div>

## 🚀 Features

### Frontend

- ⚡ **Next.js 14** - React framework with App Router for optimized performance and SEO
- 🎨 **Tailwind CSS** - Utility-first CSS framework for beautiful, responsive UIs
- 🛠 **TypeScript** - Type safety across the entire stack
- 🌐 **API Integration** - Seamless communication with the backend API

### Backend

- 🏗 **NestJS** - Scalable Node.js server framework with robust architecture
- 🔐 **Authentication** - JWT-based authentication system
- 🔄 **Rate Limiting** - Built-in request throttling for API protection
- 📊 **Health Checks** - System health monitoring endpoints
- 📚 **API Documentation** - Auto-generated with Swagger/OpenAPI (available at `/api/docs`)

### Database & Search

- 🗄 **PostgreSQL 16** - Robust relational database
- 🔍 **MeiliSearch** - Lightning-fast search experience
- 🛢 **Prisma** - Type-safe database client and migrations

### DevOps

- 🐳 **Docker** - Containerization for consistent environments
- ✅ **Testing** - Comprehensive test suite with Jest
- 🔄 **CI/CD** - GitHub Actions for automated testing and deployment

## 🛠 Tech Stack

| Layer         | Technology                                    | Version | Purpose                                | Documentation                                |
| ------------- | --------------------------------------------- | ------- | -------------------------------------- | -------------------------------------------- |
| **Frontend**  | [Next.js](https://nextjs.org/)                | 14.x    | React framework with server components | [Docs](https://nextjs.org/docs)              |
| **Styling**   | [Tailwind CSS](https://tailwindcss.com/)      | 3.x     | Utility-first CSS framework            | [Docs](https://tailwindcss.com/docs)         |
| **Backend**   | [NestJS](https://nestjs.com/)                 | 10.x    | Node.js server framework               | [Docs](https://docs.nestjs.com/)             |
| **Database**  | [PostgreSQL](https://www.postgresql.org/)     | 16.x    | Relational database                    | [Docs](https://www.postgresql.org/docs/)     |
| **ORM**       | [Prisma](https://www.prisma.io/)              | 5.x     | Type-safe database client              | [Docs](https://www.prisma.io/docs)           |
| **Search**    | [MeiliSearch](https://www.meilisearch.com/)   | 1.x     | Lightning-fast search                  | [Docs](https://docs.meilisearch.com/)        |
| **Container** | [Docker](https://www.docker.com/)             | 24.x    | Containerization                       | [Docs](https://docs.docker.com/)             |
| **Language**  | [TypeScript](https://www.typescriptlang.org/) | 5.x     | Type-safe JavaScript                   | [Docs](https://www.typescriptlang.org/docs/) |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [pnpm](https://pnpm.io/) (required package manager)

### Development Options

Choose your preferred development setup:

1. **🐳 Docker Development** (Recommended)
2. **⚡ Local Development** (Advanced)

### 🐳 Docker Development (Recommended)

The fastest way to get started with a fully containerized development environment:

```bash
# Clone the repository
git clone https://github.com/yourusername/titan-pomade.git
cd titan-pomade

# Quick setup and start
./dev.sh setup
./dev.sh start

# Access your application:
# - Frontend: http://localhost:3000
# - API: http://localhost:5000
# - API Docs: http://localhost:5000/api/docs
# - MeiliSearch: http://localhost:7700
```

**📚 For detailed Docker development guide, see [docs/DOCKER_DEVELOPMENT.md](docs/DOCKER_DEVELOPMENT.md)**

### ⚡ Local Development (Advanced)

For developers who prefer running services locally:

### Ports

- **Frontend**: `3000` (http://localhost:3000)
- **Backend API**: `5000` (http://localhost:5000)
- **Database**: `5432`
- **Redis**: `6379`
- **MeiliSearch**: `7700`

### Quick Start (Local Development)

```bash
# Clone the repository
git clone https://github.com/yourusername/titan-pomade.git
cd titan-pomade

# Install dependencies
pnpm install

# Copy and configure environment variables
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# Start external services (PostgreSQL, Redis, MeiliSearch)
docker-compose up postgres redis meilisearch -d

# Run database migrations
pnpm db:migrate

# Seed database with test data
pnpm db:seed

# Start development servers
pnpm dev

# Access the application:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:5000
# - API Documentation: http://localhost:5000/api/docs
# - Health Check: http://localhost:5000/health
```

### Verify Prerequisites

```bash
# Check Node.js version
node -v

# Check Docker and Docker Compose
docker --version
docker-compose --version

# Check pnpm version
pnpm --version
```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/titan-pomade.git
   cd titan-pomade
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   # Update the .env file with your configuration
   ```

4. Start the development environment:

   ```bash
   # Start all services with Docker Compose
   docker-compose up -d

   # Run database migrations
   pnpm db:migrate

   # Start development servers
   pnpm dev
   ```

## 📂 Project Structure

```
titan-pomade/
├── .github/            # GitHub Actions workflows and templates
│   └── workflows/      # CI/CD pipelines
│   └── ISSUE_TEMPLATE/ # Issue templates
│
├── apps/
│   ├── client/         # Next.js frontend application
│   │   ├── app/        # App Router pages and layouts
│   │   ├── components/ # Reusable UI components
│   │   ├── lib/        # Frontend utilities
│   │   ├── styles/     # Global styles
│   │   └── public/     # Static assets
│   │
│   └── server/         # NestJS backend application
│       ├── src/
│       │   ├── auth/    # Authentication logic
│       │   ├── common/  # Shared modules and decorators
│       │   ├── config/  # Configuration files
│       │   └── modules/ # Feature modules
│       └── test/       # Backend tests
│
├── packages/
│   ├── database/       # Database layer
│   │   ├── prisma/     # Prisma schema and migrations
│   │   └── seeds/      # Database seed scripts
│   │
│   └── shared/         # Shared code
│       ├── types/      # Shared TypeScript types
│       └── utils/      # Shared utilities
│
├── docker/             # Docker configuration
│   ├── dev/           # Development environment
│   └── prod/          # Production environment
│
├── docs/              # Project documentation
├── .env.example       # Environment variables example
├── .eslintrc.js       # ESLint configuration
├── .prettierrc        # Prettier configuration
├── package.json       # Project configuration
└── README.md          # This file
```

### Key Configuration Files

- `.env` - Environment variables (copy from `.env.example`)
- `docker-compose.yml` - Docker services configuration
- `apps/client/next.config.js` - Next.js configuration
- `apps/server/.env` - Backend environment variables
- `packages/database/prisma/schema.prisma` - Database schema

## 🔄 CI/CD Pipeline

The project includes a robust CI/CD pipeline using GitHub Actions. The workflow is defined in `.github/workflows/ci-cd.yml` and includes the following stages:

### Pipeline Stages

1. **Test**
   - Runs on every push and pull request
   - Sets up Node.js and PostgreSQL test environment
   - Installs dependencies with pnpm
   - Runs linting and type checking
   - Executes unit and integration tests

2. **Build**
   - Runs after successful tests on main branch
   - Builds the Next.js frontend and NestJS backend
   - Verifies production builds

3. **Deploy** (Production)
   - Triggered on pushes to main branch
   - Builds and pushes Docker images to Docker Hub
   - Deploys to production environment via SSH
   - Runs database migrations

### Environment Variables

Required GitHub Secrets:

| Secret               | Description                              |
| -------------------- | ---------------------------------------- |
| `DOCKERHUB_USERNAME` | Docker Hub username                      |
| `DOCKERHUB_TOKEN`    | Docker Hub access token                  |
| `SSH_PRIVATE_KEY`    | Private key for deployment server access |
| `SSH_HOST`           | Production server hostname               |
| `SSH_USER`           | SSH username for deployment              |
| `SSH_KNOWN_HOSTS`    | Known hosts entry for the server         |

### Manual Deployment

To deploy manually:

```bash
# Build and push Docker images
docker-compose -f docker/prod/docker-compose.yml build
docker-compose -f docker/prod/docker-compose.yml push

# Deploy to production
ssh user@production-server \
  "cd /path/to/deploy && \
   docker-compose -f docker/prod/docker-compose.yml pull && \
   docker-compose -f docker/prod/docker-compose.yml up -d"
```

## 🛠 Development Workflow

### Available Scripts

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Build for production
pnpm build

# Start production servers
pnpm start

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format

# Database operations
pnpm db:generate  # Generate Prisma client
pnpm db:migrate   # Run database migrations
pnpm db:seed      # Seed the database with test data
pnpm db:studio    # Open Prisma Studio

# Docker operations
pnpm docker:up    # Start all services
pnpm docker:down  # Stop all services
pnpm docker:logs  # View service logs
```

### Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/titan_pomade?schema=public"

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

# MeiliSearch
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=your_meilisearch_master_key
```

### Common Issues

1. **Database connection issues**
   - Ensure PostgreSQL is running
   - Verify `DATABASE_URL` in `.env` is correct
   - Run `pnpm db:migrate` to apply migrations

2. **Port conflicts**
   - Check if ports 3000 (frontend), 5000 (backend), and 5432 (PostgreSQL) are available
   - Update ports in `.env` if needed

3. **Docker issues**
   - Make sure Docker is running
   - Try rebuilding containers: `docker-compose up -d --build`

## 🌐 API Documentation

API documentation is automatically generated using Swagger and is available at `/api/docs` when running the development server.

### Example API Request

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

### Authentication

Most endpoints require authentication. Include the JWT token in the `Authorization` header:

```http
GET /api/users/me
Authorization: Bearer your.jwt.token.here
```

### API Response Format

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully"
}
```

### Error Responses

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "details": "No authorization token was found"
  }
}
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
- Write tests for new features
- Update documentation when necessary
- Ensure all tests pass before submitting a PR
- Keep pull requests focused and small

### Reporting Issues

Please use the [GitHub Issues](https://github.com/yourusername/titan-pomade/issues) to report bugs or suggest new features.

## 🚀 Deployment

### Production Deployment

1. Set up a production environment:

   ```bash
   # Build the application
   pnpm build

   # Start production services
   pnpm start
   ```

2. Using Docker in production:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Deployment Guides

- [Vercel](https://vercel.com/docs) - For frontend deployment
- [Railway](https://railway.app/) - For backend and database
- [Docker Swarm/Kubernetes](https://docs.docker.com/get-started/orchestration/) - For container orchestration

## 📦 Using GHCR (GitHub Container Registry) and Manual Deploy

This template ships with two GitHub Actions workflows:

- `CI` at `.github/workflows/ci-cd.yml` (runs on push/PR to main/develop)
- `Deploy` at `.github/workflows/deploy.yml` (manual only; safe for templates)

### 1) Enable GHCR publishing

- Go to GitHub: `Settings -> Actions -> General -> Workflow permissions`
  - Set to: "Read and write permissions" and enable "Allow GitHub Actions to create and approve pull requests" (optional)
- Ensure Packages are enabled for your org/repo (GHCR).
- No extra secrets are required for GHCR push; the provided `GITHUB_TOKEN` is used.

Images will be published as:

- `ghcr.io/<owner>/<repo>-api`
- `ghcr.io/<owner>/<repo>-web`

Tags include `stg-<sha>` / `prod-<sha>` and `latest`.

### 2) Optional database secrets for migrations

The Deploy workflow runs Prisma migrations only if the corresponding secret exists:

- `DATABASE_URL_STAGING`
- `DATABASE_URL_PROD`

If these secrets are not set (common for templates), migrations are skipped gracefully.

### 3) Run the manual Deploy workflow

1. Open the GitHub repo → `Actions` tab
2. Select `Deploy`
3. Click `Run workflow` and choose an environment value:
   - `staging` (uses `DATABASE_URL_STAGING` if present)
   - `production` (uses `DATABASE_URL_PROD` if present)

The workflow will:

- Build and push Docker images for API and Web to GHCR
- Optionally run DB migrations if the env secret is present
- Optionally notify Slack if `SLACK_WEBHOOK_URL` secret is set

### 4) Pull and run images locally (optional)

```bash
# Authenticate to GHCR (if needed for private images)
echo $GHCR_TOKEN | docker login ghcr.io -u <your-gh-username> --password-stdin

# Pull latest images
docker pull ghcr.io/<owner>/<repo>-api:latest
docker pull ghcr.io/<owner>/<repo>-web:latest

# Example: run API container
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  ghcr.io/<owner>/<repo>-api:latest

# Example: run Web container
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_API_URL="http://localhost:5000" \
  ghcr.io/<owner>/<repo>-web:latest
```

Tip: You can also adapt `docker/prod/docker-compose.yml` to point at GHCR images by setting the `image:` fields and removing the `build:` blocks.

## 🗺 Roadmap

### Upcoming Features

- [ ] User authentication with social providers
- [ ] Real-time features with WebSockets
- [ ] Admin dashboard
- [ ] API rate limiting
- [ ] Enhanced security headers

### In Progress

- [x] Basic authentication
- [x] API documentation
- [x] Docker setup

## 👥 Community

Join our community to get help and discuss Titan Pomade Stack:

- [GitHub Discussions](https://github.com/yourusername/titan-pomade/discussions) - For Q&A and discussions
- [Discord](https://discord.gg/your-invite-link) - For real-time chat
- [Twitter](https://twitter.com/yourhandle) - For updates and announcements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using the Titan Pomade Stack
- Special thanks to all contributors
- Inspired by modern web development best practices
- Thanks to all the open-source projects that made this possible
