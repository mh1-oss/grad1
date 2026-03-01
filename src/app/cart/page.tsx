'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch for local storage state
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="cart-page animate-fade-in"><div className="loading">Loading Cart...</div></div>;

    return (
        <div className="cart-page animate-fade-in">
            <h1 className="title">Shopping Cart</h1>

            {items.length === 0 ? (
                <div className="empty-cart card">
                    <div className="empty-icon">🛒</div>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added anything to your cart yet.</p>
                    <Link href="/products" className="btn-primary" style={{ marginTop: '1.5rem' }}>
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items">
                        <div className="cart-header">
                            <span>Product</span>
                            <span>Quantity</span>
                            <span>Total</span>
                        </div>

                        {items.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="item-info">
                                    {item.imageURL ? (
                                        <img src={item.imageURL} alt={item.title} className="item-image" />
                                    ) : (
                                        <div className="item-image-placeholder" />
                                    )}
                                    <div className="item-details">
                                        <Link href={`/products/${item.id}`} className="item-title">{item.title}</Link>
                                        <p className="item-price">${item.price.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="item-quantity">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                        className="qty-btn"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="qty-value">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="qty-btn"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <div className="item-total">
                                    <span className="total-price">${(item.price * item.quantity).toFixed(2)}</span>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="remove-btn"
                                        aria-label="Remove item"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="cart-actions">
                            <button onClick={clearCart} className="btn-secondary">Clear Cart</button>
                            <Link href="/products" className="continue-shopping">← Continue Shopping</Link>
                        </div>
                    </div>

                    <div className="cart-summary card">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${getTotalPrice().toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax (Estimated)</span>
                            <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row total-row">
                            <span>Total</span>
                            <span>${(getTotalPrice() * 1.1).toFixed(2)}</span>
                        </div>
                        <Link href="/checkout" className="btn-primary checkout-btn" style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none' }}>
                            Proceed to Checkout <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            )}


        </div>
    );
}
