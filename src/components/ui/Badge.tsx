import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'secondary';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-muted text-foreground',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  secondary: 'bg-slate-100 text-slate-700'
};

export default function Badge({ variant = 'default', className = '', ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
        variantClasses[variant]
      } ${className}`}
      {...props}
    />
  );
}
