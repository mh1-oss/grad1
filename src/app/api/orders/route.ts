import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export const dynamic = 'force-dynamic';

const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_key_for_development_only'
);

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'You must be logged in to place an order' }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, secretKey);
        const userId = payload.userId as string;

        const data = await request.json();
        const { items } = data; // [{productId, title, price, quantity}]

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        // Calculate total
        const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

        // Create order and decrement stock in a transaction
        const order = await (prisma as any).$transaction(async (tx: any) => {
            // Decrement stock for each item
            for (const item of items) {
                const product = await tx.product.findUnique({ where: { id: item.productId } });
                if (!product || product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${item.title}`);
                }
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            // Create the order
            return tx.order.create({
                data: {
                    userId,
                    total: total * 1.1, // include tax
                    items: {
                        create: items.map((item: any) => ({
                            productId: item.productId,
                            title: item.title,
                            price: item.price,
                            quantity: item.quantity,
                        })),
                    },
                },
                include: { items: true },
            });
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error: any) {
        console.error('Create order error:', error);
        return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
    }
}
