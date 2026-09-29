import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ArrowRight, UserCog, Users, ShieldAlert, Info, Gauge } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button, Card, Input, Label, Badge } from '../components/ui';
import { cn } from '../lib/utils';
import { observerWeight } from '../lib/scoring';
import type { Frequency, Observer, Recency } from '../types';

const FREQ_OPTIONS: { id: Frequency; label: string }[] = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'rarely', label: 'Rarely' },
];

const RECENCY_OPTIONS: { id: Recency; label: string }[] = [
  { id: 'within-2-weeks', label: 'Within 2 weeks' },
  { id: '2-weeks-1-month', label: '2 weeks - 1 month' },
  { id: 'more-than-1-month', label: 'More than 1 month' },
];

export function ObserversPage() {
  const { state, dispatch, navigate } = useApp();

  useEffect(() => {
    if (!state.activeTaskId && state.tasks.length > 0) {
      dispatch({ type: 'SET_ACTIVE_TASK', taskId: state.tasks[0].id });
    }
  }, [state.activeTaskId, state.tasks, dispatch]);

  const activeTask = state.tasks.find((t) => t.id === state.activeTaskId);

  if (state.tasks.length === 0) {
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

  const taskObservers = state.observers.filter((o) => o.taskId === activeTask?.id);
  const directManager = taskObservers.find((o) => o.role === 'direct-manager') ?? null;
  const otherManagers = taskObservers.filter((o) => o.role === 'other-manager');
  const selfObserver = taskObservers.find((o) => o.role === 'self') ?? null;

  const canContinue = Boolean(directManager && directManager.name && directManager.frequency && directManager.recency);

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
                t.id === activeTask?.id
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              )}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-6">
        {directManager ? (
          <ObserverCard observer={directManager} required />
        ) : (
          <button
            onClick={() => activeTask && dispatch({ type: 'ADD_OBSERVER', taskId: activeTask.id, role: 'direct-manager' })}
            className="w-full rounded-2xl border-2 border-dashed border-primary/40 bg-indigo-50/40 py-8 text-sm font-semibold text-primary hover:bg-indigo-50 transition-colors flex flex-col items-center gap-2"
          >
            <UserCog size={22} />
            Add Direct Manager (required)
          </button>
        )}

        {otherManagers.map((o) => (
          <ObserverCard key={o.id} observer={o} />
        ))}

        {otherManagers.length < 3 && (
          <button
            onClick={() => activeTask && dispatch({ type: 'ADD_OBSERVER', taskId: activeTask.id, role: 'other-manager' })}
            className="w-full rounded-2xl border-2 border-dashed border-slate-200 py-5 text-sm font-semibold text-slate-400 hover:border-primary hover:text-primary hover:bg-indigo-50/30 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add another manager ({otherManagers.length}/3)
          </button>
        )}

        {selfObserver ? (
          <SelfAssessmentCard observer={selfObserver} />
        ) : (
          <button
            onClick={() => activeTask && dispatch({ type: 'ADD_OBSERVER', taskId: activeTask.id, role: 'self' })}
            className="w-full rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/30 py-6 text-sm font-semibold text-violet-500 hover:bg-violet-50 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add employee self-assessment (optional)
          </button>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {!canContinue && (
          <p className="text-sm font-semibold text-rose-600 flex items-center gap-1.5">
            <ShieldAlert size={15} /> Add the Direct Manager's name, frequency, and recency before continuing.
          </p>
        )}
        <Button size="lg" disabled={!canContinue} onClick={() => navigate('assessment')}>
          Continue to Assessment <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-extrabold text-navy tracking-tight">Who sees this employee in action?</h1>
      <p className="text-sm text-slate-500 mt-1.5">Combine observations from people who actually see the employee performing this task.</p>
    </div>
  );
}

