import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_key_for_development_only'
);

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Verify token
        try {
            const { payload } = await jwtVerify(token, secretKey);

            const user = await prisma.user.findUnique({
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
                return NextResponse.json(
                    { error: 'User not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({ user }, { status: 200 });
        } catch (jwtError) {
            console.error('JWT Verification error:', jwtError);
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Auth verification error:', error);
        return NextResponse.json(
            { error: 'Failed to verify session' },
            { status: 500 }
        );
    }
}
