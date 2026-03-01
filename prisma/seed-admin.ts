import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
        where: { email: 'admin@techshop.com' },
        update: { password: hashedPassword, role: 'ADMIN' },
        create: {
            email: 'admin@techshop.com',
            password: hashedPassword,
            name: 'Store Admin',
            role: 'ADMIN',
        },
    });
    console.log('Admin user seeded successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
