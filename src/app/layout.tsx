import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/layout/Navigation';

export const metadata: Metadata = {
  title: 'Restaurant Suite',
  description: 'Manage restaurant operations, menus, and reservations.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <><Navigation />{children}</>
      </body>
    </html>
  );
}
