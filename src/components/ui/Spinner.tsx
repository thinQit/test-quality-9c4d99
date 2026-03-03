import React from 'react';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Spinner({ className = '', ...props }: SpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-muted border-t-primary ${className}`}
      {...props}
    />
  );
}
