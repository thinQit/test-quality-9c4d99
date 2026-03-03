import { NextRequest, NextResponse } from 'next/server';
import { createId, db } from '@/lib/mockDb';

interface RouteParams {
  params: { id: string };
}

export const GET = async (_request: NextRequest, { params }: RouteParams) => {
  const categories = db.categories.filter((item) => item.restaurantId === params.id);
  return NextResponse.json({ categories });
};

export const POST = async (request: NextRequest, { params }: RouteParams) => {
  const body = await request.json();
  const { name } = body ?? {};

  if (!name) {
    return NextResponse.json({ error: 'Category name is required.' }, { status: 400 });
  }

  const category = { id: createId(), name, restaurantId: params.id };
  db.categories.push(category);
  return NextResponse.json({ category }, { status: 201 });
};
