import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export const DIMENSION_META = {
  K: { label: 'Knowledge', letter: 'K', color: 'bg-indigo-500', text: 'text-indigo-600', light: 'bg-indigo-50' },
  T: { label: 'Transfer Skills', letter: 'T', color: 'bg-sky-500', text: 'text-sky-600', light: 'bg-sky-50' },
  M: { label: 'Motivation', letter: 'M', color: 'bg-rose-500', text: 'text-rose-600', light: 'bg-rose-50' },
  C: { label: 'Confidence', letter: 'C', color: 'bg-violet-500', text: 'text-violet-600', light: 'bg-violet-50' },
} as const;

export type DimKey = keyof typeof DIMENSION_META;

export function DimensionScoreBar({
  dim,
  value,
  max = 5,
  suffix,
}: {
  dim: DimKey;
  value: number | null;
  max?: number;
  suffix?: string;
}) {
  const meta = DIMENSION_META[dim];
  const pct = value === null ? 0 : (value / max) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className={cn('flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-extrabold text-white', meta.color)}>
            {meta.letter}
          </span>
          <span className="text-sm font-semibold text-navy">{meta.label}</span>
        </div>
        <span className="text-sm font-bold text-navy tabular-nums">
          {value === null ? 'Insufficient data' : `${value.toFixed(1)}${suffix ?? ` / ${max}`}`}
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', meta.color)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export function DimensionMiniCard({ dim, answered, total = 3 }: { dim: DimKey; answered: number; total?: number }) {
  const meta = DIMENSION_META[dim];
  const pct = (answered / total) * 100;
  return (
    <div className={cn('rounded-xl p-3.5 border border-slate-100', meta.light)}>
      <div className="flex items-center gap-2 mb-2">
        <span className={cn('flex h-6 w-6 items-center justify-center rounded-lg text-xs font-extrabold text-white', meta.color)}>
          {meta.letter}
        </span>
        <span className={cn('text-xs font-bold', meta.text)}>{meta.label}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/70 overflow-hidden mb-1">
        <motion.div className={cn('h-full rounded-full', meta.color)} initial={{ width: 0 }} animate={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] font-semibold text-slate-500">{answered}/{total} answered</span>
    </div>
  );
}
