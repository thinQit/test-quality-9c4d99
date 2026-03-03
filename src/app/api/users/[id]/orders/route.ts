import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mockDb';

interface RouteParams {
  params: { id: string };
}

export const GET = async (_request: NextRequest, { params }: RouteParams) => {
  const items = db.orders.filter((order) => order.userId === params.id);
  return NextResponse.json({ items, total: items.length });
};
