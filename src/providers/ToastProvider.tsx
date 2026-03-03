'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toast: () => undefined
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const toast = (message: string, variant: ToastVariant = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setMessages((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((item) => item.id !== id));
    }, 3000);
  };

  const value = useMemo(() => ({ toast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
        {messages.map((item) => (
          <div
            key={item.id}
            className={`rounded-md px-4 py-2 text-sm text-white shadow ${
              item.variant === 'success'
                ? 'bg-emerald-600'
                : item.variant === 'error'
                ? 'bg-rose-600'
                : item.variant === 'warning'
                ? 'bg-amber-600'
                : 'bg-slate-700'
            }`}
          >
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
