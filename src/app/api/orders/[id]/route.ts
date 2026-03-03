import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mockDb';

interface RouteParams {
  params: { id: string };
}

export const PUT = async (request: NextRequest, { params }: RouteParams) => {
  const body = await request.json();
  const { status } = body ?? {};
  const order = db.orders.find((entry) => entry.id === params.id);

  if (!order) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  }

  if (!status) {
    return NextResponse.json({ error: 'Status is required.' }, { status: 400 });
  }

  order.status = status;
  return NextResponse.json({ order });
};
