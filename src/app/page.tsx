import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import HeroSlider from '@/components/HeroSlider';

// Disable caching for this page so it fetches fresh from DB
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch Slides
  const slides = await (prisma as any).slide.findMany({
    orderBy: { order: 'asc' },
  });

  // Fetch Top Categories
  const categories = await prisma.category.findMany({
    take: 3,
  });

  // Fetch Featured Products
  const products = await prisma.product.findMany({
    take: 6,
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <HeroSlider slides={slides} />

      {/* Top Categories */}
      <section className="categories-section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-grid">
          {categories.map((category: any) => (
            <Link href={`/products?category=${category.id}`} key={category.id} className="category-card">
              <div className="category-bg" style={{ backgroundImage: `url(${category.imageURL})` }} />
              <div className="category-overlay">
                <h3>{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">New Arrivals</h2>
          <Link href="/products" className="view-all">View All →</Link>
        </div>
        <div className="products-grid">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={{ ...product, imageURL: product.imageURL, category: { name: product.category.name } }} />
          ))}
        </div>
      </section>


    </div>
  );
}
