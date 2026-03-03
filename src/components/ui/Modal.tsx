'use client';

import { ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}

export function Modal({ open, title, children, onClose, className }: ModalProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    if (open) {
      document.addEventListener('keydown', onKeyDown);
    }
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn('relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg', className)}
      >
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="text-secondary hover:text-foreground">✕</button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
