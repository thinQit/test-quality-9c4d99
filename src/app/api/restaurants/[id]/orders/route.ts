import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mockDb';

interface RouteParams {
  params: { id: string };
}

export const GET = async (request: NextRequest, { params }: RouteParams) => {
  const status = request.nextUrl.searchParams.get('status');
  const items = db.orders.filter(
    (order) => order.restaurantId === params.id && (!status || order.status === status)
  );

  return NextResponse.json({ items, total: items.length });
};
