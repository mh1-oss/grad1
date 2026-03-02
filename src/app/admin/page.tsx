import React from 'react';
import { prisma } from '@/lib/prisma';
import { Package, DollarSign, Users, Star, TrendingUp, ShoppingBag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    // Core counts
    const productCount = await prisma.product.count();
    const userCount = await prisma.user.count();

    // Review count (may fail if Prisma client is stale)
    let reviewCount = 0;
    try { reviewCount = await (prisma as any).review.count(); } catch { }

    // Order count + recent orders (may fail if Order model not yet in client)
    let orderCount = 0;
    let recentOrders: any[] = [];
    try {
        orderCount = await (prisma as any).order.count();
        recentOrders = await (prisma as any).order.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, email: true } },
                items: true,
            },
        });
    } catch { }

    const products = await prisma.product.findMany({
        select: { title: true, price: true, stock: true, imageURL: true },
        orderBy: { price: 'desc' },
        take: 5,
    });

    const totalInventoryValue = products.reduce((sum: number, p: any) => sum + (p.price * p.stock), 0);
    const totalRevenue = recentOrders.reduce((sum: number, o: any) => sum + o.total, 0);

    const statCards = [
        { icon: <Package size={24} />, label: 'Total Products', value: productCount, color: '#3b82f6' },
        { icon: <Users size={24} />, label: 'Registered Users', value: userCount, color: '#8b5cf6' },
        { icon: <ShoppingBag size={24} />, label: 'Total Orders', value: orderCount, color: '#f97316' },
        { icon: <Star size={24} />, label: 'Total Reviews', value: reviewCount, color: '#f59e0b' },
        { icon: <DollarSign size={24} />, label: 'Total Revenue', value: `$${totalRevenue.toFixed(0)}`, color: '#10b981' },
        { icon: <TrendingUp size={24} />, label: 'Inventory Value', value: `$${totalInventoryValue.toFixed(0)}`, color: '#06b6d4' },
    ];

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <TrendingUp size={24} style={{ color: 'var(--primary-color)' }} />
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Sales Summary</h1>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                {statCards.map((stat, i: number) => (
                    <div key={i} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `${stat.color}15`, color: stat.color, flexShrink: 0 }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ fontSize: '1.3rem', fontWeight: 700 }}>{stat.value}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Orders</h2>
                {recentOrders.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>No orders yet.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                    <th style={{ padding: '0.75rem' }}>Customer</th>
                                    <th style={{ padding: '0.75rem' }}>Items</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Total</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Status</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order: any) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '0.75rem' }}>
                                            <p style={{ fontWeight: 500 }}>{order.user?.name || 'N/A'}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{order.user?.email}</p>
                                        </td>
                                        <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                                            {order.items.map((item: any) => `${item.title} (x${item.quantity})`).join(', ')}
                                        </td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600 }}>${order.total.toFixed(2)}</td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                                            <span style={{ padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Top Products by Price */}
            <div className="card" style={{ padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Top Products by Price</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                <th style={{ padding: '0.75rem' }}>Product</th>
                                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Price</th>
                                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Stock</th>
                                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p: any, i: number) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '0.75rem', fontWeight: 500 }}>{p.title}</td>
                                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>${p.price.toFixed(2)}</td>
                                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                                        <span style={{ padding: '0.15rem 0.5rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, backgroundColor: p.stock > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: p.stock > 0 ? '#10b981' : '#ef4444' }}>
                                            {p.stock}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600 }}>${(p.price * p.stock).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
