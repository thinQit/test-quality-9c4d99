import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, signAccessToken, getBearerToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
      include: { items: true }
    });
    if (!order) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const order = await prisma.order.update({
      where: { id: params.orderId },
      data: {
        status: body.status,
        fulfillmentType: body.fulfillmentType
      },
      include: { items: true }
    });
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
