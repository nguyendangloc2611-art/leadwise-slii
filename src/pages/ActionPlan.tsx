import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, MessageCircle, ShieldAlert, ShieldHalf, Target, X, ArrowRight, ArrowLeftRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button, Card, Progress } from '../components/ui';
import { diagnoseTask, STYLE_META } from '../lib/scoring';
import { STYLE_PLAYBOOK, CHECKLIST_BY_STYLE } from '../lib/actionPlanData';
import { cn } from '../lib/utils';

const STYLE_BG: Record<string, string> = {
  S1: 'bg-amber-500',
  S2: 'bg-rose-500',
  S3: 'bg-violet-500',
  S4: 'bg-emerald-500',
};

const STYLE_LIGHT: Record<string, string> = {
  S1: 'bg-amber-50 border-amber-100',
  S2: 'bg-rose-50 border-rose-100',
  S3: 'bg-violet-50 border-violet-100',
  S4: 'bg-emerald-50 border-emerald-100',
};

export function ActionPlanPage() {
  const { state, dispatch, navigate } = useApp();
  const activeTask = state.tasks.find((t) => t.id === state.activeTaskId) ?? state.tasks[0];
  const diagnosis = useMemo(() => (activeTask ? diagnoseTask(activeTask, state.observers) : null), [activeTask, state.observers]);

  if (!activeTask) {
    return (
      <div className="space-y-6">
        <PageHeader />
        <Card className="p-8 text-center">
          <ShieldAlert className="mx-auto text-amber-500 mb-3" size={28} />
          <div className="font-bold text-navy mb-1">Leadership starts with a situation.</div>
          <p className="text-sm text-slate-500 mb-4">Define the task before assessing the employee.</p>
          <Button onClick={() => navigate('employee-tasks')}>Go to Employee & Tasks</Button>
        </Card>
      </div>
    );
  }

  if (!diagnosis?.style) {
    return (
      <div className="space-y-6">
        <PageHeader />
        <Card className="p-10 text-center">
          <ShieldAlert className="mx-auto text-amber-500 mb-3" size={30} />
          <div className="font-bold text-navy text-lg mb-1">Not enough observable evidence yet.</div>
          <p className="text-sm text-slate-500 mb-5">Complete the assessment first to get a specific action plan.</p>
          <Button onClick={() => navigate('assessment')}>Go to Assessment</Button>
        </Card>
      </div>
    );
  }

  const style = diagnosis.style;
  const meta = STYLE_META[style];
  const playbook = STYLE_PLAYBOOK[style];
  const checklist = CHECKLIST_BY_STYLE[style];

  const checkedCount = checklist.filter((item) => state.actionPlanChecks[`${activeTask.id}:${item.id}`]).length;

  return (
    <div className="space-y-8">
      <PageHeader />

      {state.tasks.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {state.tasks.map((t) => (
            <button
              key={t.id}
              onClick={() => dispatch({ type: 'SET_ACTIVE_TASK', taskId: t.id })}
              className={cn(
                'rounded-full px-4 py-1.5 text-xs font-semibold border transition-colors',
                t.id === activeTask.id ? 'bg-primary text-white border-primary' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              )}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      <Card className="p-0 overflow-hidden">
        <div className={cn('px-7 py-6 text-white flex items-center gap-4', STYLE_BG[style])}>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl font-extrabold">{style}</div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-white/80">Recommended leadership style</div>
            <div className="text-2xl font-extrabold">{meta.title}</div>
          </div>
        </div>

        <div className="p-6 lg:p-7 space-y-7">
          <div>
            <SectionLabel icon={Target} text="Objective" />
            <p className="text-navy font-medium mt-2">{playbook.objective}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <SectionLabel icon={Check} text="What to do" />
              <ul className="mt-2 space-y-2">
                {playbook.actions.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionLabel icon={X} text="What to avoid" />
              <ul className="mt-2 space-y-2">
                {playbook.avoid.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl bg-slate-50 p-5">
              <SectionLabel icon={ShieldHalf} text="Check-in frequency" />
              <p className="text-navy font-bold mt-2">{playbook.checkin}</p>
            </div>
            <div className="rounded-xl bg-indigo-50/70 p-5">
              <SectionLabel icon={MessageCircle} text="What to say" />
              <p className="text-navy font-medium italic mt-2">"{playbook.conversationStarter}"</p>
            </div>
          </div>

          {playbook.extraNote && (
            <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-5">
              <div className="font-bold text-violet-700 text-sm mb-2">{playbook.extraNote.title}</div>
              <ul className="space-y-1.5">
                {playbook.extraNote.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-violet-700">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-xl border border-slate-100 p-5 flex items-start gap-3">
            <ArrowLeftRight size={18} className="text-primary shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">When to change style</div>
              <p className="text-sm text-navy font-medium">{playbook.moveWhen}</p>
            </div>
          </div>
        </div>
      </Card>

      {activeTask.risk === 'high' && (
        <Card className="p-6 border-2 border-amber-200 bg-amber-50/60">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
              <ShieldAlert size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-amber-800">High-risk task safeguard</div>
              <p className="text-sm text-amber-700 mt-1">
                Because errors in this task have significant consequences, add one additional review checkpoint before
                final delivery.
              </p>
              <p className="text-xs font-semibold text-amber-600 mt-2 italic">
                This is an additional managerial safeguard, not part of the original SLII model.
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card className={cn('p-6 lg:p-7 border-2', STYLE_LIGHT[style])}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-navy">Your next 7 days</h3>
          <span className="text-sm font-bold text-navy">
            {checkedCount} / {checklist.length} completed
          </span>
        </div>
        <Progress value={(checkedCount / checklist.length) * 100} className="mb-5" colorClass={STYLE_BG[style]} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {(['TODAY', 'THIS WEEK', 'END OF WEEK'] as const).map((group) => (
            <div key={group}>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2.5">{group}</div>
              <div className="space-y-2">
                {checklist
                  .filter((item) => item.group === group)
                  .map((item) => {
                    const key = `${activeTask.id}:${item.id}`;
                    const checked = Boolean(state.actionPlanChecks[key]);
                    return (
                      <motion.button
                        key={item.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => dispatch({ type: 'TOGGLE_ACTION_ITEM', key })}
                        className={cn(
                          'w-full flex items-start gap-2.5 rounded-xl border p-3 text-left transition-colors',
                          checked ? 'bg-white border-emerald-200' : 'bg-white/70 border-slate-100 hover:border-slate-200'
                        )}
                      >
                        <span
                          className={cn(
                            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
                            checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
                          )}
                        >
                          {checked && <Check size={12} className="text-white" />}
                        </span>
                        <span className={cn('text-sm font-medium', checked ? 'text-slate-400 line-through' : 'text-navy')}>
                          {item.text}
                        </span>
                      </motion.button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end pt-2">
        <Button size="lg" onClick={() => navigate('summary')}>
          View leadership summary <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}

function SectionLabel({ icon: Icon, text }: { icon: typeof Target; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={14} className="text-slate-400" />
      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{text}</span>
    </div>
  );
}

function PageHeader() {
  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-extrabold text-navy tracking-tight">Okay — what should I actually do?</h1>
      <p className="text-sm text-slate-500 mt-1.5">Translating the diagnosis into specific managerial behavior.</p>
    </div>
  );
}
