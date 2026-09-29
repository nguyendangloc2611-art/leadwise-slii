import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown, ShieldAlert, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge, Button, Card } from '../components/ui';
import { ResultHero } from '../components/ResultHero';
import { DimensionScoreBar } from '../components/DimensionScore';
import { ScatterMatrix, type MatrixPoint } from '../components/ScatterMatrix';
import { InsightCard } from '../components/InsightCard';
import { WarningCard } from '../components/WarningCard';
import { CountUp } from '../components/CountUp';
import { classify, diagnoseTask, LEVEL_LABEL } from '../lib/scoring';
import { cn } from '../lib/utils';
import type { Level } from '../types';

const LEVEL_BADGE: Record<Level, 'danger' | 'warning' | 'success' | 'neutral'> = {
  low: 'danger',
  moderate: 'warning',
  high: 'success',
  insufficient: 'neutral',
};

export function AnalysisPage() {
  const { state, dispatch, navigate } = useApp();
  const [explainOpen, setExplainOpen] = useState(false);

  const activeTask = state.tasks.find((t) => t.id === state.activeTaskId) ?? state.tasks[0];
  const diagnosis = useMemo(
    () => (activeTask ? diagnoseTask(activeTask, state.observers) : null),
    [activeTask, state.observers]
  );

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

  const combined = diagnosis?.combined ?? null;

  const points: MatrixPoint[] = [];
  diagnosis?.managerScores.forEach((m) => {
    if (m.competence !== null && m.commitment !== null) {
      points.push({ id: m.observerId, label: m.observerName, competence: m.competence, commitment: m.commitment, weight: m.weight, kind: 'manager' });
    }
  });
  if (combined && combined.competence !== null && combined.commitment !== null) {
    points.push({ id: 'combined', label: 'Combined Result', competence: combined.competence, commitment: combined.commitment, weight: 1, kind: 'combined' });
  }
  if (diagnosis?.selfScore?.competence !== null && diagnosis?.selfScore?.commitment !== null && diagnosis?.selfScore) {
    points.push({
      id: 'self',
      label: 'Employee Self-Assessment',
      competence: diagnosis.selfScore.competence as number,
      commitment: diagnosis.selfScore.commitment as number,
      weight: 0,
      kind: 'self',
    });
  }

  const borderlineMessages = combined ? buildBorderlineMessages(combined, diagnosis!.developmentLevel) : [];

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

      {!diagnosis || !combined || !diagnosis.developmentLevel || !diagnosis.style ? (
        <Card className="p-10 text-center">
          <ShieldAlert className="mx-auto text-amber-500 mb-3" size={30} />
          <div className="font-bold text-navy text-lg mb-1">Not enough observable evidence yet.</div>
          <p className="text-sm text-slate-500 mb-5 max-w-md mx-auto">
            Collect more observations before assigning a development level. Each dimension needs at least 2 of 3
            questions answered by the Direct Manager.
          </p>
          <Button onClick={() => navigate('assessment')}>Continue the assessment</Button>
        </Card>
      ) : (
        <>
          <ResultHero dev={diagnosis.developmentLevel} style={diagnosis.style} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Competence</span>
                <Badge variant={LEVEL_BADGE[combined.competenceLevel]}>{LEVEL_LABEL[combined.competenceLevel]}</Badge>
              </div>
              <div className="text-4xl font-extrabold text-navy mb-4">
                <CountUp value={combined.competence ?? 0} /> <span className="text-lg text-slate-400 font-bold">/ 5</span>
              </div>
              <div className="space-y-4">
                <DimensionScoreBar dim="K" value={combined.K.value} />
                <DimensionScoreBar dim="T" value={combined.T.value} />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Commitment</span>
                <Badge variant={LEVEL_BADGE[combined.commitmentLevel]}>{LEVEL_LABEL[combined.commitmentLevel]}</Badge>
              </div>
              <div className="text-4xl font-extrabold text-navy mb-4">
                <CountUp value={combined.commitment ?? 0} /> <span className="text-lg text-slate-400 font-bold">/ 5</span>
              </div>
              <div className="space-y-4">
                <DimensionScoreBar dim="M" value={combined.M.value} />
                <DimensionScoreBar dim="C" value={combined.C.value} />
              </div>
            </Card>
          </div>

          {diagnosis.d2Warning && (
            <WarningCard
              title="Low competence and low commitment"
              text="Both competence and commitment are currently low for this task. This combination needs prompt, structured attention — treat it as a coaching priority."
            />
          )}

          {borderlineMessages.map((msg, i) => (
            <WarningCard key={i} title="Borderline result" text={msg} />
          ))}

          {diagnosis.insights.map((text, i) => (
            <InsightCard key={i} text={text} />
          ))}

          {diagnosis.crossChecks.map((text, i) => (
            <WarningCard key={`cc-${i}`} title="Cross-check recommended" text={text} />
          ))}

          <Card className="p-6 lg:p-7">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold text-navy">Competence vs. Commitment</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Hover a point to see the observer, scores, and weight. Zones are illustrative — exact classification uses the calculation below.
            </p>
            <ScatterMatrix points={points} />
          </Card>

          <Card className="p-0 overflow-hidden">
            <button
              onClick={() => setExplainOpen((v) => !v)}
              className="w-full flex items-center justify-between px-6 lg:px-7 py-5 text-left"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles size={17} className="text-primary" />
                <span className="font-bold text-navy">Why did I get this result?</span>
              </div>
              <ChevronDown className={cn('text-slate-400 transition-transform', explainOpen && 'rotate-180')} size={18} />
            </button>
            <AnimatePresence initial={false}>
              {explainOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 lg:px-7 pb-7 pt-1">
                    <ExplainPanel
                      k={combined.K.value}
                      t={combined.T.value}
                      m={combined.M.value}
                      c={combined.C.value}
                      competence={combined.competence}
                      commitment={combined.commitment}
                      dev={diagnosis.developmentLevel}
                      style={diagnosis.style}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          <div className="flex justify-end pt-2">
            <Button size="lg" onClick={() => navigate('action-plan')}>
              What should I do next? <ArrowRight size={18} />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function ExplainPanel({
  k,
  t,
  m,
  c,
  competence,
  commitment,
  dev,
  style,
}: {
  k: number | null;
  t: number | null;
  m: number | null;
  c: number | null;
  competence: number | null;
  commitment: number | null;
  dev: string;
  style: string;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-xl bg-slate-50 p-5 space-y-2 text-sm">
        <Row label="Knowledge" value={k} />
        <div className="text-center text-slate-300">+</div>
        <Row label="Transfer Skills" value={t} />
        <div className="text-center text-slate-300">÷ 2</div>
        <div className="border-t border-slate-200 pt-2 flex items-center justify-between font-bold text-navy">
          <span>Competence</span>
          <span>{competence?.toFixed(2) ?? '—'}</span>
        </div>
      </div>
      <div className="rounded-xl bg-slate-50 p-5 space-y-2 text-sm">
        <Row label="Motivation" value={m} />
        <div className="text-center text-slate-300">+</div>
        <Row label="Confidence" value={c} />
        <div className="text-center text-slate-300">÷ 2</div>
        <div className="border-t border-slate-200 pt-2 flex items-center justify-between font-bold text-navy">
          <span>Commitment</span>
          <span>{commitment?.toFixed(2) ?? '—'}</span>
        </div>
      </div>
      <div className="lg:col-span-2 rounded-xl border border-indigo-100 bg-indigo-50/60 p-5 text-center text-sm">
        <span className="font-bold text-navy">{competence !== null ? LEVEL_LABEL[classify(competence)] : '—'} Competence</span>
        <span className="mx-2 text-slate-400">+</span>
        <span className="font-bold text-navy">{commitment !== null ? LEVEL_LABEL[classify(commitment)] : '—'} Commitment</span>
        <div className="text-slate-300 my-1.5">↓</div>
        <span className="font-extrabold text-primary text-base">{dev}</span>
        <div className="text-slate-300 my-1.5">↓</div>
        <span className="font-extrabold text-navy text-base">{style} — recommended style</span>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-navy">{value !== null ? value.toFixed(2) : 'Insufficient data'}</span>
    </div>
  );
}

function buildBorderlineMessages(
  combined: { competence: number | null; commitment: number | null; competenceLevel: Level; commitmentLevel: Level },
  dev: string | null
): string[] {
  const messages: string[] = [];
  const checkAxis = (value: number | null, boundary: number, axisName: string) => {
    if (value === null) return;
    if (Math.abs(value - boundary) <= 0.25) {
      const lowSide = boundary - 0.3;
      const highSide = boundary + 0.3;
      const levelLow = classify(lowSide);
      const levelHigh = classify(highSide);
      messages.push(
        `${axisName} (${value.toFixed(2)}) is close to the ${LEVEL_LABEL[levelLow]}/${LEVEL_LABEL[levelHigh]} boundary. This employee currently shows characteristics that could shift the development level (currently ${dev}) if new evidence comes in.`
      );
    }
  };
  checkAxis(combined.competence, 2.5, 'Competence');
  checkAxis(combined.competence, 3.5, 'Competence');
  checkAxis(combined.commitment, 2.5, 'Commitment');
  checkAxis(combined.commitment, 3.5, 'Commitment');
  return messages;
}

function PageHeader() {
  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-extrabold text-navy tracking-tight">Your leadership diagnosis</h1>
      <p className="text-sm text-slate-500 mt-1.5">A transparent, evidence-based read on competence and commitment for this task.</p>
    </div>
  );
}
