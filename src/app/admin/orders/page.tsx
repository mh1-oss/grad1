'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Trash2, Printer, Search } from 'lucide-react';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders');
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error('Failed to load orders', error);
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (orderId: string) => {
        if (!confirm('Are you sure you want to cancel this order? This will restock the items and update the order status to CANCELLED.')) return;
        try {
            const res = await fetch(`/api/admin/orders/${orderId}/cancel`, { method: 'POST' });
            if (res.ok) {
                fetchOrders();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to cancel order');
            }
        } catch (error) {
            alert('Error cancelling order');
        }
    };

    const printSingleReceipt = (orderId: string) => {
        window.open(`/admin/orders/${orderId}/print`, '_blank');
    };

    const printAllReceipts = () => {
        window.open(`/admin/orders/print-all`, '_blank');
    };

    return (
        <div className="animate-fade-in" style={{ padding: '1rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileText size={28} style={{ color: 'var(--primary-color)' }} />
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Purchase Receipts</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Manage and print customer orders</p>
                    </div>
                </div>
                <button onClick={printAllReceipts} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} disabled={orders.length === 0}>
                    <Printer size={18} /> Print All Receipts
                </button>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>No orders found.</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                    <th style={{ padding: '0.75rem' }}>Receipt ID</th>
                                    <th style={{ padding: '0.75rem' }}>Customer</th>
                                    <th style={{ padding: '0.75rem' }}>Date</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Total</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Status</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)', opacity: order.status === 'CANCELLED' ? 0.6 : 1 }}>
                                        <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                            ...{order.id.slice(-6).toUpperCase()}
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <p style={{ fontWeight: 600 }}>{order.user?.name || 'N/A'}</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{order.user?.email}</p>
                                        </td>
                                        <td style={{ padding: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                            <br />
                                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600 }}>
                                            ${order.total.toFixed(2)}
                                        </td>
                                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                            <span style={{
                                                padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                                                backgroundColor: order.status === 'COMPLETED' ? 'rgba(16,185,129,0.1)' : order.status === 'CANCELLED' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                                                color: order.status === 'COMPLETED' ? '#10b981' : order.status === 'CANCELLED' ? '#ef4444' : '#f59e0b'
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button
                                                    onClick={() => printSingleReceipt(order.id)}
                                                    className="btn-secondary"
                                                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                                                    title="Print Receipt"
                                                >
                                                    <Printer size={16} />
                                                </button>
                                                {order.status !== 'CANCELLED' && (
                                                    <button
                                                        onClick={() => cancelOrder(order.id)}
                                                        className="btn-primary"
                                                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', backgroundColor: '#ef4444', color: 'white', border: 'none' }}
                                                        title="Cancel Order"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
