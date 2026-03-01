import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Edit2, Plus } from 'lucide-react';
import DeleteProductButton from '@/components/DeleteProductButton';

// Force dynamic since we want to always see the latest products in the admin panel
export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        include: {
            category: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div className="admin-products animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="title" style={{ marginBottom: 0 }}>Products</h1>
                <Link href="/admin/products/new" className="btn-primary">
                    <Plus size={18} /> Add New Product
                </Link>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '1rem' }}>Image</th>
                            <th style={{ padding: '1rem' }}>Title</th>
                            <th style={{ padding: '1rem' }}>Category</th>
                            <th style={{ padding: '1rem' }}>Price</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No products found.
                                </td>
                            </tr>
                        ) : (
                            products.map((product: {
                                id: string;
                                title: string;
                                price: number;
                                imageURL: string | null;
                                category: { name: string };
                            }) => (
                                <tr key={product.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        {product.imageURL ? (
                                            <img src={product.imageURL} alt={product.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                                        ) : (
                                            <div style={{ width: '50px', height: '50px', backgroundColor: 'var(--bg-surface-hover)', borderRadius: '8px' }} />
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{product.title}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                                        <span style={{ backgroundColor: 'var(--bg-surface-hover)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.875rem' }}>
                                            {product.category.name}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>${product.price.toFixed(2)}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <Link href={`/admin/products/${product.id}/edit`} className="icon-btn" style={{ color: 'var(--primary-color)', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                                                <Edit2 size={16} />
                                            </Link>
                                            <DeleteProductButton productId={product.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
