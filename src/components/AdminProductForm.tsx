'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
    id: string;
    name: string;
}

interface Product {
    id?: string;
    title: string;
    price: number | string;
    description: string;
    imageURL?: string | null;
    categoryId: string;
}

interface Props {
    initialData?: Product;
    categories: Category[];
}

export default function AdminProductForm({ initialData, categories }: Props) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<Product>({
        title: initialData?.title || '',
        price: initialData?.price || '',
        description: initialData?.description || '',
        imageURL: initialData?.imageURL || '',
        categoryId: initialData?.categoryId || (categories.length > 0 ? categories[0].id : ''),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const isEditing = !!initialData?.id;
        const url = isEditing
            ? `/api/admin/products/${initialData.id}`
            : '/api/admin/products';

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
                router.push('/admin/products');
                router.refresh();
            }
        } catch (err) {
            setError('An error occurred while saving the product.');
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

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Product Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input-field"
                    required
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Price ($)</label>
                    <input
                        type="number"
                        name="price"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Category</label>
                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className="input-field"
                        required
                        style={{ height: '48px', appearance: 'none' }}
                    >
                        <option value="" disabled>Select a category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Image URL (Optional)</label>
                <input
                    type="url"
                    name="imageURL"
                    value={formData.imageURL || ''}
                    onChange={handleChange}
                    className="input-field"
                />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="input-field"
                    rows={5}
                    required
                    style={{ resize: 'vertical' }}
                />
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary" style={{ width: 'fit-content' }}>
                {isLoading ? 'Saving...' : (initialData?.id ? 'Update Product' : 'Create Product')}
            </button>
        </form>
    );
}
