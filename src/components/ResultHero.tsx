import { ArrowDown, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { DEV_LEVEL_META, STYLE_META } from '../lib/scoring';
import type { DevelopmentLevel, StyleId } from '../types';
import { cn } from '../lib/utils';

const GRADIENTS: Record<StyleId, string> = {
  S1: 'from-amber-400 via-orange-500 to-amber-600',
  S2: 'from-rose-400 via-pink-500 to-rose-600',
  S3: 'from-violet-400 via-purple-500 to-violet-600',
  S4: 'from-emerald-400 via-teal-500 to-emerald-600',
};

const HERO_TAGLINE: Record<StyleId, string> = {
  S1: 'Show them exactly how, step by step.',
  S2: 'Coach through the struggle together.',
  S3: "Facilitate, don't dictate.",
  S4: 'Step back and let them own it.',
};

export function ResultHero({ dev, style }: { dev: DevelopmentLevel; style: StyleId }) {
  const devMeta = DEV_LEVEL_META[dev];
  const styleMeta = STYLE_META[style];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
      <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-center">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Development level</div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-5xl font-extrabold text-navy leading-none mb-2"
        >
          {dev}
        </motion.div>
        <div className="text-sm font-bold text-slate-600 uppercase tracking-wide">{devMeta.title}</div>
        <p className="text-xs text-slate-400 mt-2">{devMeta.description}</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className={cn('lg:col-span-3 relative overflow-hidden rounded-2xl p-7 lg:p-8 text-white bg-gradient-to-br', GRADIENTS[style])}
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-14 -left-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <div className="text-xs font-bold uppercase tracking-widest text-white/80 mb-3">Recommended Style</div>
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-4xl font-extrabold">{styleMeta.short}</span>
            <span className="text-2xl font-extrabold tracking-tight">{styleMeta.title}</span>
          </div>
          <div className="flex items-center gap-5 mt-4 mb-4">
            <span className="flex items-center gap-1.5 text-sm font-semibold bg-white/15 rounded-full px-3 py-1">
              {styleMeta.direction === 'high' ? <ArrowUp size={14} /> : <ArrowDown size={14} />} Direction
            </span>
            <span className="flex items-center gap-1.5 text-sm font-semibold bg-white/15 rounded-full px-3 py-1">
              {styleMeta.support === 'high' ? <ArrowUp size={14} /> : <ArrowDown size={14} />} Support
            </span>
          </div>
          <div className="text-lg font-bold italic">"{HERO_TAGLINE[style]}"</div>
        </div>
      </motion.div>
    </div>
  );
}
