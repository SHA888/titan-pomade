# Deployment Guide

This guide explains how to deploy the Titan Pomade Stack to production environments.

## Prerequisites

- Docker and Docker Compose
- A server with at least 2GB RAM (4GB recommended)
- Domain name (optional but recommended)
- SSL certificate (recommended)

## Production Deployment with Docker

1. **Prepare your server**
   ```bash
   # Update system packages
   sudo apt update && sudo apt upgrade -y
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/titan-pomade.git
   cd titan-pomade
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.production
   # Edit .env.production with your production settings
   ```

4. **Start the application**
   ```bash
   # Start all services
   docker-compose -f docker-compose.prod.yml up -d
   
   # Run database migrations
   docker-compose -f docker-compose.prod.yml exec app pnpm db:migrate
   ```

## Deployment Options

### 1. Vercel (Frontend)

1. Connect your GitHub repository to Vercel
2. Set up environment variables from your `.env.production`
3. Set the build command: `pnpm build`
4. Set the output directory: `.next`
5. Deploy!

### 2. Railway (Backend & Database)

1. Create a new Railway project
2. Connect your GitHub repository
3. Add services for:
   - PostgreSQL
   - Redis
   - Your application
4. Configure environment variables
5. Deploy!

## Environment Variables

Required environment variables for production:

```env
NODE_ENV=production

# Database
POSTGRES_USER=your_production_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=your_production_db

# Authentication
JWT_SECRET=your_secure_jwt_secret
JWT_REFRESH_SECRET=your_secure_refresh_secret

# CORS
CORS_ORIGIN=https://your-frontend-domain.com
```

## SSL Configuration

Use Let's Encrypt with Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring and Logging

### Logs

View container logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### Monitoring

Set up monitoring with:
- [Prometheus](https://prometheus.io/)
- [Grafana](https://grafana.com/)
- [Sentry](https://sentry.io/)

## Backup and Recovery

### Database Backups

Create a backup:
```bash
docker exec -t your_postgres_container pg_dump -U your_user -d your_db > backup_$(date +%Y-%m-%d).sql
```

### Restore from Backup

```bash
cat backup_file.sql | docker exec -i your_postgres_container psql -U your_user -d your_db
```

## Scaling

### Horizontal Scaling

1. **Database**: Consider using a managed database service
2. **Application**: Use a load balancer with multiple app instances
3. **Caching**: Use Redis for distributed caching

### Vertical Scaling

- Increase server resources (CPU, RAM) as needed
- Optimize database queries and add indexes
- Implement caching strategies

## Maintenance

### Updating the Application

1. Pull the latest changes
2. Rebuild and restart containers:
   ```bash
   git pull
   docker-compose -f docker-compose.prod.yml up -d --build
   docker-compose -f docker-compose.prod.yml exec app pnpm db:migrate
   ```

### Security Updates

Regularly update:
- Node.js
- Docker images
- Dependencies (run `pnpm update` and test before deploying)
