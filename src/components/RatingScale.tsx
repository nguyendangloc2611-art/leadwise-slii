import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import type { RatingValue } from '../types';

const SCALE: { value: 1 | 2 | 3 | 4 | 5; label: string }[] = [
  { value: 1, label: 'Almost never' },
  { value: 2, label: 'Rarely' },
  { value: 3, label: 'Sometimes' },
  { value: 4, label: 'Often' },
  { value: 5, label: 'Almost always' },
];

export function RatingScale({ value, onChange }: { value: RatingValue; onChange: (v: RatingValue) => void }) {
  return (
    <div className="flex flex-wrap items-stretch gap-2">
      {SCALE.map((opt) => {
        const selected = value === opt.value;
        return (
          <motion.button
            key={opt.value}
            whileTap={{ scale: 0.92 }}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex flex-col items-center justify-center gap-1 rounded-xl border-2 px-3.5 py-2.5 min-w-[76px] transition-all',
              selected ? 'border-primary bg-indigo-50 shadow-sm' : 'border-slate-100 hover:border-slate-200'
            )}
          >
            <span className={cn('text-base font-extrabold', selected ? 'text-primary' : 'text-navy')}>{opt.value}</span>
            <span className={cn('text-[10px] font-medium text-center leading-tight', selected ? 'text-primary' : 'text-slate-400')}>
              {opt.label}
            </span>
          </motion.button>
        );
      })}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => onChange(null)}
        className={cn(
          'flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-3.5 py-2.5 min-w-[76px] transition-all',
          value === null ? 'border-slate-400 bg-slate-100' : 'border-slate-100 hover:border-slate-200'
        )}
      >
        <span className="text-xs font-bold text-slate-500">N/A</span>
        <span className="text-[10px] font-medium text-slate-400">Not observed</span>
      </motion.button>
    </div>
  );
}
