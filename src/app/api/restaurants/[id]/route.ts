import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mockDb';

interface RouteParams {
  params: { id: string };
}

export const PUT = async (request: NextRequest, { params }: RouteParams) => {
  const body = await request.json();
  const restaurant = db.restaurants.find((entry) => entry.id === params.id);

  if (!restaurant) {
    return NextResponse.json({ error: 'Restaurant not found.' }, { status: 404 });
  }

  restaurant.name = body?.name ?? restaurant.name;
  restaurant.address = body?.address ?? restaurant.address;
  restaurant.phone = body?.phone ?? restaurant.phone;

  return NextResponse.json({ restaurant });
};
