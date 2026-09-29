import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Target, MessagesSquare, HeartHandshake, Rocket, Info, Database, Eye, ArrowDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button, Card } from '../components/ui';
import { DEV_LEVEL_META } from '../lib/scoring';
import type { DevelopmentLevel } from '../types';

const STYLE_CARDS = [
  {
    id: 'S1',
    title: 'DIRECTING',
    direction: 'High Direction',
    support: 'Low Support',
    quote: '"Tell me how."',
    icon: Target,
    from: 'from-amber-400',
    to: 'to-orange-500',
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    id: 'S2',
    title: 'COACHING',
    direction: 'High Direction',
    support: 'High Support',
    quote: '"Show me why."',
    icon: MessagesSquare,
    from: 'from-rose-400',
    to: 'to-pink-500',
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
  },
  {
    id: 'S3',
    title: 'SUPPORTING',
    direction: 'Low Direction',
    support: 'High Support',
    quote: '"Let me try."',
    icon: HeartHandshake,
    from: 'from-violet-400',
    to: 'to-purple-500',
    text: 'text-violet-700',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
  },
  {
    id: 'S4',
    title: 'DELEGATING',
    direction: 'Low Direction',
    support: 'Low Support',
    quote: '"I\'ve got this."',
    icon: Rocket,
    from: 'from-emerald-400',
    to: 'to-teal-500',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
];

const DEV_ORDER: DevelopmentLevel[] = ['D1', 'D2', 'D3', 'D4'];

export function OverviewPage() {
  const { loadDemo, resetAll, navigate } = useApp();

  return (
    <div className="space-y-8">
      <Card className="relative overflow-hidden p-8 lg:p-12 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 border-none text-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold mb-5">
            <Sparkles size={13} /> Situational Leadership II
          </div>
          <h1 className="text-3xl lg:text-[2.75rem] font-extrabold leading-[1.1] tracking-tight">
            Lead differently.
            <br />
            Because every task is different.
          </h1>
          <p className="mt-4 text-base lg:text-lg text-indigo-100 max-w-xl">
            SLII helps managers adapt their leadership behavior based on an employee's competence and commitment for a
            specific task.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              onClick={() => navigate('employee-tasks')}
              className="bg-white text-primary hover:bg-indigo-50 shadow-lg shadow-indigo-900/30"
            >
              Start Assessment <ArrowRight size={18} />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={loadDemo}
              className="bg-white/10 text-white hover:bg-white/20 border border-white/20"
            >
              <Database size={16} /> Load Demo Data
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={() => {
                resetAll();
                navigate('employee-tasks');
              }}
              className="bg-transparent text-indigo-100 hover:bg-white/10 border border-white/15"
            >
              Start New Assessment
            </Button>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-xl font-bold text-navy mb-1">The four SLII leadership styles</h2>
        <p className="text-sm text-slate-500 mb-5">Each style balances directive behavior with supportive behavior differently.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {STYLE_CARDS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
              >
                <Card hover className={`p-5 h-full border ${s.border} ${s.bg}`}>
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.from} ${s.to} text-white shadow-sm mb-4`}>
                    <Icon size={20} />
                  </div>
                  <div className="text-xs font-bold tracking-widest text-slate-400 mb-1">{s.id}</div>
                  <div className={`text-lg font-extrabold ${s.text} mb-3`}>{s.title}</div>
                  <div className="space-y-1 text-xs font-medium text-slate-500 mb-3">
                    <div>{s.direction}</div>
                    <div>{s.support}</div>
                  </div>
                  <div className={`text-sm font-semibold ${s.text}`}>{s.quote}</div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-navy mb-1">The employee development journey</h2>
        <p className="text-sm text-slate-500 mb-5">As competence and commitment shift for a task, the leadership style should shift too.</p>
        <Card className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-stretch gap-3 lg:gap-2">
            {DEV_ORDER.map((d, i) => (
              <div key={d} className="flex flex-1 items-center gap-2">
                <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-center">
                  <div className="text-xl font-extrabold text-navy">{d}</div>
                  <div className="text-xs font-semibold text-slate-500 mt-1 leading-snug">{DEV_LEVEL_META[d].title}</div>
                </div>
                {i < DEV_ORDER.length - 1 && (
                  <ArrowRight className="hidden lg:block text-slate-300 shrink-0" size={20} />
                )}
                {i < DEV_ORDER.length - 1 && (
                  <ArrowDown className="lg:hidden text-slate-300 shrink-0 mx-auto" size={18} />
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 lg:p-7 bg-indigo-50/60 border-indigo-100 flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
          <Info size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-bold text-navy mb-1">Development is task-specific.</div>
          <p className="text-sm text-slate-600 max-w-2xl">
            The same employee may need Directing for a new task and Delegating for a familiar one. Never label the
            person &mdash; assess the situation for each task individually.
          </p>
        </div>
      </Card>

      <Card className="p-6 lg:p-7 flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-white">
          <Eye size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-bold text-navy mb-1">How LEADWISE works</div>
          <p className="text-sm text-slate-600 max-w-2xl">
            Define the employee and task &rarr; gather multi-source observations &rarr; diagnose competence and
            commitment &rarr; get a recommended leadership style &rarr; act on specific behaviors &rarr; reassess as
            development changes.
          </p>
        </div>
      </Card>
    </div>
  );
}
