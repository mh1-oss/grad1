import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminProductForm from '@/components/AdminProductForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;

    // Fetch product and categories in parallel
    const [product, categories] = await Promise.all([
        prisma.product.findUnique({
            where: { id: resolvedParams.id },
            include: { category: true }
        }),
        prisma.category.findMany({
            orderBy: { name: 'asc' }
        })
    ]);

    if (!product) {
        notFound();
    }

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem', textDecoration: 'none' }}>
                    <ArrowLeft size={16} /> Back to Products
                </Link>
                <h1 className="title" style={{ marginBottom: 0 }}>Edit Product</h1>
                <p className="subtitle" style={{ marginTop: '0.5rem' }}>{product.id}</p>
            </div>

            <AdminProductForm
                initialData={{
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    description: product.description,
                    imageURL: product.imageURL,
                    categoryId: product.categoryId,
                }}
                categories={categories}
            />
        </div>
    );
}
