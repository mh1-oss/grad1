import React from 'react';
import { prisma } from '@/lib/prisma';
import AddToCartButton from './AddToCartButton';
import ReviewSection from '@/components/ReviewSection';

export const dynamic = 'force-dynamic';

export default async function ProductDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const product: any = await prisma.product.findUnique({
        where: { id },
        include: { category: true },
    });

    if (!product) {
        return (
            <div className="product-details-page animate-fade-in" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h1 className="title">Product Not Found</h1>
                <p className="subtitle">The product you are looking for does not exist or has been removed.</p>
            </div>
        );
    }

    // Fetch reviews separately to avoid stale Prisma client issues
    let reviews: { rating: number }[] = [];
    try {
        reviews = await (prisma as any).review.findMany({
            where: { productId: id },
            select: { rating: true },
        });
    } catch {
        // review model not yet generated — just show 0 reviews
    }

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    const stock = product.stock ?? 0;
    const isOutOfStock = stock <= 0;

    return (
        <div className="product-details-page animate-fade-in">
            <div className="product-grid">
                <div className="product-image-section">
                    {product.imageURL ? (
                        <img src={product.imageURL} alt={product.title} className="main-image" />
                    ) : (
                        <div className="image-placeholder">No Image Available</div>
                    )}
                </div>

                <div className="product-info-section">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                        <div className="category-badge">{product.category.name}</div>
                        {isOutOfStock ? (
                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                                Out of Stock
                            </span>
                        ) : (
                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                                In Stock ({stock})
                            </span>
                        )}
                    </div>

                    <h1 className="title">{product.title}</h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <p className="price">${product.price.toFixed(2)}</p>
                        {avgRating && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontWeight: 600 }}>
                                ★ {avgRating}
                                <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.85rem' }}>
                                    ({reviews.length})
                                </span>
                            </span>
                        )}
                    </div>

                    <div className="divider"></div>

                    <div className="description">
                        <h3>Description</h3>
                        <p>{product.description}</p>
                    </div>

                    <div className="divider"></div>

                    <div className="actions">
                        {isOutOfStock ? (
                            <button className="btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed', width: '100%' }}>
                                Out of Stock
                            </button>
                        ) : (
                            <AddToCartButton product={{ id: product.id, title: product.title, price: product.price, imageURL: product.imageURL }} />
                        )}
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <ReviewSection productId={product.id} />
        </div>
    );
}
