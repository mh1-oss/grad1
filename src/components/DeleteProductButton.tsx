'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeleteProductButton({ productId }: { productId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/products/${productId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                router.refresh(); // Refresh the page to show updated list
            } else {
                alert('Failed to delete product');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="icon-btn"
            style={{
                color: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                opacity: isDeleting ? 0.5 : 1,
                cursor: isDeleting ? 'not-allowed' : 'pointer'
            }}
            aria-label="Delete product"
        >
            <Trash2 size={16} />
        </button>
    );
}
