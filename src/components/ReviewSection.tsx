'use client';

import React, { useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: { name: string | null; email: string };
}

export default function ReviewSection({ productId }: { productId: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetch(`/api/products/${productId}/reviews`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setReviews(data);
            })
            .catch(console.error);
    }, [productId]);

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '0';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) { setError('Please select a rating'); return; }
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch(`/api/products/${productId}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, comment }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to submit review');
            } else {
                setSuccess('Review submitted successfully!');
                setReviews(prev => [data, ...prev]);
                setRating(0);
                setComment('');
            }
        } catch {
            setError('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (count: number, size = 16) => (
        <div style={{ display: 'flex', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={size} fill={i <= count ? '#f59e0b' : 'none'} color={i <= count ? '#f59e0b' : '#d1d5db'} />
            ))}
        </div>
    );

    return (
        <div style={{ marginTop: '3rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Customer Reviews</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {renderStars(Math.round(Number(avgRating)), 20)}
                    <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>{avgRating}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                </div>
            </div>

            {/* Submit Form */}
            <form onSubmit={handleSubmit} className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Write a Review</h3>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem', cursor: 'pointer' }}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <Star
                            key={i}
                            size={28}
                            fill={i <= (hoverRating || rating) ? '#f59e0b' : 'none'}
                            color={i <= (hoverRating || rating) ? '#f59e0b' : '#d1d5db'}
                            onMouseEnter={() => setHoverRating(i)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(i)}
                            style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
                        />
                    ))}
                </div>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="input-field"
                    placeholder="Share your experience with this product..."
                    rows={3}
                    style={{ resize: 'vertical', marginBottom: '1rem' }}
                />
                {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{error}</p>}
                {success && <p style={{ color: '#10b981', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{success}</p>}
                <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Send size={16} /> {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>

            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reviews.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>No reviews yet. Be the first to review this product!</p>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="card" style={{ padding: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '50%',
                                        background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'white', fontWeight: 700, fontSize: '0.85rem'
                                    }}>
                                        {(review.user.name || review.user.email).charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{review.user.name || review.user.email}</p>
                                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                                            {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                {renderStars(review.rating)}
                            </div>
                            {review.comment && <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{review.comment}</p>}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
