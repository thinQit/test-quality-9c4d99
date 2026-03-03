import { NextRequest, NextResponse } from 'next/server';
import { createId, db } from '@/lib/mockDb';

export const GET = async () => {
  return NextResponse.json({ items: db.restaurants, total: db.restaurants.length });
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const { name, address, phone } = body ?? {};

  if (!name || !address || !phone) {
    return NextResponse.json({ error: 'Name, address, and phone are required.' }, { status: 400 });
  }

  const restaurant = { id: createId(), name, address, phone };
  db.restaurants.push(restaurant);
  return NextResponse.json({ restaurant }, { status: 201 });
};
