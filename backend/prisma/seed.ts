import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminPassword = await bcrypt.hash('Admin123', 12);
  const userPassword = await bcrypt.hash('User1234', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
      notes: {
        create: [
          { title: 'Admin Welcome Note', content: 'Welcome to the Notes Admin Dashboard. You have full access.' },
        ],
      },
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      role: 'USER',
      notes: {
        create: [
          { title: 'My First Note', content: 'This is my first note in the app!' },
          { title: 'Meeting Notes', content: 'Discuss project scope and timeline with the team.' },
        ],
      },
    },
  });

  console.log('✅ Seeded:');
  console.log(`  Admin → ${admin.email} (password: Admin123)`);
  console.log(`  User  → ${user.email} (password: User1234)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
