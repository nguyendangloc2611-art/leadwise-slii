import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldAlert, FileEdit } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button, Card, Textarea, Badge } from '../components/ui';
import { RatingScale } from '../components/RatingScale';
import { DimensionMiniCard } from '../components/DimensionScore';
import { QUESTIONS, DIMENSION_SECTIONS } from '../lib/questions';
import { cn } from '../lib/utils';
import type { Observer } from '../types';

export function AssessmentPage() {
  const { state, dispatch, navigate } = useApp();

  const activeTask = state.tasks.find((t) => t.id === state.activeTaskId) ?? state.tasks[0];
  const taskObservers = useMemo(
    () => state.observers.filter((o) => o.taskId === activeTask?.id),
    [state.observers, activeTask]
  );

  const currentObserverId = state.activeAssessment?.observerId;
  const currentObserver: Observer | undefined =
    taskObservers.find((o) => o.id === currentObserverId) ?? taskObservers[0];

  useEffect(() => {
    if (activeTask && currentObserver && state.activeAssessment?.taskId !== activeTask.id) {
      dispatch({ type: 'SET_ACTIVE_ASSESSMENT', taskId: activeTask.id, observerId: currentObserver.id });
    }
  }, [activeTask, currentObserver, state.activeAssessment, dispatch]);

  if (!activeTask || taskObservers.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader />
        <Card className="p-8 text-center">
          <ShieldAlert className="mx-auto text-amber-500 mb-3" size={28} />
          <div className="font-bold text-navy mb-1">Not enough observable evidence yet.</div>
          <p className="text-sm text-slate-500 mb-4">Add at least one observer before starting the assessment.</p>
          <Button onClick={() => navigate('observers')}>Go to Observers</Button>
        </Card>
      </div>
    );
  }

  const answeredCount = currentObserver ? Object.values(currentObserver.answers).filter((v) => v !== null).length : 0;
  const isSelf = currentObserver?.role === 'self';

  const dimAnswered = (dim: 'K' | 'T' | 'M' | 'C') =>
    currentObserver
      ? QUESTIONS.filter((q) => q.dim === dim).filter((q) => currentObserver.answers[q.key] !== null).length
      : 0;

  const observerLabel = (o: Observer) => {
    if (o.role === 'direct-manager') return o.name || 'Direct Manager';
    if (o.role === 'self') return 'Self-assessment';
    return o.name || 'Other manager';
  };

  return (
    <div className="space-y-6">
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

      <Card className="p-5 lg:p-6 bg-navy text-white overflow-hidden relative">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
        <div className="relative flex flex-wrap items-center gap-x-8 gap-y-3">
          <div>
            <div className="text-[11px] text-indigo-200 font-medium">Assessing</div>
            <div className="font-bold">{state.employee.name || 'Employee'}</div>
          </div>
          <div>
            <div className="text-[11px] text-indigo-200 font-medium">Task</div>
            <div className="font-bold">{activeTask.name}</div>
          </div>
          <div>
            <div className="text-[11px] text-indigo-200 font-medium">Observer</div>
            <div className="font-bold">{currentObserver ? observerLabel(currentObserver) : '—'}</div>
          </div>
          <div className="ml-auto">
            <div className="text-[11px] text-indigo-200 font-medium">Progress</div>
            <div className="font-bold">Question {answeredCount} of 12</div>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        {taskObservers.map((o) => (
          <button
            key={o.id}
            onClick={() => dispatch({ type: 'SET_ACTIVE_ASSESSMENT', taskId: activeTask.id, observerId: o.id })}
            className={cn(
              'rounded-full px-4 py-1.5 text-xs font-semibold border transition-colors',
              o.id === currentObserver?.id ? 'bg-indigo-50 text-primary border-primary' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            )}
          >
            {observerLabel(o)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <DimensionMiniCard dim="K" answered={dimAnswered('K')} />
        <DimensionMiniCard dim="T" answered={dimAnswered('T')} />
        <DimensionMiniCard dim="M" answered={dimAnswered('M')} />
        <DimensionMiniCard dim="C" answered={dimAnswered('C')} />
      </div>

      {currentObserver && (
        <div className="space-y-6">
          {DIMENSION_SECTIONS.map((section) => (
            <Card key={section.dim} className="p-6 lg:p-7">
              <div className="flex items-center gap-2 mb-5">
                <Badge variant={section.dim === 'K' || section.dim === 'T' ? 'primary' : 's2'}>{section.dim}</Badge>
                <h3 className="text-sm font-bold tracking-wider text-navy">{section.title}</h3>
              </div>
              <div className="space-y-6">
                {QUESTIONS.filter((q) => q.dim === section.dim).map((q, i) => (
                  <motion.div
                    key={q.key}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <p className="text-sm font-semibold text-navy mb-3">
                      {q.key}. {isSelf ? q.first : q.third}
                    </p>
                    <RatingScale
                      value={currentObserver.answers[q.key]}
                      onChange={(v) =>
                        dispatch({ type: 'SET_ANSWER', observerId: currentObserver.id, key: q.key, value: v })
                      }
                    />
                  </motion.div>
                ))}
              </div>
            </Card>
          ))}

          <Card className="p-6 lg:p-7">
            <div className="flex items-center gap-2 mb-3">
              <FileEdit size={16} className="text-primary" />
              <h3 className="text-sm font-bold text-navy">Evidence from a real situation</h3>
            </div>
            <Textarea
              rows={3}
              placeholder="Describe one recent situation that clearly demonstrates this employee's competence or commitment."
              value={currentObserver.evidence}
              onChange={(e) => dispatch({ type: 'SET_EVIDENCE', observerId: currentObserver.id, text: e.target.value })}
            />
          </Card>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button size="lg" onClick={() => navigate('analysis')}>
          See the diagnosis <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-extrabold text-navy tracking-tight">Behavioral assessment</h1>
      <p className="text-sm text-slate-500 mt-1.5">Rate observed behaviors for this task — competence and commitment, from real evidence.</p>
    </div>
  );
}
