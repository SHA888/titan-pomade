<div align="center">

# Titan Pomade

A modern, full-stack e-commerce web application built with TypeScript, Next.js, and NestJS.

## 🚀 Features

### Frontend (Next.js)
- **TypeScript** - Type-safe development
- **Next.js 14** - App Router with Server Components
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Reusable component library
- **React Hooks** - State and lifecycle management
- **Optimistic UI Updates** - Enhanced user experience with immediate feedback
- **Reusable CRUD Components** - Comprehensive form and data table components

### Backend (NestJS)
- **TypeScript** - Type-safe development
- **NestJS 10** - Modular architecture with dependency injection
- **PostgreSQL** - Relational database with Prisma ORM
- **MeiliSearch** - Fast search engine integration
- **JWT Authentication** - Secure user authentication with refresh tokens
- **Swagger/OpenAPI** - Auto-generated API documentation
- **API Versioning** - Structured API version management
- **Rate Limiting** - Throttling to prevent abuse
- **Health Checks** - Application monitoring endpoints

### Shared
- **Monorepo Structure** - Shared code between frontend and backend
- **Docker** - Containerized development and production environments
- **CI/CD** - GitHub Actions for automated testing and deployment

## 🏗️ Architecture

```
titan-pomade/
├── apps/
│   ├── api/         # NestJS backend API
│   └── web/         # Next.js frontend application
├── packages/
│   └── shared/      # Shared code between apps
├── docker/          # Docker configurations
└── docs/            # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- pnpm package manager

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

3. Copy environment files:
   ```bash
   cp .env.example .env
   cp apps/web/.env.example apps/web/.env.local
   ```

4. Start development services:
   ```bash
   docker-compose up -d
   ```

5. Run database migrations:
   ```bash
   pnpm db:setup
   ```

6. Start development servers:
   ```bash
   pnpm dev
   ```

### Development Scripts

- `pnpm dev` - Start both frontend and backend in development mode
- `pnpm build` - Build all applications
- `pnpm test` - Run tests for all applications
- `pnpm lint` - Lint all code
- `pnpm format` - Format code with Prettier

### Database

The application uses PostgreSQL with Prisma ORM:

- **Migrations**: `pnpm db:migrate`
- **Seeding**: `pnpm db:seed`
- **Studio**: `pnpm db:studio`

### API Documentation

- **Swagger UI**: Available at `http://localhost:5000/api/docs` in development
- **Postman Collection**: Available in `docs/` directory

## 🛠️ Development

### Environment Variables

Key environment variables:

- `PORT` - API server port (default: 5000)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT token signing
- `NEXT_PUBLIC_API_URL` - Frontend API URL

### API Versioning

The API implements versioning through URL paths:
- Version 1: `http://localhost:5000/api/v1/`

### CRUD Operations

The application provides a complete CRUD implementation with:
- Standardized service layers
- Optimistic UI updates
- Reusable form components
- Data table components with pagination
- Error handling and validation

### Rate Limiting

API rate limiting is configured with:
- 100 requests per minute by default
- Configurable through environment variables

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Development Guidelines](./docs/DEVELOPMENT.md)

## 🧪 Testing

- **Unit Tests**: Jest for both frontend and backend
- **Integration Tests**: Supertest for API endpoints
- **E2E Tests**: Cypress for frontend user flows

Run tests with:
```bash
pnpm test
pnpm test:watch
pnpm test:cov
```

## 🐳 Deployment

### Docker

Production Docker images can be built with:
```bash
docker-compose -f docker/prod/docker-compose.yml build
```

### Environment

For production deployment, ensure these environment variables are set:
- `NODE_ENV=production`
- Secure `JWT_SECRET`
- Production database URL
- Proper CORS configuration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
