import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { LayoutDashboard, Package, PlusCircle, Settings, Store, Image, Plus, TrendingUp, BarChart3 } from 'lucide-react';

const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_key_for_development_only'
);

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
        redirect('/login');
    }

    try {
        const { payload } = await jwtVerify(token, secretKey);
        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { role: true, name: true }
        });

        // Redirect generic users to the home page if they try to access admin panel
        if (!user || user.role !== 'ADMIN') {
            redirect('/');
        }
    } catch (error) {
        redirect('/login');
    }

    return (
        <div className="admin-layout">
            {/* Admin Sidebar */}
            <aside className="admin-sidebar card" style={{ padding: '1.5rem', height: 'fit-content' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Settings size={20} className="text-primary" /> Admin Panel
                </h2>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link href="/admin" className="admin-nav-link" style={navLinkStyle}>
                        <TrendingUp size={18} /> Sales Summary
                    </Link>
                    <Link href="/admin/orders" className="admin-nav-link" style={navLinkStyle}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> Receipts
                    </Link>

                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0.5rem 0 0.25rem 0.5rem' }}>Products</div>
                    <Link href="/admin/products" className="admin-nav-link" style={navLinkStyle}>
                        <Package size={18} /> Manage Products
                    </Link>
                    <Link href="/admin/products/new" className="admin-nav-link" style={navLinkStyle}>
                        <PlusCircle size={18} /> Add Product
                    </Link>
                    <Link href="/admin/inventory" className="admin-nav-link" style={navLinkStyle}>
                        <BarChart3 size={18} /> Inventory
                    </Link>

                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '1rem 0 0.25rem 0.5rem' }}>Hero Slider</div>
                    <Link href="/admin/slides" className="admin-nav-link" style={navLinkStyle}>
                        <Image size={18} /> Manage Slides
                    </Link>
                    <Link href="/admin/slides/new" className="admin-nav-link" style={navLinkStyle}>
                        <Plus size={18} /> Add Slide
                    </Link>

                    <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '1rem 0' }} />
                    <Link href="/" className="admin-nav-link" style={navLinkStyle}>
                        <Store size={18} /> Back to Store
                    </Link>
                </nav>
            </aside>

            {/* Admin Content Area */}
            <main className="admin-content card" style={{ padding: '2rem' }}>
                {children}
            </main>
        </div>
    );
}

const navLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--border-radius-sm)',
    color: 'var(--text-primary)',
    fontWeight: 500 as const,
    transition: 'all 0.2s ease',
};
