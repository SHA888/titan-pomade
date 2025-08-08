// Plain JS seed script to avoid ts-node resolution issues
/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');
const { randomUUID } = require('crypto');
const bcrypt = require('bcrypt');

// DEVELOPMENT-ONLY SEED SCRIPT
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const USER_PASSWORD = process.env.USER_PASSWORD || 'user123';

if (!process.env.ADMIN_PASSWORD || !process.env.USER_PASSWORD) {
  console.warn(
    '\x1b[33m%s\x1b[0m',
    'WARNING: Using default passwords from seed script. ' +
      'Set ADMIN_PASSWORD and USER_PASSWORD environment variables in production.',
  );
}

async function seed() {
  const prisma = new PrismaClient();

  try {
    const [adminPassword, userPassword] = await Promise.all([
      bcrypt.hash(ADMIN_PASSWORD, 10),
      bcrypt.hash(USER_PASSWORD, 10),
    ]);

    const users = [];

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

    // Seed DB-driven role-permission mapping using Prisma client
    await prisma.rolePermission.createMany({
      data: [
        { id: randomUUID(), role: 'USER', permission: 'VIEW_DASHBOARD' },
        { id: randomUUID(), role: 'ADMIN', permission: 'VIEW_DASHBOARD' },
        { id: randomUUID(), role: 'ADMIN', permission: 'MANAGE_USERS' },
        { id: randomUUID(), role: 'ADMIN', permission: 'MANAGE_PRODUCTS' },
        { id: randomUUID(), role: 'ADMIN', permission: 'MANAGE_ORDERS' },
      ],
      skipDuplicates: true,
    });

    console.log('Seeded users and role-permissions:', { users });
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seed().then(() => process.exit());
}

module.exports = seed;
