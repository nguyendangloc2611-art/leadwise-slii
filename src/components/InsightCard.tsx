import { Lightbulb, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export function InsightCard({ text, icon = 'insight' }: { text: string; icon?: 'insight' | 'cross-check' }) {
  const Icon = icon === 'cross-check' ? Search : Lightbulb;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
        <Icon size={15} />
      </div>
      <p className="min-w-0 flex-1 text-sm text-navy font-medium leading-relaxed">{text}</p>
    </motion.div>
  );
}
