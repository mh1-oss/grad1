import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const categoryId = typeof params.category === 'string' ? params.category : undefined;
    const search = typeof params.search === 'string' ? params.search : undefined;

    const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (search) where.title = { contains: search, mode: 'insensitive' };

    // Fetch Categories for Sidebar
    const categories = await prisma.category.findMany();

    // Fetch Products
    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take: limit,
            include: { category: true },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="products-layout animate-fade-in">
            {/* Sidebar Filter */}
            <aside className="sidebar">
                <div className="filter-group">
                    <h3>Search</h3>
                    <form action="/products" method="GET" className="search-form">
                        <input
                            type="text"
                            name="search"
                            defaultValue={search || ''}
                            placeholder="Search products..."
                            className="input-field"
                        />
                        {categoryId && <input type="hidden" name="category" value={categoryId} />}
                        <button type="submit" className="btn-secondary" style={{ marginTop: '0.5rem', width: '100%' }}>Search</button>
                    </form>
                </div>

                <div className="filter-group">
                    <h3>Categories</h3>
                    <ul className="category-list">
                        <li>
                            <Link href={`/products${search ? `?search=${search}` : ''}`} className={!categoryId ? 'active' : ''}>
                                All Categories
                            </Link>
                        </li>
                        {categories.map((c: any) => (
                            <li key={c.id}>
                                <Link
                                    href={`/products?category=${c.id}${search ? `&search=${search}` : ''}`}
                                    className={categoryId === c.id ? 'active' : ''}
                                >
                                    {c.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Main Content */}
            <div className="main-content">
                <div className="content-header">
                    <h1 className="title">Products</h1>
                    <p className="subtitle">Showing {products.length} of {total} results</p>
                </div>

                {products.length === 0 ? (
                    <div className="no-results">
                        <h2>No products found</h2>
                        <p>Try adjusting your search or filters.</p>
                        <Link href="/products" className="btn-primary" style={{ marginTop: '1rem' }}>Clear Filters</Link>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map((product: any) => (
                            <ProductCard key={product.id} product={{ ...product, imageURL: product.imageURL, category: { name: product.category.name } }} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination">
                        {page > 1 && (
                            <Link
                                href={`/products?page=${page - 1}${categoryId ? `&category=${categoryId}` : ''}${search ? `&search=${search}` : ''}`}
                                className="btn-secondary"
                            >
                                Previous
                            </Link>
                        )}
                        <span className="page-info">Page {page} of {totalPages}</span>
                        {page < totalPages && (
                            <Link
                                href={`/products?page=${page + 1}${categoryId ? `&category=${categoryId}` : ''}${search ? `&search=${search}` : ''}`}
                                className="btn-secondary"
                            >
                                Next
                            </Link>
                        )}
                    </div>
                )}
            </div>


        </div>
    );
}
