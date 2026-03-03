import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, signAccessToken, getBearerToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: { reservationId: string } }) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const reservation = await prisma.reservation.update({
      where: { id: params.reservationId },
      data: {
        status: body.status,
        partySize: body.partySize,
        startTime: body.startTime ? new Date(body.startTime) : undefined,
        tableId: body.tableId
      }
    });
    return NextResponse.json({ reservation });
  } catch {
    return NextResponse.json({ error: 'Failed to update reservation' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { reservationId: string } }) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await prisma.reservation.delete({ where: { id: params.reservationId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete reservation' }, { status: 500 });
  }
}
