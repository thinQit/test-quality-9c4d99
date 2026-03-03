import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, signAccessToken, getBearerToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: { itemId: string } }) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const menuItem = await prisma.menuItem.update({
      where: { id: params.itemId },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        available: body.available,
        modifiers: body.modifiers
      }
    });
    return NextResponse.json({ menuItem });
  } catch {
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { itemId: string } }) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await prisma.menuItem.delete({ where: { id: params.itemId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}
