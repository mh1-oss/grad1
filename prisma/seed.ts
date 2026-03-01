import "dotenv/config";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');

    // Delete existing data to prevent duplicates on re-seed
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    // Fetch Categories from Platzi API
    console.log('Fetching categories from Platzi Fake Store API...');
    const categoriesResponse = await fetch('https://api.escuelajs.co/api/v1/categories');
    const apiCategories = await categoriesResponse.json();

    const categoryMap = new Map();

    for (const apiCat of apiCategories.slice(0, 5)) { // Limit to 5 categories to avoid giant seeds
        const category = await prisma.category.create({
            data: {
                name: apiCat.name,
                imageURL: apiCat.image,
            },
        });
        categoryMap.set(apiCat.id, category.id);
        console.log(`Created category: ${category.name}`);
    }

    // Fetch Products from Platzi API
    console.log('Fetching products from Platzi Fake Store API...');
    const productsResponse = await fetch('https://api.escuelajs.co/api/v1/products');
    const apiProducts = await productsResponse.json();

    let productCount = 0;
    for (const apiProd of apiProducts.slice(0, 30)) { // Limit to 30 products
        const categoryId = categoryMap.get(apiProd.category.id);

        // Skip products if their category wasn't created
        if (!categoryId) continue;

        // Platzi API sometimes returns JSON stringified arrays for images in some newer items
        let imageURL = '';
        if (apiProd.images && apiProd.images.length > 0) {
            try {
                // Handle cases where the image is a JSON string array ex: '[\"https://...\"]'
                let imgStr = apiProd.images[0];
                if (imgStr.startsWith('[') && imgStr.endsWith(']')) {
                    const parsed = JSON.parse(imgStr);
                    imageURL = parsed[0];
                } else {
                    imageURL = imgStr;
                }

                // Remove trailing quotes or brackets if incorrectly formatted by API
                imageURL = imageURL.replace(/^\["?/, '').replace(/"?]$/, '');
            } catch {
                imageURL = apiProd.images[0];
            }
        }

        await prisma.product.create({
            data: {
                title: apiProd.title,
                price: apiProd.price,
                description: apiProd.description,
                imageURL: imageURL,
                categoryId: categoryId,
            }
        });
        productCount++;
    }

    console.log(`Successfully created ${productCount} products.`);

    console.log('Seed completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
