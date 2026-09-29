import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export function WarningCard({ title, text }: { title: string; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400 text-white">
        <AlertTriangle size={15} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold text-amber-800">{title}</div>
        <p className="text-sm text-amber-700 mt-0.5 leading-relaxed">{text}</p>
      </div>
    </motion.div>
  );
}
