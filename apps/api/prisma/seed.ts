import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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
    // Hash passwords first
    const [adminPassword, userPassword] = await Promise.all([
      bcrypt.hash('admin123', 10),
      bcrypt.hash('user123', 10),
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
