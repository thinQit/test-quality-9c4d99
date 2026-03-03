import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mockDb';

export const GET = async (request: NextRequest) => {
  const restaurantId = request.nextUrl.searchParams.get('restaurantId');

  const orders = db.orders.filter(
    (order) => (!restaurantId || order.restaurantId === restaurantId) && order.status !== 'cancelled'
  );

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

  return NextResponse.json({
    totalSales,
    orders: orders.length,
    breakdown: { byCategory: [] }
  });
};
