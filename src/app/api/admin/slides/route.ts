import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export const dynamic = 'force-dynamic';
const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_key_for_development_only'
);

async function verifyAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return false;
    try {
        const { payload } = await jwtVerify(token, secretKey);
        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { role: true }
        });
        return user?.role === 'ADMIN';
    } catch {
        return false;
    }
}

export async function POST(request: Request) {
    try {
        const isAdmin = await verifyAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const data = await request.json();
        const { badge, title, subtitle, imageURL, linkText, linkUrl, order } = data;

        if (!title || !subtitle || !imageURL || !linkText || !linkUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Use Prisma's slightly older type-safe format or dynamic creation depending on types generated
        // We will pass the data object directly.
        const slide = await (prisma as any).slide.create({
            data: {
                badge: badge || '',
                title,
                subtitle,
                imageURL,
                linkText,
                linkUrl,
                order: parseInt(order) || 0,
            },
        });

        return NextResponse.json({ message: 'Slide created successfully', slide }, { status: 201 });
    } catch (error) {
        console.error('Create slide error:', error);
        return NextResponse.json({ error: 'Failed to create slide' }, { status: 500 });
    }
}
