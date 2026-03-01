import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Edit2, Plus } from 'lucide-react';
import DeleteSlideButton from '@/components/DeleteSlideButton';

export const dynamic = 'force-dynamic';

export default async function AdminSlidesPage() {
    const slides = await (prisma as any).slide.findMany({
        orderBy: {
            order: 'asc',
        },
    });

    return (
        <div className="admin-slides animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="title" style={{ marginBottom: 0 }}>Hero Slides</h1>
                <Link href="/admin/slides/new" className="btn-primary">
                    <Plus size={18} /> Add New Slide
                </Link>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '1rem' }}>Order</th>
                            <th style={{ padding: '1rem' }}>Image</th>
                            <th style={{ padding: '1rem' }}>Title</th>
                            <th style={{ padding: '1rem' }}>Badge</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {slides.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No slides found.
                                </td>
                            </tr>
                        ) : (
                            slides.map((slide: any) => (
                                <tr key={slide.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--primary-color)' }}>{slide.order}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <img src={slide.imageURL} alt={slide.title} style={{ width: '80px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{slide.title}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                                        <span style={{ backgroundColor: 'var(--bg-surface-hover)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.875rem' }}>
                                            {slide.badge}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <Link href={`/admin/slides/${slide.id}/edit`} className="icon-btn" style={{ color: 'var(--primary-color)', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                                                <Edit2 size={16} />
                                            </Link>
                                            <DeleteSlideButton slideId={slide.id} />
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
