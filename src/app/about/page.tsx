import React from 'react';
import { Store, Shield, Users, Globe, Heart } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                    About <span style={{ color: 'var(--primary-color)' }}>TechShop</span>
                </h1>
                <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
                    Your premium destination for high-quality electronics, fashion, and lifestyle products — all in one place.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {[
                    { icon: <Store size={28} />, title: 'Quality Products', desc: 'Curated selection of premium products from trusted brands.' },
                    { icon: <Shield size={28} />, title: 'Secure Shopping', desc: 'Safe and secure checkout process for every purchase.' },
                    { icon: <Globe size={28} />, title: 'Fast Delivery', desc: 'Quick and reliable shipping to your doorstep.' },
                    { icon: <Heart size={28} />, title: 'Customer Support', desc: '24/7 dedicated support team for all your needs.' },
                ].map((item, i) => (
                    <div key={i} className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <div style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>{item.icon}</div>
                        <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{item.title}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Ready to Shop?</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Explore our wide range of products and find something you love.</p>
                <Link href="/products" className="btn-primary" style={{ display: 'inline-flex', padding: '0.75rem 2rem' }}>
                    Browse Products
                </Link>
            </div>
        </div>
    );
}
