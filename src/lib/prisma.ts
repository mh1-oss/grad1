import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prismaV3: PrismaClient };

export const prisma =
    globalForPrisma.prismaV3 ||
    new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaV3 = prisma;
