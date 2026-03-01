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
        const productId = params.id;

        await prisma.product.delete({
            where: { id: productId },
        });

        return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Delete product error:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const isAdmin = await verifyAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
        }

        const params = await context.params;
        const productId = params.id;
        const data = await request.json();
        const { title, price, description, imageURL, categoryId } = data;

        const product = await prisma.product.update({
            where: { id: productId },
            data: {
                title,
                price: parseFloat(price),
                description,
                imageURL: imageURL || null,
                categoryId,
            },
        });

        return NextResponse.json({ message: 'Product updated successfully', product }, { status: 200 });
    } catch (error) {
        console.error('Update product error:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}
