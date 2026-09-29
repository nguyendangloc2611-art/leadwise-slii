import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

type BadgeVariant = 'neutral' | 'primary' | 's1' | 's2' | 's3' | 's4' | 'success' | 'warning' | 'danger' | 'outline';

const variants: Record<BadgeVariant, string> = {
  neutral: 'bg-slate-100 text-slate-600',
  primary: 'bg-indigo-50 text-primary',
  s1: 'bg-amber-100 text-amber-700',
  s2: 'bg-rose-100 text-rose-700',
  s3: 'bg-violet-100 text-violet-700',
  s4: 'bg-emerald-100 text-emerald-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-rose-100 text-rose-700',
  outline: 'bg-white text-slate-500 border border-slate-200',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
