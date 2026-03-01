import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
import LogoutButton from './LogoutButton';
import Link from 'next/link';
import { Shield } from 'lucide-react';
const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_key_for_development_only'
);

export default async function ProfilePage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
        redirect('/login');
    }

    let user = null;

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
    } catch (error) {
        // Invalid token
        redirect('/login');
    }

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

                    {user.role === 'ADMIN' && (
                        <div style={{ padding: '1rem', marginTop: '1rem', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--border-radius-md)', textAlign: 'center' }}>
                            <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>You have administrative access.</p>
                            <Link href="/admin" className="btn-primary" style={{ width: '100%' }}>
                                <Shield size={18} /> Admin Dashboard
                            </Link>
                        </div>
                    )}

                    <div className="profile-actions">
                        <LogoutButton />
                    </div>
                </div>

                <div className="details-card card">
                    <h2>Account Details</h2>
                    <div className="details-list">
                        <div className="detail-item">
                            <span className="detail-label">User ID</span>
                            <span className="detail-value">{user.id}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Joined</span>
                            <span className="detail-value">
                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Order History</span>
                            <span className="detail-value text-muted">No recent orders</span>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}
