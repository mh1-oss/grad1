'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Sun, Moon, User, Shield } from 'lucide-react';
import { useTheme } from '@/app/ThemeProvider';
import { useCartStore } from '@/store/useCartStore';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const cartItemsCount = useCartStore((state) => state.getTotalItems());
    const pathname = usePathname();

    return (
        <header className="navbar-container">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                <Link href="/" className="logo">
                    Tech<span style={{ color: 'var(--primary-color)' }}>Shop</span>
                </Link>

                <nav className="nav-links">
                    <Link href="/products" className={pathname === '/products' ? 'active' : ''}>
                        Products
                    </Link>
                    <button onClick={toggleTheme} className="icon-btn" aria-label="Toggle Theme">
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <Link href="/cart" className="icon-btn cart-icon" aria-label="Cart">
                        <ShoppingCart size={20} />
                        {cartItemsCount > 0 && <span className="badge">{cartItemsCount}</span>}
                    </Link>
                    <Link href="/profile" className="icon-btn" aria-label="Profile">
                        <User size={20} />
                    </Link>
                </nav>
            </div>


        </header>
    );
}
