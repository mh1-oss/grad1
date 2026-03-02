import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
import LogoutButton from './LogoutButton';
import Link from 'next/link';
import { Shield, Star, Calendar, Mail, User, MessageSquare } from 'lucide-react';
import UserReviews from '@/components/UserReviews';

const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_key_for_development_only'
);

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
        redirect('/login');
    }

    let user: any = null;
    let reviewCount = 0;
    let userReviews: any[] = [];

    try {
        const { payload } = await jwtVerify(token, secretKey);
        user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            redirect('/login');
        }

        // Fetch user's reviews
        userReviews = await (prisma as any).review.findMany({
            where: { userId: user.id },
            include: { product: { select: { title: true, imageURL: true } } },
            orderBy: { createdAt: 'desc' },
        });
        reviewCount = userReviews.length;
    } catch (error) {
        redirect('/login');
    }

    const memberSince = new Date(user.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - memberSince.getTime()) / (1000 * 60 * 60 * 24));
    const memberDuration = diffDays === 0 ? 'Today' : diffDays === 1 ? '1 day' : `${diffDays} days`;

    return (
        <div className="profile-page animate-fade-in">
            <div className="profile-header">
                <h1 className="title">My Profile</h1>
                <p className="subtitle">Manage your account information and settings.</p>
            </div>

            <div className="profile-grid">
                <div className="profile-card card">
                    <div className="avatar">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="user-info">
                        <h2>{user.name}</h2>
                        <p className="user-email">{user.email}</p>
                        <span className="role-badge">{user.role}</span>
                    </div>

                    {/* Quick Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', margin: '1.5rem 0', width: '100%' }}>
                        <div style={{ padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', backgroundColor: 'var(--bg-surface-hover)', textAlign: 'center' }}>
                            <Star size={18} style={{ color: '#f59e0b', marginBottom: '0.25rem' }} />
                            <p style={{ fontWeight: 700, fontSize: '1.25rem' }}>{reviewCount}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Reviews</p>
                        </div>
                        <div style={{ padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', backgroundColor: 'var(--bg-surface-hover)', textAlign: 'center' }}>
                            <Calendar size={18} style={{ color: 'var(--primary-color)', marginBottom: '0.25rem' }} />
                            <p style={{ fontWeight: 700, fontSize: '1.25rem' }}>{memberDuration}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Member</p>
                        </div>
                    </div>

                    {user.role === 'ADMIN' && (
                        <div style={{ padding: '1rem', marginTop: '0.5rem', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--border-radius-md)', textAlign: 'center', width: '100%' }}>
                            <p style={{ marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>You have admin access.</p>
                            <Link href="/admin" className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <Shield size={16} /> Admin Dashboard
                            </Link>
                        </div>
                    )}

                    <div className="profile-actions">
                        <LogoutButton />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="details-card card">
                        <h2>Account Details</h2>
                        <div className="details-list">
                            <div className="detail-item">
                                <span className="detail-label"><User size={14} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />User ID</span>
                                <span className="detail-value" style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}>{user.id}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label"><Mail size={14} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />Email</span>
                                <span className="detail-value">{user.email}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label"><Calendar size={14} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />Joined</span>
                                <span className="detail-value">
                                    {memberSince.toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label"><Star size={14} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />Total Reviews</span>
                                <span className="detail-value">{reviewCount} review{reviewCount !== 1 ? 's' : ''} written</span>
                            </div>
                        </div>
                    </div>

                    {/* My Reviews Section */}
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MessageSquare size={18} /> My Reviews
                        </h2>
                        <UserReviews reviews={userReviews} />
                    </div>
                </div>
            </div>
        </div>
    );
}
