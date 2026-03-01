import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export const dynamic = 'force-dynamic';
const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_key_for_development_only'
);

// Middleware-like function to verify admin access for API routes
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

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const isAdmin = await verifyAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
        }

        const params = await context.params;
        const slideId = params.id;

        await (prisma as any).slide.delete({
            where: { id: slideId },
        });

        return NextResponse.json({ message: 'Slide deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Delete slide error:', error);
        return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 });
    }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const isAdmin = await verifyAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
        }

        const params = await context.params;
        const slideId = params.id;
        const data = await request.json();
        const { badge, title, subtitle, imageURL, linkText, linkUrl, order } = data;

        const slide = await (prisma as any).slide.update({
            where: { id: slideId },
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

        return NextResponse.json({ message: 'Slide updated successfully', slide }, { status: 200 });
    } catch (error) {
        console.error('Update slide error:', error);
        return NextResponse.json({ error: 'Failed to update slide' }, { status: 500 });
    }
}
