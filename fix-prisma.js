const fs = require('fs');
const path = require('path');

const filesToFix = [
    'src/app/page.tsx',
    'src/app/products/page.tsx',
    'src/app/products/[id]/page.tsx',
    'src/app/profile/page.tsx',
    'src/app/api/auth/register/route.ts',
    'src/app/api/auth/login/route.ts',
    'src/app/api/auth/me/route.ts',
    'src/app/api/categories/route.ts',
    'src/app/api/products/route.ts',
    'src/app/api/products/[id]/route.ts'
];

for (const file of filesToFix) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf-8');

    // Replace standard Prisma import and init with the lib/prisma import
    content = content.replace(/import\s+{\s*PrismaClient\s*}\s+from\s+['"]@prisma\/client['"];[\s\S]*?const\s+prisma\s*=\s*new\s+PrismaClient\(\);/m, "import { prisma } from '@/lib/prisma';");

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Fixed', file);
}
