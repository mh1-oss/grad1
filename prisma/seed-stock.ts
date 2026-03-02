import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const result = await prisma.product.updateMany({
        data: { stock: 10 }
    });
    console.log('Updated', result.count, 'products with stock=10');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma['$disconnect'](); });
