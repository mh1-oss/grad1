import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export const dynamic = 'force-dynamic';

const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_key_for_development_only'
);

// PUT — update own review
export async function PUT(request: Request, context: { params: Promise<{ id: string; reviewId: string }> }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { payload } = await jwtVerify(token, secretKey);
        const userId = payload.userId as string;
        const params = await context.params;

        const review = await (prisma as any).review.findUnique({ where: { id: params.reviewId } });
        if (!review || review.userId !== userId) {
            return NextResponse.json({ error: 'Not found or not your review' }, { status: 403 });
        }

        const data = await request.json();
        const updated = await (prisma as any).review.update({
            where: { id: params.reviewId },
            data: {
                rating: parseInt(data.rating),
                comment: data.comment || '',
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Update review error:', error);
        return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
    }
}

// DELETE — delete own review
export async function DELETE(request: Request, context: { params: Promise<{ id: string; reviewId: string }> }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { payload } = await jwtVerify(token, secretKey);
        const userId = payload.userId as string;
        const params = await context.params;

        const review = await (prisma as any).review.findUnique({ where: { id: params.reviewId } });
        if (!review || review.userId !== userId) {
            return NextResponse.json({ error: 'Not found or not your review' }, { status: 403 });
        }

        await (prisma as any).review.delete({ where: { id: params.reviewId } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete review error:', error);
        return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
    }
}
