import React from 'react';
import { prisma } from '@/lib/prisma';
import AddToCartButton from './AddToCartButton';

export const dynamic = 'force-dynamic';

export default async function ProductDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const product = await prisma.product.findUnique({
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
                    <div className="category-badge">{product.category.name}</div>
                    <h1 className="title">{product.title}</h1>
                    <p className="price">${product.price.toFixed(2)}</p>

                    <div className="divider"></div>

                    <div className="description">
                        <h3>Description</h3>
                        <p>{product.description}</p>
                    </div>

                    <div className="divider"></div>

                    <div className="actions">
                        <AddToCartButton product={{ id: product.id, title: product.title, price: product.price, imageURL: product.imageURL }} />
                    </div>
                </div>
            </div>


        </div>
    );
}
