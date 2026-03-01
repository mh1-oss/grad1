'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function CheckoutSuccessPage() {
    const clearCart = useCartStore((state) => state.clearCart);

    useEffect(() => {
        // Clear the cart when the user lands on the success page
        clearCart();
    }, [clearCart]);

    const orderNumber = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');

    return (
        <div className="animate-fade-in" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
            <CheckCircle size={80} style={{ color: '#10b981', marginBottom: '2rem' }} />

            <h1 className="title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Order Confirmed!</h1>

            <p className="subtitle" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                Thank you for your purchase. We've received your order and are getting it ready to be shipped.
            </p>

            <div className="card" style={{ padding: '2rem', marginBottom: '3rem', backgroundColor: 'var(--bg-surface-hover)' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Order Reference Number</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                    #{orderNumber}
                </p>
            </div>

            <Link href="/" className="btn-primary" style={{ padding: '1rem 2rem' }}>
                Back to Home
            </Link>
        </div>
    );
}
