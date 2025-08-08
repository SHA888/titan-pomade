# Database Documentation

This directory contains all database-related configurations, migrations, and utilities for the application.

## Prisma Setup

### Prerequisites

- Node.js 16+
- PostgreSQL 13+
- pnpm

### Environment Variables

Create a `.env` file in the `apps/api` directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/titan_pomade?schema=public"

# For production, use:
# DATABASE_URL="${DATABASE_URL}"
```

## Database Management

### Available Scripts

| Command                  | Description                                |
| ------------------------ | ------------------------------------------ |
| `pnpm db:generate`       | Generate Prisma Client                     |
| `pnpm db:migrate`        | Run database migrations in development     |
| `pnpm db:migrate:deploy` | Apply migrations in production             |
| `pnpm db:seed`           | Seed the database with test data           |
| `pnpm db:setup`          | Setup database (generate + migrate + seed) |
| `pnpm db:studio`         | Open Prisma Studio for database management |

### Running Migrations

1. **Create a new migration** (after schema changes):

   ```bash
   pnpm db:migrate --name migration_name
   ```

2. **Apply pending migrations**:
   ```bash
   pnpm db:migrate:deploy
   ```

### Seeding the Database

To populate the database with initial test data, use the seed script:

```bash
# Run the seed script
pnpm db:seed

# Or run it directly
pnpm ts-node prisma/seed.ts
```

#### Seed Script Details

The seed script (`seed.ts`) creates the following test users:

1. **Admin User**
   - Email: `admin@example.com`
   - Password: `admin123`
   - Role: `ADMIN`

2. **Regular User**
   - Email: `user@example.com`
   - Password: `user123`
   - Role: `USER`

#### Idempotent Operation

The seed script is idempotent, meaning it can be safely run multiple times. It uses `upsert` operations to:

- Create users if they don't exist
- Update existing users if their data has changed
- Leave users unchanged if they already match the expected state

#### Programmatic Usage

You can also import and use the seed function programmatically:

```typescript
import seed from './prisma/seed';

// Later in your code
const { success, users } = await seed();
```

This is useful for testing or when you need to seed the database as part of another process.

```bash
pnpm db:seed
```

## Database Schema

### Models

#### User

- `id`: String (UUID)
- `email`: String (unique)
- `password`: String (hashed)
- `name`: String (optional)
- `role`: Enum (USER, ADMIN)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## Development Workflow

1. Make changes to `schema.prisma`
2. Generate and apply migrations:
   ```bash
   pnpm db:migrate --name descriptive_name
   ```
3. Test your changes:
   ```bash
   pnpm test
   ```

## Production Deployment

1. Set the `DATABASE_URL` environment variable
2. Apply migrations:
   ```bash
   pnpm db:migrate:deploy
   ```

## Database Access

### Prisma Studio

For visual database management:

```bash
pnpm db:studio
```

## Troubleshooting

### Connection Issues

- Verify `DATABASE_URL` is correctly set
- Ensure PostgreSQL is running
- Check database credentials

### Migration Issues

- If migrations fail, check the error message and review the migration files
- You may need to reset the database in development:
  ```bash
  pnpm prisma migrate reset
  ```

## Best Practices

- Always create migrations for schema changes
- Keep seed data minimal and development-only
- Use transactions for complex operations
- Regularly backup production data

### Available Test Users

#### Admin User:

- Email: admin@example.com
- Password: `admin123`
- Role: `ADMIN`

#### Regular User:

- Email: user@example.com
- Password: `user123`
- Role: `USER`
