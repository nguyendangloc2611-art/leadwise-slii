import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardCheck,
  MessagesSquare,
  HeartHandshake,
  Rocket,
  ArrowRight,
  Ruler,
  Building,
  FlaskConical,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge, Card, Input } from '../components/ui';
import { diagnoseTask, STYLE_META } from '../lib/scoring';
import { initials, cn } from '../lib/utils';
import type { StyleId } from '../types';

const STYLE_BADGE: Record<StyleId, 's1' | 's2' | 's3' | 's4'> = { S1: 's1', S2: 's2', S3: 's3', S4: 's4' };
const STYLE_BORDER: Record<StyleId, string> = {
  S1: 'border-amber-200',
  S2: 'border-rose-200',
  S3: 'border-violet-200',
  S4: 'border-emerald-200',
};

export function SummaryPage() {
  const { state, dispatch, navigate } = useApp();

  const diagnoses = useMemo(
    () => state.tasks.map((task) => ({ task, diagnosis: diagnoseTask(task, state.observers) })),
    [state.tasks, state.observers]
  );

  const assessed = diagnoses.filter((d) => d.diagnosis.style !== null);
  const needsCoaching = assessed.filter((d) => d.diagnosis.style === 'S2').length;
  const needsSupport = assessed.filter((d) => d.diagnosis.style === 'S3').length;
  const readyForDelegation = assessed.filter((d) => d.diagnosis.style === 'S4').length;

  const needsAttention = assessed.filter((d) => d.diagnosis.developmentLevel === 'D2');

  const sortedByDeadline = [...assessed]
    .filter((d) => d.task.deadline)
    .sort((a, b) => new Date(a.task.deadline).getTime() - new Date(b.task.deadline).getTime());

  const styleVariety = new Set(assessed.map((d) => d.diagnosis.style)).size > 1;
  const lowestStyle = assessed.slice().sort((a, b) => styleRank(a.diagnosis.style) - styleRank(b.diagnosis.style))[0];
  const highestStyle = assessed.slice().sort((a, b) => styleRank(b.diagnosis.style) - styleRank(a.diagnosis.style))[0];

  const sortedForTable = [...assessed].sort((a, b) => {
    const aD2 = a.diagnosis.developmentLevel === 'D2' ? 0 : 1;
    const bD2 = b.diagnosis.developmentLevel === 'D2' ? 0 : 1;
    return aD2 - bD2;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-navy tracking-tight">Leadership Overview</h1>
        <p className="text-sm text-slate-500 mt-1.5">A single view of how leadership should adapt across this employee's tasks.</p>
      </div>

      <Card className="p-6 flex items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xl font-extrabold shrink-0">
          {initials(state.employee.name || '?')}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Name</div>
            <div className="font-bold text-navy">{state.employee.name || 'Not set'}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Role</div>
            <div className="font-bold text-navy">{state.employee.position || 'Not set'}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tenure</div>
            <div className="font-bold text-navy">{state.employee.tenure || 'Not set'}</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard value={assessed.length} label="Tasks Assessed" icon={ClipboardCheck} color="bg-navy" />
        <KpiCard value={needsCoaching} label="Needs Coaching" icon={MessagesSquare} color="bg-rose-500" />
        <KpiCard value={needsSupport} label="Needs Support" icon={HeartHandshake} color="bg-violet-500" />
        <KpiCard value={readyForDelegation} label="Ready for Delegation" icon={Rocket} color="bg-emerald-500" />
      </div>

      {needsAttention.length > 0 && (
        <Card className="p-6 border-2 border-rose-100 bg-rose-50/40">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert size={17} className="text-rose-500" />
            <h3 className="font-bold text-navy">Needs your attention</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            The employee is developing competence but may be experiencing declining confidence or motivation on these
            tasks. This is a signal to invest attention — not a prediction that the employee will fail or disengage.
          </p>
          <div className="flex flex-wrap gap-2">
            {needsAttention.map((d) => (
              <Badge key={d.task.id} variant="s2">
                {d.task.name} — D2 Coaching
              </Badge>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-0 overflow-hidden">
        <div className="px-6 lg:px-7 pt-6 pb-4">
          <h3 className="text-lg font-bold text-navy">Tasks &amp; recommended leadership</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-slate-100 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 lg:px-7 py-3">Task</th>
                <th className="px-4 py-3">Development</th>
                <th className="px-4 py-3">Style</th>
                <th className="px-4 py-3">Check-in</th>
                <th className="px-4 py-3">Reassess</th>
              </tr>
            </thead>
            <tbody>
              {sortedForTable.map(({ task, diagnosis }) => (
                <tr key={task.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-6 lg:px-7 py-4 font-semibold text-navy">
                    {task.name}
                    {diagnosis.developmentLevel === 'D2' && <Badge variant="warning" className="ml-2">Priority</Badge>}
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant="neutral">{diagnosis.developmentLevel}</Badge>
                  </td>
                  <td className="px-4 py-4">
                    {diagnosis.style && <Badge variant={STYLE_BADGE[diagnosis.style]}>{STYLE_META[diagnosis.style].title}</Badge>}
                  </td>
                  <td className="px-4 py-4 text-slate-500">{diagnosis.style && checkinForStyle(diagnosis.style)}</td>
                  <td className="px-4 py-4">
                    <Input
                      type="date"
                      value={state.reassessDates[task.id] ?? ''}
                      onChange={(e) => dispatch({ type: 'SET_REASSESS_DATE', taskId: task.id, date: e.target.value })}
                      className="py-1.5 text-xs w-40"
                    />
                    <div className="text-[11px] text-slate-400 mt-1">
                      {diagnosis.developmentLevel && (diagnosis.developmentLevel === 'D1' || diagnosis.developmentLevel === 'D2')
                        ? 'Suggested: 2-4 weeks'
                        : 'Suggested: 1-3 months'}
                    </div>
                  </td>
                </tr>
              ))}
              {sortedForTable.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    No assessed tasks yet. Complete the assessment to populate this table.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {styleVariety && lowestStyle && highestStyle && (
        <Card className="p-6 lg:p-7 bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
          <div className="flex items-start gap-3">
            <Sparkles size={20} className="shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="text-lg font-extrabold mb-1">Same employee. Different leadership.</div>
              <p className="text-indigo-100 text-sm max-w-2xl">
                You should provide close {lowestStyle.diagnosis.style && STYLE_META[lowestStyle.diagnosis.style].title.toLowerCase()} for{' '}
                <strong>{lowestStyle.task.name}</strong>, while <strong>{highestStyle.task.name}</strong> can already be{' '}
                {highestStyle.diagnosis.style && STYLE_META[highestStyle.diagnosis.style].title.toLowerCase()}.
              </p>
              <p className="text-white font-semibold text-sm mt-3">Leadership should adapt to the TASK, not label the PERSON.</p>
            </div>
          </div>
        </Card>
      )}

      {sortedByDeadline.length > 1 && (
        <Card className="p-6 lg:p-7">
          <h3 className="text-lg font-bold text-navy mb-1">Development timeline</h3>
          <p className="text-sm text-slate-500 mb-6">Ordered by each task's target deadline.</p>
          <div className="flex flex-col lg:flex-row items-stretch gap-3">
            {sortedByDeadline.map(({ task, diagnosis }, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-1 items-center gap-2"
              >
                <div className={cn('flex-1 rounded-xl border p-4 text-center', diagnosis.style ? STYLE_BORDER[diagnosis.style] : 'border-slate-100')}>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                    {new Date(task.deadline + 'T00:00:00').toLocaleDateString('en-US', { month: 'long' }).toUpperCase()}
                  </div>
                  <div className="text-xl font-extrabold text-navy">{diagnosis.developmentLevel}</div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">
                    {diagnosis.style && STYLE_META[diagnosis.style].title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 truncate">{task.name}</div>
                </div>
                {i < sortedByDeadline.length - 1 && <ArrowRight className="hidden lg:block text-slate-300 shrink-0" size={18} />}
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      <div className="pt-4">
        <p className="text-center font-bold text-navy mb-5">Use SLII as a guide, not an automatic decision-maker.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DisclaimerCard
            number="01"
            title="Measurement"
            text="Competence and commitment assessments depend partly on observer judgment."
            icon={Ruler}
          />
          <DisclaimerCard
            number="02"
            title="Context"
            text="Organizational and cultural context may influence leadership effectiveness."
            icon={Building}
          />
          <DisclaimerCard
            number="03"
            title="Evidence"
            text="SLII is a practical management framework, but its empirical support has limitations."
            icon={FlaskConical}
          />
        </div>
        <p className="text-center text-sm text-slate-400 mt-6 max-w-lg mx-auto">
          This tool supports managerial judgment. It does not replace conversations between managers and employees.
        </p>
      </div>
    </div>
  );
}

function styleRank(style: StyleId | null): number {
  if (!style) return 0;
  return { S1: 1, S2: 2, S3: 3, S4: 4 }[style];
}

function checkinForStyle(style: StyleId): string {
  return { S1: 'Daily', S2: '2-3x weekly', S3: 'Weekly', S4: 'Milestones' }[style];
}

function KpiCard({ value, label, icon: Icon, color }: { value: number; label: string; icon: typeof ClipboardCheck; color: string }) {
  return (
    <Card className="p-5">
      <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl text-white mb-3', color)}>
        <Icon size={16} />
      </div>
      <div className="text-3xl font-extrabold text-navy">{value}</div>
      <div className="text-xs font-semibold text-slate-500 mt-1">{label}</div>
    </Card>
  );
}

function DisclaimerCard({ number, title, text, icon: Icon }: { number: string; title: string; text: string; icon: typeof Ruler }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-extrabold text-slate-300">{number}</span>
        <Icon size={14} className="text-slate-400" />
        <span className="text-sm font-bold text-navy">{title}</span>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{text}</p>
    </Card>
  );
}
