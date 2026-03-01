import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminSlideForm from '@/components/AdminSlideForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditSlidePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;

    const slide = await (prisma as any).slide.findUnique({
        where: { id: resolvedParams.id },
    });

    if (!slide) {
        notFound();
    }

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/admin/slides" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem', textDecoration: 'none' }}>
                    <ArrowLeft size={16} /> Back to Slides
                </Link>
                <h1 className="title" style={{ marginBottom: 0 }}>Edit Slide</h1>
                <p className="subtitle" style={{ marginTop: '0.5rem' }}>{slide.id}</p>
            </div>

            <AdminSlideForm
                initialData={{
                    id: slide.id,
                    badge: slide.badge,
                    title: slide.title,
                    subtitle: slide.subtitle,
                    imageURL: slide.imageURL,
                    linkText: slide.linkText,
                    linkUrl: slide.linkUrl,
                    order: slide.order,
                }}
            />
        </div>
    );
}
