import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-bold text-foreground">Page not found</h1>
      <p className="text-secondary">We couldn&apos;t find the page you&apos;re looking for. Head back to the homepage.</p>
      <Link href="/">
        <Button>Return home</Button>
      </Link>
    </div>
  );
}
