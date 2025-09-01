# 🚀 Development Environment Setup Checklist

Use this checklist to ensure your Titan Pomade development environment is properly set up and working.

## ✅ Pre-Setup Requirements

- [ ] **Docker Desktop installed and running**
  - Version: 24.x or later
  - Memory allocation: At least 4GB (8GB recommended)
  - CPU: At least 2 cores

- [ ] **Node.js installed**
  - Version: 18.x or later
  - Check: `node --version`

- [ ] **pnpm installed**
  - Version: 8.x or later
  - Install: `npm install -g pnpm`
  - Check: `pnpm --version`

- [ ] **Git installed and configured**
  - Check: `git --version`
  - Configured: `git config --list`

## ✅ Initial Setup

- [ ] **Repository cloned**
  ```bash
  git clone <repository-url>
  cd titan-pomade
  ```

- [ ] **Development script executable**
  ```bash
  chmod +x ./dev.sh
  ```

- [ ] **Environment setup completed**
  ```bash
  ./dev.sh setup
  ```

- [ ] **Environment files created**
  - [ ] `.env` (root)
  - [ ] `apps/api/.env` (API)
  - [ ] `apps/web/.env.local` (Web)

## ✅ Docker Environment

- [ ] **All services started successfully**
  ```bash
  ./dev.sh start
  ```

- [ ] **Services are healthy**
  ```bash
  ./dev.sh status
  ```

- [ ] **Database migrations completed**
  - Should happen automatically during start
  - Manual check: `./dev.sh db-migrate`

- [ ] **Database seeded with test data**
  - Should happen automatically during start
  - Manual check: `./dev.sh db-seed`

## ✅ Service Accessibility

- [ ] **Web Application (Frontend)**
  - URL: http://localhost:3000
  - Status: Loading successfully
  - Hot reload: File changes trigger updates

- [ ] **API Server (Backend)**
  - URL: http://localhost:5000
  - Health check: http://localhost:5000/health
  - Returns: `{\"status\":\"ok\",\"info\":{...}}`

- [ ] **API Documentation**
  - URL: http://localhost:5000/api/docs
  - Status: Swagger UI loads
  - Content: Shows all available endpoints

- [ ] **MeiliSearch**
  - URL: http://localhost:7700
  - Status: Returns MeiliSearch info
  - Authentication: Works with master key \"masterKey\"

- [ ] **PostgreSQL Database**
  - Host: localhost:5432
  - Database: titan_pomade_dev
  - User: postgres
  - Password: postgres
  - Test connection: `./dev.sh db-shell`

- [ ] **Redis**
  - Host: localhost:6379
  - Test: Can connect via Redis CLI

## ✅ Development Workflow

- [ ] **Hot reloading works**
  - Frontend: Edit a React component, see changes
  - Backend: Edit a NestJS controller, see changes

- [ ] **Database operations work**
  - [ ] Can run migrations: `./dev.sh db-migrate`
  - [ ] Can seed data: `./dev.sh db-seed`
  - [ ] Can access DB shell: `./dev.sh db-shell`

- [ ] **Logging is working**
  - [ ] Can view all logs: `./dev.sh logs`
  - [ ] Can view API logs: `./dev.sh logs-api`
  - [ ] Can view Web logs: `./dev.sh logs-web`

- [ ] **Container access works**
  - [ ] Can shell into API: `./dev.sh shell-api`
  - [ ] Can shell into Web: `./dev.sh shell-web`

## ✅ Authentication & Features

- [ ] **API authentication works**
  - Can register new user via API
  - Can login and receive JWT token
  - Protected endpoints require valid token

- [ ] **Database schema is correct**
  - All tables created (users, products, orders, etc.)
  - Foreign key relationships working
  - Indexes created properly

- [ ] **Search functionality**
  - MeiliSearch indexes created
  - Search API endpoints working
  - Search results returned correctly

## ✅ Development Tools

- [ ] **Code quality tools work**
  - ESLint: `pnpm lint`
  - Prettier: `pnpm format`
  - TypeScript: No compilation errors

- [ ] **Testing setup**
  - [ ] API tests: `pnpm --filter @titan-pomade/api test`
  - [ ] Web tests: `pnpm --filter @titan-pomade/web test`

- [ ] **Build process works**
  - [ ] API build: `pnpm --filter @titan-pomade/api build`
  - [ ] Web build: `pnpm --filter @titan-pomade/web build`

## ✅ Troubleshooting Completed (If Issues Occurred)

- [ ] **Port conflicts resolved**
  - No other services running on ports 3000, 5000, 5432, 6379, 7700

- [ ] **Docker issues resolved**
  - Containers start without errors
  - Volume mounts working correctly
  - Network connectivity between containers

- [ ] **Permission issues resolved**
  - Scripts are executable
  - File system permissions correct

- [ ] **Memory/Resource issues resolved**
  - Docker has sufficient memory allocated
  - No out-of-memory errors in logs

## ✅ Optional Enhancements

- [ ] **IDE setup optimized**
  - VS Code with recommended extensions
  - ESLint and Prettier integration
  - TypeScript support configured

- [ ] **Git hooks configured**
  - Husky pre-commit hooks working
  - Commitlint enforcing conventional commits

- [ ] **Additional tools**
  - Prisma Studio: `pnpm db:studio`
  - Database GUI client connected

## 🚨 Common Issues & Solutions

### Issue: Services won't start
**Solution:**
```bash
./dev.sh clean
./dev.sh build
./dev.sh start
```

### Issue: Database connection errors
**Solution:**
```bash
# Check if PostgreSQL is healthy
./dev.sh status

# Reset database if needed
./dev.sh db-reset
```

### Issue: Hot reloading not working
**Solution:**
- Check file polling is enabled (WATCHPACK_POLLING=true)
- Restart specific service: `docker-compose -f docker/dev/docker-compose.yml restart web`

### Issue: Port already in use
**Solution:**
```bash
# Find what's using the port
lsof -i :3000

# Stop conflicting services
./dev.sh stop
```

### Issue: Permission denied errors
**Solution:**
```bash
# Fix script permissions
chmod +x ./dev.sh

# Fix Docker permissions (Linux)
sudo usermod -aG docker $USER
# Then log out and back in
```

## 📞 Getting Help

If you're still having issues after going through this checklist:

1. **Check the logs**: `./dev.sh logs`
2. **Review the documentation**: [docs/DOCKER_DEVELOPMENT.md](docs/DOCKER_DEVELOPMENT.md)
3. **Search existing issues**: GitHub Issues
4. **Ask for help**: GitHub Discussions or Discord

## ✅ Setup Complete!

Once all items are checked, your development environment is ready! You can now:

- Start developing new features
- Make changes and see them reflected immediately
- Run tests and ensure code quality
- Commit changes with confidence

**Happy coding! 🎉**