'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface Product {
    id: string;
    title: string;
    price: number;
    imageURL: string | null;
    category: { name: string };
}

export default function ProductCard({ product }: { product: Product }) {
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // prevent navigation
        addItem({
            id: product.id,
            title: product.title,
            price: product.price,
            imageURL: product.imageURL,
        });
    };

    return (
        <div className="card product-card">
            <Link href={`/products/${product.id}`} className="product-image-container">
                {product.imageURL ? (
                    <img src={product.imageURL} alt={product.title} className="product-image" loading="lazy" />
                ) : (
                    <div className="product-image-placeholder">No Image</div>
                )}
            </Link>

            <div className="product-info">
                <span className="product-category">{product.category.name}</span>
                <h3 className="product-title">
                    <Link href={`/products/${product.id}`}>{product.title}</Link>
                </h3>

                <div className="product-footer">
                    <span className="product-price">${product.price.toFixed(2)}</span>
                    <button className="btn-primary add-to-cart" onClick={handleAddToCart} aria-label="Add to cart">
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>

            
        </div>
    );
}
