'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UpdateStockForm({ productId, currentStock }: { productId: string; currentStock: number }) {
    const [quantity, setQuantity] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleUpdate = async (action: 'set' | 'add') => {
        const val = parseInt(quantity);
        if (isNaN(val) || val < 0) return;
        setIsLoading(true);

        const newStock = action === 'set' ? val : currentStock + val;

        try {
            const res = await fetch(`/api/admin/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stock: newStock }),
            });
            if (res.ok) {
                setQuantity('');
                router.refresh();
            } else {
                alert('Failed to update stock');
            }
        } catch {
            alert('Error updating stock');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end' }}>
            <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Qty"
                className="input-field"
                style={{ width: '70px', padding: '0.35rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
            />
            <button
                onClick={() => handleUpdate('add')}
                disabled={isLoading || !quantity}
                style={{
                    padding: '0.35rem 0.6rem', fontSize: '0.75rem', fontWeight: 600,
                    borderRadius: '6px', border: 'none', cursor: 'pointer',
                    backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981',
                    opacity: isLoading || !quantity ? 0.5 : 1,
                }}
            >
                +Add
            </button>
            <button
                onClick={() => handleUpdate('set')}
                disabled={isLoading || !quantity}
                style={{
                    padding: '0.35rem 0.6rem', fontSize: '0.75rem', fontWeight: 600,
                    borderRadius: '6px', border: 'none', cursor: 'pointer',
                    backgroundColor: 'rgba(59,130,246,0.1)', color: 'var(--primary-color)',
                    opacity: isLoading || !quantity ? 0.5 : 1,
                }}
            >
                Set
            </button>
        </div>
    );
}
