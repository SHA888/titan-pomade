import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// ============================================
// WARNING: DEVELOPMENT-ONLY SEED SCRIPT
// ============================================
// This script contains test user credentials that should NEVER be used in production.
// In a production environment, always:
// 1. Use strong, unique passwords from environment variables
// 2. Never commit real credentials to version control
// 3. Use proper user registration flows for creating real accounts
// ============================================

// Validate required environment variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const USER_PASSWORD = process.env.USER_PASSWORD || 'user123';

// Warn if using default passwords
if (!process.env.ADMIN_PASSWORD || !process.env.USER_PASSWORD) {
  console.warn(
    '\x1b[33m%s\x1b[0m', // Yellow text
    'WARNING: Using default passwords from seed script. ' +
      'Set ADMIN_PASSWORD and USER_PASSWORD environment variables in production.',
  );
}

// Define the User type explicitly since we can't import it directly
type User = {
  id: string;
  email: string;
  name: string | null;
  password: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
};

async function seed() {
  const prisma = new PrismaClient();

  try {
    // Hash passwords from environment variables or fallback to defaults
    const [adminPassword, userPassword] = await Promise.all([
      bcrypt.hash(ADMIN_PASSWORD, 10),
      bcrypt.hash(USER_PASSWORD, 10),
    ]);

    // Create users
    const users: User[] = [];

    // Admin user
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: adminPassword,
        role: 'ADMIN',
      },
    });
    users.push(admin);

    // Regular user
    const user = await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        name: 'Regular User',
        password: userPassword,
        role: 'USER',
      },
    });
    users.push(user);

    console.log('Seeded users:', { users });
    return { success: true, users };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error };
  } finally {
    await prisma.$disconnect();
  }
}

// Only run if this file is executed directly (not imported)
if (require.main === module) {
  seed()
    .then(({ success }) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Unexpected error in seed script:', error);
      process.exit(1);
    });
}

export default seed;
