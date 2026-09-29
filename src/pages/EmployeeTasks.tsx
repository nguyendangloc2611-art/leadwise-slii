import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ArrowRight, Lightbulb, Briefcase, Building2, Clock, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button, Card, Input, Label, Textarea, HelperText, Badge } from '../components/ui';
import { cn, initials } from '../lib/utils';
import type { Familiarity, RiskLevel, Task } from '../types';

const FAMILIARITY_OPTIONS: { id: Familiarity; label: string; helper: string }[] = [
  { id: 'new', label: 'Completely new', helper: 'Never performed this task before' },
  { id: 'occasional', label: 'Done 1-3 times', helper: 'Some exposure, not yet routine' },
  { id: 'regular', label: 'Done regularly', helper: 'Performs this task routinely' },
];

const RISK_OPTIONS: { id: RiskLevel; label: string; classes: string }[] = [
  { id: 'low', label: 'LOW', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'medium', label: 'MEDIUM', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'high', label: 'HIGH', classes: 'bg-rose-50 text-rose-700 border-rose-200' },
];

export function EmployeeTasksPage() {
  const { state, dispatch, navigate } = useApp();
  const [showWarning, setShowWarning] = useState(false);

  const isTaskComplete = (t: Task) => Boolean(t.name && t.outcome && t.measurement && t.deadline && t.familiarity && t.risk);
  const canContinue = Boolean(state.employee.name) && state.tasks.length > 0 && state.tasks.some(isTaskComplete);

  const handleContinue = () => {
    if (!canContinue) {
      setShowWarning(true);
      return;
    }
    navigate('observers');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-navy tracking-tight">Who are we leading?</h1>
        <p className="text-sm text-slate-500 mt-1.5">Start with the employee, then define the specific tasks you want to assess.</p>
      </div>

      <Card className="p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center md:items-start gap-3 md:w-48 shrink-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-2xl font-extrabold shadow-md">
              {initials(state.employee.name || '?')}
            </div>
            <div className="text-center md:text-left">
              <div className="font-bold text-navy">{state.employee.name || 'New employee'}</div>
              <div className="text-xs text-slate-500">{state.employee.position || 'Position not set'}</div>
              <div className="text-xs text-slate-400 mt-0.5">{state.employee.tenure || ''}</div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label>Employee name</Label>
              <Input
                placeholder="e.g. Nguyen Linh"
                value={state.employee.name}
                onChange={(e) => dispatch({ type: 'UPDATE_EMPLOYEE', employee: { name: e.target.value } })}
              />
            </div>
            <div>
              <Label>Position / Role</Label>
              <Input
                placeholder="e.g. Marketing Executive"
                value={state.employee.position}
                onChange={(e) => dispatch({ type: 'UPDATE_EMPLOYEE', employee: { position: e.target.value } })}
              />
            </div>
            <div>
              <Label>
                <span className="inline-flex items-center gap-1.5"><Building2 size={13} /> Department</span>
              </Label>
              <Input
                placeholder="e.g. Marketing"
                value={state.employee.department}
                onChange={(e) => dispatch({ type: 'UPDATE_EMPLOYEE', employee: { department: e.target.value } })}
              />
            </div>
            <div>
              <Label>
                <span className="inline-flex items-center gap-1.5"><Clock size={13} /> Time in current position</span>
              </Label>
              <Input
                placeholder="e.g. 2 years"
                value={state.employee.tenure}
                onChange={(e) => dispatch({ type: 'UPDATE_EMPLOYEE', employee: { tenure: e.target.value } })}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-5 bg-indigo-50/60 border-indigo-100 flex items-start gap-3">
        <Lightbulb className="text-primary shrink-0 mt-0.5" size={18} />
        <div className="min-w-0 flex-1">
          <div className="font-bold text-navy text-sm">Assess the task, not the person.</div>
          <p className="text-sm text-slate-600 mt-0.5">
            A person can be highly competent in one responsibility and still need guidance in another.
          </p>
        </div>
      </Card>

      <div className="space-y-6">
        {state.tasks.map((task, index) => (
          <TaskCard key={task.id} task={task} index={index} />
        ))}

        {state.tasks.length < 3 && (
          <button
            onClick={() => dispatch({ type: 'ADD_TASK' })}
            className="w-full rounded-2xl border-2 border-dashed border-slate-200 py-6 text-sm font-semibold text-slate-400 hover:border-primary hover:text-primary hover:bg-indigo-50/40 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add another task
          </button>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {showWarning && !canContinue && (
          <p className="text-sm font-semibold text-rose-600 flex items-center gap-1.5">
            <ShieldAlert size={15} /> Leadership starts with a situation. Define the task before assessing the employee.
          </p>
        )}
        <Button size="lg" onClick={handleContinue}>
          Continue to Observers <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}

function TaskCard({ task, index }: { task: Task; index: number }) {
  const { state, dispatch } = useApp();
  const isActive = state.activeTaskId === task.id;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card
        className={cn('p-6 lg:p-7 border-2 transition-colors', isActive ? 'border-primary/40' : 'border-transparent')}
        onClick={() => dispatch({ type: 'SET_ACTIVE_TASK', taskId: task.id })}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Badge variant="primary" className="shrink-0">
              TASK {String(index + 1).padStart(2, '0')}
            </Badge>
            <Input
              value={task.name}
              onChange={(e) => dispatch({ type: 'UPDATE_TASK', taskId: task.id, patch: { name: e.target.value } })}
              className="font-bold text-navy border-transparent bg-transparent px-0 focus:bg-white focus:px-3.5 focus:border-slate-200"
              placeholder="Task name"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isActive && <Badge variant="success">Active</Badge>}
            {state.tasks.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({ type: 'REMOVE_TASK', taskId: task.id });
                }}
                className="text-slate-300 hover:text-rose-500 transition-colors p-1.5"
                aria-label="Remove task"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase size={14} className="text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">SMART Goal Builder</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs text-slate-500">Desired outcome</Label>
              <Textarea
                rows={2}
                placeholder="What should be achieved?"
                value={task.outcome}
                onChange={(e) => dispatch({ type: 'UPDATE_TASK', taskId: task.id, patch: { outcome: e.target.value } })}
              />
            </div>
            <div>
              <Label className="text-xs text-slate-500">Measurement</Label>
              <Textarea
                rows={2}
                placeholder="How will success be measured?"
                value={task.measurement}
                onChange={(e) => dispatch({ type: 'UPDATE_TASK', taskId: task.id, patch: { measurement: e.target.value } })}
              />
            </div>
            <div>
              <Label className="text-xs text-slate-500">Deadline</Label>
              <Input
                type="date"
                value={task.deadline}
                onChange={(e) => dispatch({ type: 'UPDATE_TASK', taskId: task.id, patch: { deadline: e.target.value } })}
              />
              <HelperText>When must it be completed?</HelperText>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">Task Familiarity</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {FAMILIARITY_OPTIONS.map((opt) => {
              const selected = task.familiarity === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: 'UPDATE_TASK', taskId: task.id, patch: { familiarity: opt.id } });
                  }}
                  className={cn(
                    'text-left rounded-xl border-2 p-4 transition-all',
                    selected ? 'border-primary bg-indigo-50/60' : 'border-slate-100 hover:border-slate-200'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        'h-4 w-4 rounded-full border-2 flex items-center justify-center',
                        selected ? 'border-primary' : 'border-slate-300'
                      )}
                    >
                      {selected && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </span>
                    <span className={cn('text-sm font-semibold', selected ? 'text-primary' : 'text-navy')}>{opt.label}</span>
                  </div>
                  <p className="text-xs text-slate-500 pl-6">{opt.helper}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">Task Risk</span>
          <div className="flex flex-wrap gap-2.5 mb-2">
            {RISK_OPTIONS.map((opt) => {
              const selected = task.risk === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: 'UPDATE_TASK', taskId: task.id, patch: { risk: opt.id } });
                  }}
                  className={cn(
                    'rounded-full border-2 px-5 py-1.5 text-xs font-bold tracking-wide transition-all',
                    selected ? opt.classes : 'border-slate-100 text-slate-400 hover:border-slate-200'
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <HelperText>Risk is an additional managerial safeguard and is not part of the original SLII model.</HelperText>
        </div>
      </Card>
    </motion.div>
  );
}
