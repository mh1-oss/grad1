'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [error, setError] = useState('');

    const [shippingInfo, setShippingInfo] = useState({
        fullName: '',
        address: '',
        city: '',
        postalCode: ''
    });

    useEffect(() => {
        setMounted(true);
        if (items.length === 0 && mounted) {
            router.push('/cart');
        }
    }, [items.length, router, mounted]);

    const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map(item => ({
                        productId: item.id,
                        title: item.title,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                    shippingInfo
                }),
            });

            if (res.ok) {
                clearCart();
                router.push('/checkout/success');
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to place order. Please try again.');
                setIsSubmitting(false);
            }
        } catch {
            setError('Network error. Please try again.');
            setIsSubmitting(false);
        }
    };

    if (!mounted || items.length === 0) return null;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '4rem auto', gap: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div>
                <h1 className="title">Checkout</h1>
                <p className="subtitle">Please enter your shipping and payment details.</p>
            </div>

            {error && (
                <div style={{ padding: '1rem', backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: '8px', color: '#ef4444', fontWeight: 500 }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="checkout-form" style={{ display: 'grid', gap: '2rem' }}>
                <div className="card" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Shipping Information</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Full Name</label>
                            <input type="text" name="fullName" value={shippingInfo.fullName} onChange={handleShippingChange} className="input-field" required placeholder="John Doe" />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Address</label>
                            <input type="text" name="address" value={shippingInfo.address} onChange={handleShippingChange} className="input-field" required placeholder="123 Main St" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>City</label>
                            <input type="text" name="city" value={shippingInfo.city} onChange={handleShippingChange} className="input-field" required placeholder="New York" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Postal Code</label>
                            <input type="text" name="postalCode" value={shippingInfo.postalCode} onChange={handleShippingChange} className="input-field" required placeholder="10001" />
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Payment Method</h2>
                    <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-hover)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>This is a mock checkout. No real payment will be processed.</p>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Card Number</label>
                                <input type="text" className="input-field" required placeholder="0000 0000 0000 0000" maxLength={19} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Expiry Date</label>
                                    <input type="text" className="input-field" required placeholder="MM/YY" maxLength={5} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>CVV</label>
                                    <input type="text" className="input-field" required placeholder="123" maxLength={3} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface-hover)', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Total Amount to Pay</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>${(getTotalPrice() * 1.1).toFixed(2)}</p>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                        {isSubmitting ? 'Processing...' : 'Place Order'}
                    </button>
                </div>
            </form>
        </div>
    );
}
