import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, signAccessToken, getBearerToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || (user.id !== params.userId && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') || 1);
    const perPage = Number(searchParams.get('perPage') || 20);

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: params.userId },
        include: { items: true },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where: { userId: params.userId } })
    ]);

    return NextResponse.json({ items, total });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch order history' }, { status: 500 });
  }
}
