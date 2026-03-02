import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';
import UpdateStockForm from '@/components/UpdateStockForm';

export const dynamic = 'force-dynamic';

export default async function AdminInventoryPage() {
    const products = await prisma.product.findMany({
        select: { id: true, title: true, imageURL: true, price: true, stock: true },
        orderBy: { title: 'asc' },
    });

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <Package size={24} style={{ color: 'var(--primary-color)' }} />
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Inventory Management</h1>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '1rem' }}>Product</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Price</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Current Stock</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Update Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product: any) => (
                            <tr key={product.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        {product.imageURL && (
                                            <img src={product.imageURL} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                                        )}
                                        <span style={{ fontWeight: 500 }}>{product.title}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '0.75rem', textAlign: 'right' }}>${product.price.toFixed(2)}</td>
                                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                                    <span style={{
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        backgroundColor: product.stock > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                        color: product.stock > 0 ? '#10b981' : '#ef4444'
                                    }}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                                    <UpdateStockForm productId={product.id} currentStock={product.stock} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
