# Docker Development Environment Guide

This guide explains how to set up and use the Docker development environment for Titan Pomade.

## 🚀 Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine + Docker Compose
- [Node.js](https://nodejs.org/) 18+ (for local dependency management)
- [pnpm](https://pnpm.io/installation) 8+

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd titan-pomade
   ```

2. **Run the setup script**
   ```bash
   ./dev.sh setup
   ```
   This will:
   - Copy environment files from examples
   - Install dependencies with pnpm
   - Prepare the development environment

3. **Start the development environment**
   ```bash
   ./dev.sh start
   ```
   This will:
   - Start PostgreSQL, Redis, and MeiliSearch
   - Build and start API and Web containers
   - Run database migrations
   - Seed the database with test data

### Access Your Application

Once started, you can access:

- 🌐 **Web Application**: http://localhost:3000
- 🚀 **API Server**: http://localhost:5000
- 📚 **API Documentation**: http://localhost:5000/api/docs
- 🔍 **MeiliSearch**: http://localhost:7700
- 🗄️ **PostgreSQL**: localhost:5432 (user: postgres, password: postgres, db: titan_pomade_dev)
- 📝 **Redis**: localhost:6379

## 🛠️ Development Scripts

The `dev.sh` script provides convenient commands for managing your development environment:

### Environment Management
```bash
./dev.sh setup     # Initial setup
./dev.sh start     # Start all services
./dev.sh stop      # Stop all services
./dev.sh restart   # Restart all services
./dev.sh status    # Show service status
./dev.sh clean     # Clean up everything (containers, volumes, images)
```

### Logging and Debugging
```bash
./dev.sh logs      # Show logs from all services
./dev.sh logs-api  # Show API logs only
./dev.sh logs-web  # Show Web logs only
```

### Container Access
```bash
./dev.sh shell-api # Open shell in API container
./dev.sh shell-web # Open shell in Web container
./dev.sh db-shell  # Open PostgreSQL shell
```

### Database Operations
```bash
./dev.sh db-migrate # Run database migrations
./dev.sh db-seed    # Seed database with test data
./dev.sh db-reset   # Reset database (dangerous!)
```

### Alternative npm/pnpm Scripts

You can also use these package.json scripts:

```bash
# Docker operations
pnpm docker:setup    # Same as ./dev.sh setup
pnpm docker:dev      # Same as ./dev.sh start
pnpm docker:stop     # Same as ./dev.sh stop
pnpm docker:restart  # Same as ./dev.sh restart
pnpm docker:clean    # Same as ./dev.sh clean
pnpm docker:logs     # Same as ./dev.sh logs
pnpm docker:status   # Same as ./dev.sh status
pnpm docker:build    # Same as ./dev.sh build

# Database operations
pnpm db:migrate      # Run migrations
pnpm db:seed         # Seed database
pnpm db:studio       # Open Prisma Studio
pnpm db:reset        # Reset database
```

## 🔧 Configuration

### Environment Variables

The development environment uses these key environment files:

- **Root**: `.env` (copied from `.env.example`)
- **API**: `apps/api/.env` (copied from `apps/api/.env.example`)
- **Web**: `apps/web/.env.local` (copied from `apps/web/.env.example`)

### Hot Reloading

Both the API and Web applications support hot reloading:

- **API**: Uses NestJS watch mode (`nest start --watch`)
- **Web**: Uses Next.js development mode with file polling for Docker

File changes in your local directory will automatically trigger rebuilds in the containers.

### Volume Mapping

The development setup uses several volume mappings for optimal performance:

- **Source Code**: `../../:/app` - Maps your local code to the container
- **Node Modules**: Separate volumes prevent conflicts between host and container
- **Next.js Cache**: Persistent `.next` directory for faster builds
- **Database**: Persistent PostgreSQL data

## 🐳 Docker Services

### API Service (`api`)
- **Port**: 5000
- **Framework**: NestJS
- **Features**: Auto-restart, hot reloading, Prisma client generation
- **Health**: Depends on PostgreSQL, Redis, and MeiliSearch

### Web Service (`web`)
- **Port**: 3000
- **Framework**: Next.js 14 with App Router
- **Features**: Hot reloading, file polling for Docker compatibility
- **Dependencies**: API service

### PostgreSQL (`postgres`)
- **Port**: 5432
- **Version**: 16-alpine
- **Database**: `titan_pomade_dev`
- **Features**: Persistent data, health checks, initialization scripts

### Redis (`redis`)
- **Port**: 6379
- **Version**: 7-alpine
- **Features**: Persistent data, health checks

### MeiliSearch (`meilisearch`)
- **Port**: 7700
- **Version**: 1.5
- **Features**: Persistent data, development master key

## 🔍 Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check if ports are in use
   lsof -i :3000,5000,5432,6379,7700
   
   # Stop conflicting services
   ./dev.sh stop
   ```

2. **Permission Issues**
   ```bash
   # Fix script permissions
   chmod +x ./dev.sh
   ```

3. **Database Connection Issues**
   ```bash
   # Check PostgreSQL status
   ./dev.sh status
   
   # Reset database if needed
   ./dev.sh db-reset
   ```

4. **Container Build Issues**
   ```bash
   # Rebuild containers from scratch
   ./dev.sh clean
   ./dev.sh build
   ./dev.sh start
   ```

5. **Hot Reloading Not Working**
   - Ensure your editor isn't using temp files for saves
   - Check if file polling is enabled (WATCHPACK_POLLING=true)
   - Restart the specific service: `docker-compose -f docker/dev/docker-compose.yml restart web`

### Logs and Debugging

```bash
# View all logs
./dev.sh logs

# View specific service logs
docker-compose -f docker/dev/docker-compose.yml logs -f api
docker-compose -f docker/dev/docker-compose.yml logs -f web

# Check container status
docker ps

# Inspect a specific container
docker inspect titan-pomade-api-dev
```

### Performance Optimization

1. **Allocate sufficient resources to Docker Desktop**
   - Minimum 4GB RAM, 8GB recommended
   - At least 2 CPU cores

2. **Use Docker volume optimization**
   - The setup uses named volumes for node_modules to improve performance
   - Don't disable volume caching

3. **Enable file system optimizations**
   - On macOS: Consider Docker Desktop with VirtioFS
   - On Windows: Use WSL2 backend

## 🧪 Testing

To run tests in the Docker environment:

```bash
# API tests
docker-compose -f docker/dev/docker-compose.yml exec api pnpm test

# Web tests
docker-compose -f docker/dev/docker-compose.yml exec web pnpm test

# E2E tests
docker-compose -f docker/dev/docker-compose.yml exec api pnpm test:e2e
```

## 📝 Development Workflow

1. **Start your development session**
   ```bash
   ./dev.sh start
   ```

2. **Make code changes**
   - Edit files in your local editor
   - Changes are automatically reflected in containers

3. **Run database operations when needed**
   ```bash
   ./dev.sh db-migrate  # After schema changes
   ./dev.sh db-seed     # To refresh test data
   ```

4. **Monitor logs for issues**
   ```bash
   ./dev.sh logs-api    # API issues
   ./dev.sh logs-web    # Frontend issues
   ```

5. **Stop when done**
   ```bash
   ./dev.sh stop
   ```

## 🔒 Security Notes

- The development environment uses default credentials (suitable for local development only)
- MeiliSearch master key is set to \"masterKey\" for development
- JWT secrets are set to development values
- **Never use these configurations in production**

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [MeiliSearch Documentation](https://docs.meilisearch.com/)