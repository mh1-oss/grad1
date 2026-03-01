import React from 'react';
import AdminSlideForm from '@/components/AdminSlideForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function NewSlidePage() {
    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/admin/slides" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem', textDecoration: 'none' }}>
                    <ArrowLeft size={16} /> Back to Slides
                </Link>
                <h1 className="title" style={{ marginBottom: 0 }}>Add New Slide</h1>
            </div>

            <AdminSlideForm />
        </div>
    );
}
