import { useState } from 'react';
import { Menu, Check, Save, User2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Button } from './ui';

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { state } = useApp();
  const [saved, setSaved] = useState(false);

  const activeTask = state.tasks.find((t) => t.id === state.activeTaskId);

  const handleSave = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-100 bg-white/90 backdrop-blur px-4 lg:px-8 py-3.5">
      <div className="flex items-center gap-3 min-w-0">
        <button className="lg:hidden text-slate-500 hover:text-navy" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <div className="min-w-0 flex items-center gap-4 lg:gap-6 flex-wrap">
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-400 leading-none">Employee</div>
            <div className="text-sm font-bold text-navy truncate max-w-[10rem]">
              {state.employee.name || 'Not set yet'}
            </div>
          </div>
          <div className="hidden sm:block h-8 w-px bg-slate-100" />
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-400 leading-none">Current task</div>
            <div className="text-sm font-bold text-navy truncate max-w-[12rem]">{activeTask?.name || 'No task selected'}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="relative">
          <Button variant="outline" size="sm" onClick={handleSave} className="hidden sm:inline-flex">
            <AnimatePresence mode="wait" initial={false}>
              {saved ? (
                <motion.span
                  key="saved"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="flex items-center gap-1.5 text-emerald-600"
                >
                  <Check size={14} /> Saved
                </motion.span>
              ) : (
                <motion.span
                  key="save"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="flex items-center gap-1.5"
                >
                  <Save size={14} /> Save progress
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-white">
          <User2 size={16} />
        </div>
      </div>
    </header>
  );
}
