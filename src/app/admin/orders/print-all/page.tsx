import React from 'react';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function PrintAllReceipts() {
    const orders = await (prisma as any).order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { name: true, email: true } },
            items: true,
        },
    });

    return (
        <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '2rem 0' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'right', marginBottom: '2rem' }}>
                <button
                    onClick={() => window.print()}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}
                    className="no-print"
                >
                    Print All
                </button>
            </div>

            {orders.map((order: any, index: number) => (
                <div key={order.id} style={{ backgroundColor: 'white', padding: '2rem', maxWidth: '800px', margin: '0 auto', marginBottom: '4rem', fontFamily: 'sans-serif', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', pageBreakAfter: index < orders.length - 1 ? 'always' : 'auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid #eee', paddingBottom: '1rem' }}>
                        <h1 style={{ fontSize: '2rem', margin: 0 }}>TechShop Receipt</h1>
                        <p style={{ color: '#666', marginTop: '0.5rem' }}>Receipt ID: {order.id}</p>
                        <p style={{ color: '#666' }}>Date: {new Date(order.createdAt).toLocaleString()}</p>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Customer Details</h2>
                        <p><strong>Name:</strong> {order.user?.name || 'Guest'}</p>
                        <p><strong>Email:</strong> {order.user?.email}</p>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Order Items</h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>
                                    <th style={{ padding: '0.5rem 0' }}>Item</th>
                                    <th style={{ padding: '0.5rem 0', textAlign: 'center' }}>Qty</th>
                                    <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Price</th>
                                    <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item: any) => (
                                    <tr key={item.id} style={{ borderBottom: '1px dotted #eee' }}>
                                        <td style={{ padding: '0.5rem 0' }}>{item.title}</td>
                                        <td style={{ padding: '0.5rem 0', textAlign: 'center' }}>{item.quantity}</td>
                                        <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>${item.price.toFixed(2)}</td>
                                        <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>${(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                        <div style={{ width: '300px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Subtotal:</span>
                                <span>${(order.total / 1.1).toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Tax (10%):</span>
                                <span>${(order.total - order.total / 1.1).toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #000', paddingTop: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                <span>Total:</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: '#666' }}>
                                <span>Status:</span>
                                <span>{order.status}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '4rem', color: '#666', fontSize: '0.9rem' }}>
                        <p>Thank you for shopping at TechShop!</p>
                    </div>
                </div>
            ))}

            {orders.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', marginTop: '2rem', backgroundColor: 'white', maxWidth: '800px', margin: '0 auto' }}>
                    <p style={{ color: '#666', fontSize: '1.2rem' }}>No orders found to print.</p>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    body { background-color: white; }
                    .no-print { display: none !important; }
                    /* pageBreakAfter works best on exact block elements */
                }
            `}} />
            <script dangerouslySetInnerHTML={{
                __html: `
                function triggerPrint() {
                    setTimeout(function() { window.print(); }, 500);
                }
                if (document.readyState === 'complete') {
                    triggerPrint();
                } else {
                    window.addEventListener('load', triggerPrint);
                }
            `}} />
        </div>
    );
}
