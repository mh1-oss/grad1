import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { LayoutGrid } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
    // Fetch all categories with product count
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { products: true }
            }
        },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="animate-fade-in" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="title" style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    <LayoutGrid size={32} className="text-primary" /> Shop by Category
                </h1>
                <p className="subtitle">Browse our collection of high-quality products across various categories.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                {categories.map((category: any) => (
                    <Link key={category.id} href={`/products?category=${category.id}`} className="card" style={{ display: 'block', textDecoration: 'none', transition: 'transform 0.2s', overflow: 'hidden' }}>
                        <div style={{ height: '200px', backgroundColor: 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                            {category.imageURL ? (
                                <img src={category.imageURL} alt={category.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ color: 'var(--text-tertiary)', fontSize: '1.25rem', fontWeight: 600 }}>{category.name}</span>
                            )}
                        </div>
                        <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{category.name}</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                {category._count.products} Product{category._count.products !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
            {categories.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No categories found.</p>
            )}
        </div>
    );
}
