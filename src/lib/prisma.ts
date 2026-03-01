import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prismaV2: PrismaClient };

export const prisma =
    globalForPrisma.prismaV2 ||
    new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaV2 = prisma;
