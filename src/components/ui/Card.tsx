import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Card({ className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-background shadow-sm ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className = '', ...props }: CardProps) {
  return <div className={`border-b border-border px-4 py-3 ${className}`} {...props} />;
}

export function CardContent({ className = '', ...props }: CardProps) {
  return <div className={`px-4 py-4 ${className}`} {...props} />;
}
