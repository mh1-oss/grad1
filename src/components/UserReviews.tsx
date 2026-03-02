'use client';

import React, { useState } from 'react';
import { Star, Trash2, Edit3, Save, X } from 'lucide-react';

interface Review {
    id: string;
    rating: number;
    comment: string;
    productId: string;
    createdAt: string;
    product: { title: string; imageURL: string | null };
}

export default function UserReviews({ reviews: initialReviews }: { reviews: Review[] }) {
    const [reviews, setReviews] = useState(initialReviews);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState('');

    const startEdit = (review: Review) => {
        setEditingId(review.id);
        setEditRating(review.rating);
        setEditComment(review.comment);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditRating(0);
        setEditComment('');
    };

    const saveEdit = async (review: Review) => {
        try {
            const res = await fetch(`/api/products/${review.productId}/reviews/${review.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating: editRating, comment: editComment }),
            });
            if (res.ok) {
                setReviews(prev => prev.map(r =>
                    r.id === review.id ? { ...r, rating: editRating, comment: editComment } : r
                ));
                cancelEdit();
            } else {
                alert('Failed to update review');
            }
        } catch { alert('Error updating review'); }
    };

    const deleteReview = async (review: Review) => {
        if (!confirm('Delete this review?')) return;
        try {
            const res = await fetch(`/api/products/${review.productId}/reviews/${review.id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setReviews(prev => prev.filter(r => r.id !== review.id));
            } else {
                alert('Failed to delete review');
            }
        } catch { alert('Error deleting review'); }
    };

    const renderStars = (count: number, interactive = false, onSet?: (v: number) => void) => (
        <div style={{ display: 'flex', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map(i => (
                <Star
                    key={i}
                    size={18}
                    fill={i <= count ? '#f59e0b' : 'none'}
                    color={i <= count ? '#f59e0b' : '#d1d5db'}
                    style={interactive ? { cursor: 'pointer' } : {}}
                    onClick={interactive && onSet ? () => onSet(i) : undefined}
                />
            ))}
        </div>
    );

    if (reviews.length === 0) {
        return <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1.5rem 0' }}>No reviews written yet.</p>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviews.map(review => (
                <div key={review.id} className="card" style={{ padding: '1rem' }}>
                    {editingId === review.id ? (
                        /* Edit Mode */
                        <div>
                            <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>{review.product.title}</p>
                            {renderStars(editRating, true, setEditRating)}
                            <textarea
                                value={editComment}
                                onChange={(e) => setEditComment(e.target.value)}
                                className="input-field"
                                rows={2}
                                style={{ resize: 'vertical', marginTop: '0.5rem' }}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <button onClick={() => saveEdit(review)} className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                                    <Save size={14} /> Save
                                </button>
                                <button onClick={cancelEdit} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', background: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                    <X size={14} /> Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* View Mode */
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                                    <p style={{ fontWeight: 600 }}>{review.product.title}</p>
                                    {renderStars(review.rating)}
                                </div>
                                {review.comment && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{review.comment}</p>}
                                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                    {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                                <button onClick={() => startEdit(review)} style={{ padding: '0.4rem', borderRadius: '6px', border: 'none', background: 'rgba(59,130,246,0.1)', color: 'var(--primary-color)', cursor: 'pointer' }}>
                                    <Edit3 size={14} />
                                </button>
                                <button onClick={() => deleteReview(review)} style={{ padding: '0.4rem', borderRadius: '6px', border: 'none', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer' }}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
