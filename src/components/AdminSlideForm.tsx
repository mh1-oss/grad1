'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export interface SlideData {
    id?: string;
    badge: string;
    title: string;
    subtitle: string;
    imageURL: string;
    linkText: string;
    linkUrl: string;
    order: number | string;
}

export default function AdminSlideForm({ initialData }: { initialData?: SlideData }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<SlideData>({
        badge: initialData?.badge || '',
        title: initialData?.title || '',
        subtitle: initialData?.subtitle || '',
        imageURL: initialData?.imageURL || '',
        linkText: initialData?.linkText || 'Shop Collection',
        linkUrl: initialData?.linkUrl || '/products',
        order: initialData?.order ?? 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const isEditing = !!initialData?.id;
        const url = isEditing
            ? `/api/admin/slides/${initialData.id}`
            : '/api/admin/slides';

        const method = isEditing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Something went wrong');
            } else {
                router.push('/admin/slides');
                router.refresh();
            }
        } catch (err) {
            setError('An error occurred while saving the slide.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
            {error && (
                <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px' }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Badge Text</label>
                    <input type="text" name="badge" value={formData.badge} onChange={handleChange} className="input-field" placeholder="e.g. New Collection" />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Display Order</label>
                    <input type="number" name="order" value={formData.order} onChange={handleChange} className="input-field" required />
                </div>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="input-field" required placeholder="Elevate Your Everyday Style" />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Subtitle</label>
                <textarea name="subtitle" value={formData.subtitle} onChange={handleChange} className="input-field" rows={3} required />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Image URL</label>
                <input type="url" name="imageURL" value={formData.imageURL} onChange={handleChange} className="input-field" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Link Text</label>
                    <input type="text" name="linkText" value={formData.linkText} onChange={handleChange} className="input-field" required />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Link URL</label>
                    <input type="text" name="linkUrl" value={formData.linkUrl} onChange={handleChange} className="input-field" required />
                </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary" style={{ width: 'fit-content' }}>
                {isLoading ? 'Saving...' : (initialData?.id ? 'Update Slide' : 'Create Slide')}
            </button>
        </form>
    );
}
