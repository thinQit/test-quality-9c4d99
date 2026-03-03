import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, signAccessToken, getBearerToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: { categoryId: string } }) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const category = await prisma.category.update({
      where: { id: params.categoryId },
      data: {
        name: body.name,
        position: body.position
      }
    });
    return NextResponse.json({ category });
  } catch {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { categoryId: string } }) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await prisma.category.delete({ where: { id: params.categoryId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
