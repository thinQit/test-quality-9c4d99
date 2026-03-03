import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-4xl flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold text-foreground">Restaurant Suite</h1>
        <p className="text-secondary">
          Run daily service with live orders, menus, reservations, and customer accounts.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/login" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white">
          Log in
        </Link>
        <Link href="/signup" className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground">
          Create account
        </Link>
      </div>
    </main>
  );
}
