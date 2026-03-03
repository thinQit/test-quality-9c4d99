import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

export function signAccessToken(payload: { sub: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { sub: string; role: string };
  } catch {
    return null;
  }
}

export function getBearerToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}

export async function getAuthenticatedUser(request: Request) {
  const token = getBearerToken(request);
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  try {
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    return user;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
