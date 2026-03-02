import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export const dynamic = 'force-dynamic';

const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_key_for_development_only'
);

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { payload } = await jwtVerify(token, secretKey);
        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { role: true },
        });

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const params = await context.params;
        const orderId = params.id;

        const order = await (prisma as any).order.findUnique({
            where: { id: orderId },
            include: { items: true },
        });

        if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        if (order.status === 'CANCELLED') return NextResponse.json({ error: 'Order is already cancelled' }, { status: 400 });

        // Cancel the order and increment stock back using a transaction
        await (prisma as any).$transaction(async (tx: any) => {
            await tx.order.update({
                where: { id: orderId },
                data: { status: 'CANCELLED' },
            });

            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { increment: item.quantity } },
                });
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Cancel order API error:', error);
        return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 });
    }
}
