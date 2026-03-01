import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminProductForm from '@/components/AdminProductForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem', textDecoration: 'none' }}>
                    <ArrowLeft size={16} /> Back to Products
                </Link>
                <h1 className="title" style={{ marginBottom: 0 }}>Add New Product</h1>
            </div>

            <AdminProductForm categories={categories} />
        </div>
    );
}
