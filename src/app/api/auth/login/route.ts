import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db, sanitizeUser } from '@/lib/mockDb';

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const { email, password } = body ?? {};

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const user = db.users.find((entry) => entry.email === email);
  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
  return NextResponse.json({ token, user: sanitizeUser(user) });
};
