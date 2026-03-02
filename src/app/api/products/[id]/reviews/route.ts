import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export const dynamic = 'force-dynamic';

const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_key_for_development_only'
);

// GET — fetch all reviews for a product
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params;
        const reviews = await (prisma as any).review.findMany({
            where: { productId: params.id },
            include: { user: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Fetch reviews error:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

// POST — submit a new review (must be logged in)
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'You must be logged in to leave a review' }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, secretKey);
        const userId = payload.userId as string;
        const params = await context.params;

        const data = await request.json();
        const { rating, comment } = data;

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
        }

        // Check if user already reviewed this product
        const existing = await (prisma as any).review.findFirst({
            where: { userId, productId: params.id }
        });
        if (existing) {
            return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 });
        }

        const review = await (prisma as any).review.create({
            data: {
                rating: parseInt(rating),
                comment: comment || '',
                userId,
                productId: params.id,
            },
            include: { user: { select: { name: true, email: true } } },
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error) {
        console.error('Create review error:', error);
        return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }
}
