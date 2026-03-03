'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className = '', id, ...props }: InputProps) {
  const inputId = id || props.name || undefined;

  return (
    <label className="flex flex-col gap-2 text-sm text-secondary">
      {label ? <span className="text-sm font-medium text-foreground">{label}</span> : null}
      <input
        id={inputId}
        className={`w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary ${
          className
        }`}
        {...props}
      />
    </label>
  );
}
