'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, Sun, Moon, User, Search, Menu, X } from 'lucide-react';
import { useTheme } from '@/app/ThemeProvider';
import { useCartStore } from '@/store/useCartStore';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const cartItemsCount = useCartStore((state) => state.getTotalItems());
    const pathname = usePathname();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery('');
            setMenuOpen(false);
        }
    };

    return (
        <header className="navbar-container">
            <div className="container" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <div style={{ flex: 1 }}>
                    <Link href="/" className="logo">
                        Tech<span style={{ color: 'var(--primary-color)' }}>Shop</span>
                    </Link>
                </div>

                {/* Desktop nav (Centered) */}
                <nav className="nav-links nav-desktop" style={{ flex: 2, justifyContent: 'center' }}>
                    <Link href="/products" className={pathname === '/products' ? 'active' : ''}>
                        Products
                    </Link>
                    <Link href="/categories" className={pathname === '/categories' ? 'active' : ''}>
                        Categories
                    </Link>
                    <Link href="/about" className={pathname === '/about' ? 'active' : ''}>
                        About
                    </Link>
                </nav>

                {/* Desktop icons (Right) */}
                <div className="nav-desktop" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button onClick={() => setSearchOpen(!searchOpen)} className="icon-btn" aria-label="Search">
                        <Search size={20} />
                    </button>
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
                </div>

                {/* Hamburger button (mobile only) */}
                <div className="nav-mobile" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" style={{ marginLeft: 'auto', display: 'block' }}>
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Search bar dropdown */}
            {searchOpen && (
                <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', maxWidth: '500px', margin: '0 auto' }}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className="input-field"
                            style={{ flex: 1, padding: '0.5rem 1rem' }}
                            autoFocus
                        />
                        <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
                            Search
                        </button>
                    </form>
                </div>
            )}

            {/* Mobile menu */}
            {menuOpen && (
                <div className="mobile-menu">
                    <Link href="/products" onClick={() => setMenuOpen(false)} className={`mobile-menu-link ${pathname === '/products' ? 'active' : ''}`}>
                        Products
                    </Link>
                    <Link href="/categories" onClick={() => setMenuOpen(false)} className={`mobile-menu-link ${pathname === '/categories' ? 'active' : ''}`}>
                        Categories
                    </Link>
                    <Link href="/about" onClick={() => setMenuOpen(false)} className={`mobile-menu-link ${pathname === '/about' ? 'active' : ''}`}>
                        About
                    </Link>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="input-field"
                            style={{ flex: 1, padding: '0.5rem 1rem' }}
                        />
                        <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
                            <Search size={16} />
                        </button>
                    </form>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', paddingTop: '0.5rem' }}>
                        <button onClick={() => { toggleTheme(); setMenuOpen(false); }} className="icon-btn" aria-label="Toggle Theme">
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <Link href="/cart" onClick={() => setMenuOpen(false)} className="icon-btn cart-icon" aria-label="Cart">
                            <ShoppingCart size={20} />
                            {cartItemsCount > 0 && <span className="badge">{cartItemsCount}</span>}
                        </Link>
                        <Link href="/profile" onClick={() => setMenuOpen(false)} className="icon-btn" aria-label="Profile">
                            <User size={20} />
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
