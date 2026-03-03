'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-bold text-foreground">Something went wrong</h1>
      <p className="text-secondary">An unexpected error occurred. Please try again.</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
