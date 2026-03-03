import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createId, db, sanitizeUser } from '@/lib/mockDb';

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const { name, email, password, role } = body ?? {};

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
  }

  const existing = db.users.find((entry) => entry.email === email);
  if (existing) {
    return NextResponse.json({ error: 'Account already exists.' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: createId(),
    name,
    email,
    role: role ?? 'customer',
    passwordHash
  };

  db.users.push(user);
  const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

  return NextResponse.json({ token, user: sanitizeUser(user) }, { status: 201 });
};
