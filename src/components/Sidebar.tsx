import {
  LayoutDashboard,
  Users,
  Eye,
  ClipboardList,
  BarChart3,
  ListChecks,
  FileText,
  RotateCcw,
  Compass,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { computeProgress } from '../lib/progress';
import { Progress } from './ui';
import { cn } from '../lib/utils';
import type { PageId } from '../types';

const NAV: { id: PageId; number: string; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', number: '01', label: 'Overview', icon: LayoutDashboard },
  { id: 'employee-tasks', number: '02', label: 'Employee & Tasks', icon: Users },
  { id: 'observers', number: '03', label: 'Observers', icon: Eye },
  { id: 'assessment', number: '04', label: 'Assessment', icon: ClipboardList },
  { id: 'analysis', number: '05', label: 'Analysis', icon: BarChart3 },
  { id: 'action-plan', number: '06', label: 'Action Plan', icon: ListChecks },
  { id: 'summary', number: '07', label: 'Summary', icon: FileText },
];

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const { state, navigate, resetAll } = useApp();
  const progress = computeProgress(state);

  const content = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between px-6 pt-7 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 text-white shadow-sm">
            <Compass size={18} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-base font-extrabold tracking-tight text-navy leading-none">LEADWISE</div>
            <div className="text-[11px] font-medium text-slate-400 mt-0.5">SLII Decision Support</div>
          </div>
        </div>
        <button className="lg:hidden text-slate-400 hover:text-navy" onClick={onClose} aria-label="Close menu">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        {NAV.map((item) => {
          const active = state.activePage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.id);
                onClose();
              }}
              className={cn(
                'w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 group',
                active ? 'bg-indigo-50 text-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-navy'
              )}
            >
              <span
                className={cn(
                  'text-[10px] font-bold tabular-nums w-4',
                  active ? 'text-primary' : 'text-slate-300 group-hover:text-slate-400'
                )}
              >
                {item.number}
              </span>
              <Icon size={17} strokeWidth={2.2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-4 pb-5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-500">Assessment progress</span>
          <span className="text-xs font-bold text-navy">{progress}%</span>
        </div>
        <Progress value={progress} colorClass="bg-gradient-to-r from-indigo-500 to-violet-500" />
        <button
          onClick={resetAll}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
        >
          <RotateCcw size={13} />
          Reset assessment
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-slate-100 lg:shrink-0">{content}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={onClose} />
          <aside className="absolute left-0 top-0 h-full w-72 shadow-2xl">{content}</aside>
        </div>
      )}
    </>
  );
}
