import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, signAccessToken, getBearerToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