function ObserverCard({ observer, required = false }: { observer: Observer; required?: boolean }) {
  const { dispatch } = useApp();
  const weight = observerWeight(observer.frequency, observer.recency);
  const isDirect = observer.role === 'direct-manager';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="p-6 lg:p-7">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl text-white', isDirect ? 'bg-navy' : 'bg-slate-400')}>
              <Users size={16} />
            </div>
            <div>
              <div className="font-bold text-navy text-sm">{isDirect ? 'DIRECT MANAGER' : 'OTHER MANAGER'}</div>
              {required && <span className="text-[11px] text-rose-500 font-semibold">Required</span>}
            </div>
          </div>
          {!required && (
            <button
              onClick={() => dispatch({ type: 'REMOVE_OBSERVER', observerId: observer.id })}
              className="text-slate-300 hover:text-rose-500 p-1.5"
              aria-label="Remove observer"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <Label>Name</Label>
            <Input
              value={observer.name}
              onChange={(e) => dispatch({ type: 'UPDATE_OBSERVER', observerId: observer.id, patch: { name: e.target.value } })}
              placeholder="e.g. David Tran"
            />
          </div>
          <div>
            <Label>Role</Label>
            <Input
              value={observer.title}
              onChange={(e) => dispatch({ type: 'UPDATE_OBSERVER', observerId: observer.id, patch: { title: e.target.value } })}
              placeholder="e.g. Marketing Manager"
            />
          </div>
        </div>

        <div className="mb-5">
          <Label>Observation frequency</Label>
          <div className="flex flex-wrap gap-2">
            {FREQ_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => dispatch({ type: 'UPDATE_OBSERVER', observerId: observer.id, patch: { frequency: opt.id } })}
                className={cn(
                  'rounded-full border-2 px-4 py-1.5 text-xs font-semibold transition-all',
                  observer.frequency === opt.id ? 'border-primary bg-indigo-50 text-primary' : 'border-slate-100 text-slate-500 hover:border-slate-200'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <Label>Last observation</Label>
          <div className="flex flex-wrap gap-2">
            {RECENCY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => dispatch({ type: 'UPDATE_OBSERVER', observerId: observer.id, patch: { recency: opt.id } })}
                className={cn(
                  'rounded-full border-2 px-4 py-1.5 text-xs font-semibold transition-all',
                  observer.recency === opt.id ? 'border-primary bg-indigo-50 text-primary' : 'border-slate-100 text-slate-500 hover:border-slate-200'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Gauge size={14} /> Observer Weight
          </div>
          <div className="text-lg font-extrabold text-navy">{weight.toFixed(2)}</div>
        </div>
        <HelperFormula />
      </Card>
    </motion.div>
  );
}

function HelperFormula() {
  return (
    <p className="text-[11px] text-slate-400 mt-2">
      Observation Weight = Frequency Weight &times; Recency Weight
    </p>
  );
}

function SelfAssessmentCard({ observer }: { observer: Observer }) {
  const { dispatch } = useApp();
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="p-6 lg:p-7 border-2 border-dashed border-violet-200 bg-violet-50/30">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500 text-white">
              <Users size={16} />
            </div>
            <div className="font-bold text-navy text-sm">EMPLOYEE SELF-ASSESSMENT</div>
            <Badge variant="s3">Comparison only</Badge>
          </div>
          <button
            onClick={() => dispatch({ type: 'REMOVE_OBSERVER', observerId: observer.id })}
            className="text-slate-300 hover:text-rose-500 p-1.5"
            aria-label="Remove self-assessment"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl bg-white/70 border border-violet-100 p-4 mb-5">
          <Info size={15} className="text-violet-500 shrink-0 mt-0.5" />
          <p className="min-w-0 flex-1 text-xs text-slate-600">
            Self-assessment does not affect the main score. It is shown separately to identify differences in perception.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input
              value={observer.name}
              onChange={(e) => dispatch({ type: 'UPDATE_OBSERVER', observerId: observer.id, patch: { name: e.target.value } })}
            />
          </div>
          <div>
            <Label>Role</Label>
            <Input
              value={observer.title}
              onChange={(e) => dispatch({ type: 'UPDATE_OBSERVER', observerId: observer.id, patch: { title: e.target.value } })}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
