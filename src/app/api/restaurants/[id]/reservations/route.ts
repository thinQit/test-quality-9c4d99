import { NextRequest, NextResponse } from 'next/server';
import { createId, db } from '@/lib/mockDb';

interface RouteParams {
  params: { id: string };
}

export const GET = async (request: NextRequest, { params }: RouteParams) => {
  const status = request.nextUrl.searchParams.get('status');
  const items = db.reservations.filter(
    (reservation) =>
      reservation.restaurantId === params.id && (!status || reservation.status === status)
  );

  return NextResponse.json({ items, total: items.length });
};

export const POST = async (request: NextRequest, { params }: RouteParams) => {
  const body = await request.json();
  const { name, email, phone, partySize, startTime } = body ?? {};

  if (!name || !email || !phone || !partySize) {
    return NextResponse.json({ error: 'All reservation fields are required.' }, { status: 400 });
  }

  const reservation = {
    id: createId(),
    name,
    email,
    phone,
    partySize,
    startTime,
    status: 'confirmed',
    restaurantId: params.id
  };

  db.reservations.push(reservation);
  return NextResponse.json({ reservation }, { status: 201 });
};
