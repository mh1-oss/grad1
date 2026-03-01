import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialSlides = [
    {
        badge: "New Collection",
        title: "Elevate Your Everyday Style",
        subtitle: "Discover our latest arrivals of premium electronics, modern furniture, and trending fashion. Unbeatable quality for your lifestyle.",
        imageURL: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
        linkText: "Shop Collection",
        linkUrl: "/products",
        order: 1
    },
    {
        badge: "Premium Tech",
        title: "Tech That Inspires",
        subtitle: "Upgrade your workspace with our curated selection of high-performance laptops, monitors, smart home devices, and accessories.",
        imageURL: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1200&auto=format&fit=crop",
        linkText: "View Tech",
        linkUrl: "/products",
        order: 2
    },
    {
        badge: "Seasonal Sale",
        title: "Up to 50% Off",
        subtitle: "Don't miss out on our limited-time seasonal sale. Save big on your favorite items across all categories today.",
        imageURL: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop",
        linkText: "Shop Sale",
        linkUrl: "/products",
        order: 3
    }
];

async function main() {
    console.log('Clearing existing slides...');
    await prisma.slide.deleteMany();

    console.log('Seeding initial slides...');
    for (const slide of initialSlides) {
        await prisma.slide.create({
            data: slide
        });
    }
    console.log('Slides seeded successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
