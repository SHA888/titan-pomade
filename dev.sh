#!/bin/bash
# =============================================================================
# Titan Pomade Development Helper Script
# =============================================================================
# This script provides convenient commands for Docker development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Docker Compose file
DOCKER_COMPOSE_FILE="docker/dev/docker-compose.yml"

# Print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Help function
show_help() {
    echo "Titan Pomade Development Helper"
    echo ""
    echo "Usage: ./dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  setup     - Initial setup (copy env files, install deps)"
    echo "  start     - Start all development services"
    echo "  stop      - Stop all development services"
    echo "  restart   - Restart all development services"
    echo "  clean     - Stop and remove containers, volumes, and images"
    echo "  logs      - Show logs from all services"
    echo "  logs-api  - Show logs from API service only"
    echo "  logs-web  - Show logs from web service only"
    echo "  shell-api - Open shell in API container"
    echo "  shell-web - Open shell in web container"
    echo "  db-shell  - Open PostgreSQL shell"
    echo "  db-reset  - Reset database (drop, create, migrate, seed)"
    echo "  db-migrate- Run database migrations"
    echo "  db-seed   - Seed database with test data"
    echo "  status    - Show status of all services"
    echo "  build     - Build development images"
    echo "  help      - Show this help message"
}

# Setup function
setup() {
    print_info "Setting up Titan Pomade development environment..."
    
    # Copy environment files if they don't exist
    if [ ! -f ".env" ]; then
        print_info "Copying root environment file..."
        cp .env.example .env
        print_success "Created .env from .env.example"
    fi
    
    if [ ! -f "apps/api/.env" ]; then
        print_info "Copying API environment file..."
        cp apps/api/.env.example apps/api/.env
        print_success "Created apps/api/.env from apps/api/.env.example"
    fi
    
    if [ ! -f "apps/web/.env.local" ]; then
        print_info "Copying Web environment file..."
        cp apps/web/.env.example apps/web/.env.local
        print_success "Created apps/web/.env.local from apps/web/.env.example"
    fi
    
    # Install dependencies
    print_info "Installing dependencies..."
    pnpm install
    print_success "Dependencies installed"
    
    print_success "Setup completed! You can now run './dev.sh start' to start the development environment."
}

# Start services
start() {
    print_info "Starting Titan Pomade development environment..."
    docker-compose -f $DOCKER_COMPOSE_FILE up -d
    
    print_info "Waiting for services to be ready..."
    sleep 10
    
    print_info "Running database migrations..."
    docker-compose -f $DOCKER_COMPOSE_FILE exec api pnpm --filter @titan-pomade/api db:migrate
    
    print_info "Seeding database..."
    docker-compose -f $DOCKER_COMPOSE_FILE exec api pnpm --filter @titan-pomade/api db:seed
    
    print_success "Development environment is running!"
    print_info "📱 Web: http://localhost:3000"
    print_info "🚀 API: http://localhost:5000"
    print_info "🔍 MeiliSearch: http://localhost:7700"
    print_info "🗄️  PostgreSQL: localhost:5432"
    print_info "📝 Redis: localhost:6379"
}

# Stop services
stop() {
    print_info "Stopping Titan Pomade development environment..."
    docker-compose -f $DOCKER_COMPOSE_FILE down
    print_success "Development environment stopped"
}

# Restart services
restart() {
    print_info "Restarting Titan Pomade development environment..."
    stop
    start
}

# Clean everything
clean() {
    print_warning "This will remove all containers, volumes, and images. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        print_info "Cleaning up development environment..."
        docker-compose -f $DOCKER_COMPOSE_FILE down -v --rmi all
        docker system prune -f
        print_success "Development environment cleaned"
    else
        print_info "Clean operation cancelled"
    fi
}

# Show logs
logs() {
    docker-compose -f $DOCKER_COMPOSE_FILE logs -f
}

# Show API logs
logs_api() {
    docker-compose -f $DOCKER_COMPOSE_FILE logs -f api
}

# Show Web logs
logs_web() {
    docker-compose -f $DOCKER_COMPOSE_FILE logs -f web
}

# Open shell in API container
shell_api() {
    docker-compose -f $DOCKER_COMPOSE_FILE exec api sh
}

# Open shell in Web container
shell_web() {
    docker-compose -f $DOCKER_COMPOSE_FILE exec web sh
}

# Open PostgreSQL shell
db_shell() {
    docker-compose -f $DOCKER_COMPOSE_FILE exec postgres psql -U postgres -d titan_pomade_dev
}

# Reset database
db_reset() {
    print_warning "This will reset the database. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        print_info "Resetting database..."
        docker-compose -f $DOCKER_COMPOSE_FILE exec api pnpm --filter @titan-pomade/api prisma migrate reset --force
        print_success "Database reset completed"
    else
        print_info "Database reset cancelled"
    fi
}

# Run migrations
db_migrate() {
    print_info "Running database migrations..."
    docker-compose -f $DOCKER_COMPOSE_FILE exec api pnpm --filter @titan-pomade/api db:migrate
    print_success "Database migrations completed"
}

# Seed database
db_seed() {
    print_info "Seeding database..."
    docker-compose -f $DOCKER_COMPOSE_FILE exec api pnpm --filter @titan-pomade/api db:seed
    print_success "Database seeding completed"
}

# Show status
status() {
    print_info "Titan Pomade Development Environment Status:"
    docker-compose -f $DOCKER_COMPOSE_FILE ps
}

# Build images
build() {
    print_info "Building development images..."
    docker-compose -f $DOCKER_COMPOSE_FILE build --no-cache
    print_success "Images built successfully"
}

# Main script logic
case "$1" in
    setup)
        setup
        ;;
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    clean)
        clean
        ;;
    logs)
        logs
        ;;
    logs-api)
        logs_api
        ;;
    logs-web)
        logs_web
        ;;
    shell-api)
        shell_api
        ;;
    shell-web)
        shell_web
        ;;
    db-shell)
        db_shell
        ;;
    db-reset)
        db_reset
        ;;
    db-migrate)
        db_migrate
        ;;
    db-seed)
        db_seed
        ;;
    status)
        status
        ;;
    build)
        build
        ;;
    help|--help|-h)
        show_help
        ;;
    "")
        print_error "No command specified"
        show_help
        exit 1
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac