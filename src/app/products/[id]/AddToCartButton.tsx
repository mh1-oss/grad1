'use client';

import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface Product {
    id: string;
    title: string;
    price: number;
    imageURL: string | null;
}

export default function AddToCartButton({ product }: { product: Product }) {
    const addItem = useCartStore((state) => state.addItem);
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        addItem({ ...product });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <button
            className={`btn-primary add-btn ${isAdded ? 'added' : ''}`}
            onClick={handleAddToCart}
        >
            <ShoppingCart size={20} />
            {isAdded ? 'Added to Cart!' : 'Add to Cart'}


        </button>
    );
}
