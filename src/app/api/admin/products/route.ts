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
        const { title, price, description, imageURL, categoryId } = data;

        if (!title || !price || !description || !categoryId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                title,
                price: parseFloat(price),
                description,
                imageURL: imageURL || null,
                categoryId,
            },
        });

        return NextResponse.json({ message: 'Product created successfully', product }, { status: 201 });
    } catch (error) {
        console.error('Create product error:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
