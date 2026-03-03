import { NextRequest, NextResponse } from 'next/server';
import { createId, db } from '@/lib/mockDb';

interface RouteParams {
  params: { id: string };
}

export const GET = async (_request: NextRequest, { params }: RouteParams) => {
  const items = db.menuItems.filter((item) => item.restaurantId === params.id);
  return NextResponse.json({ items });
};

export const POST = async (request: NextRequest, { params }: RouteParams) => {
  const body = await request.json();
  const { name, description, price, categoryId } = body ?? {};

  if (!name || typeof price !== 'number') {
    return NextResponse.json({ error: 'Name and price are required.' }, { status: 400 });
  }

  const menuItem = {
    id: createId(),
    name,
    description,
    price,
    available: true,
    restaurantId: params.id,
    categoryId: categoryId ?? null
  };

  db.menuItems.push(menuItem);
  return NextResponse.json({ menuItem }, { status: 201 });
};
