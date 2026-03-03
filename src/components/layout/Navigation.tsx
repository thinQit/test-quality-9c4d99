'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import Button from '@/components/ui/Button';

const navLinks = [
  { href: '/', label: 'Menu' },
  { href: '/reservations', label: 'Reservations' },
  { href: '/orders', label: 'Orders' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/menu/manage', label: 'Menu Management' }
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-foreground">
          restaurant management platform with online ordering, reservations, and menu management
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-secondary hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-secondary">{user?.name || user?.email}</span>
              <Button variant="outline" size="sm" onClick={logout} aria-label="Log out">
                Log out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
        <button
          className="inline-flex items-center justify-center rounded-md border border-border p-2 text-secondary md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="text-lg">☰</span>
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-white px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-secondary hover:text-foreground" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              {isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={logout}>Log out</Button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button variant="ghost" size="sm" fullWidth>Log in</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)}>
                    <Button size="sm" fullWidth>Sign up</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navigation;
