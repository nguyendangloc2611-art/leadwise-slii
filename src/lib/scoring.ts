import type {
  DevelopmentLevel,
  DimensionResult,
  Frequency,
  Level,
  Observer,
  ObserverScore,
  QuestionAnswers,
  Recency,
  StyleId,
  Task,
  TaskDiagnosis,
} from '../types';

export const FREQUENCY_WEIGHT: Record<Frequency, number> = {
  daily: 1.0,
  weekly: 0.8,
  monthly: 0.5,
  rarely: 0.3,
};

export const RECENCY_WEIGHT: Record<Recency, number> = {
  'within-2-weeks': 1.0,
  '2-weeks-1-month': 0.8,
  'more-than-1-month': 0.5,
};

export function observerWeight(frequency: Frequency | null, recency: Recency | null): number {
  if (!frequency || !recency) return 0;
  return Number((FREQUENCY_WEIGHT[frequency] * RECENCY_WEIGHT[recency]).toFixed(2));
}

export function classify(value: number): Level {
  if (value < 2.5) return 'low';
  if (value < 3.5) return 'moderate';
  return 'high';
}

function dimension(answers: QuestionAnswers, keys: (keyof QuestionAnswers)[]): DimensionResult {
  const values = keys.map((k) => answers[k]).filter((v): v is 1 | 2 | 3 | 4 | 5 => v !== null);
  if (values.length < 2) {
    return { value: null, level: 'insufficient', answeredCount: values.length };
  }
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return { value: Number(avg.toFixed(2)), level: classify(avg), answeredCount: values.length };
}

export function computeObserverScore(observer: Observer): ObserverScore {
  const K = dimension(observer.answers, ['K1', 'K2', 'K3']);
  const T = dimension(observer.answers, ['T1', 'T2', 'T3']);
  const M = dimension(observer.answers, ['M1', 'M2', 'M3']);
  const C = dimension(observer.answers, ['C1', 'C2', 'C3']);

  const competence = K.value !== null && T.value !== null ? Number(((K.value + T.value) / 2).toFixed(2)) : null;
  const commitment = M.value !== null && C.value !== null ? Number(((M.value + C.value) / 2).toFixed(2)) : null;

  return {
    observerId: observer.id,
    observerName: observer.name || (observer.role === 'self' ? 'Self-assessment' : 'Observer'),
    role: observer.role,
    weight: observerWeight(observer.frequency, observer.recency),
    K,
    T,
    M,
    C,
    competence,
    commitment,
    competenceLevel: competence === null ? 'insufficient' : classify(competence),
    commitmentLevel: commitment === null ? 'insufficient' : classify(commitment),
  };
}

export function combineManagerScores(scores: ObserverScore[]): ObserverScore | null {
  const usable = scores.filter((s) => s.competence !== null && s.commitment !== null && s.weight > 0);
  if (usable.length === 0) return null;

  const totalWeight = usable.reduce((sum, s) => sum + s.weight, 0);
  if (totalWeight === 0) return null;

  const weightedAvg = (pick: (s: ObserverScore) => number | null) =>
    usable.reduce((sum, s) => sum + (pick(s) ?? 0) * s.weight, 0) / totalWeight;

  const combineDim = (pick: (s: ObserverScore) => DimensionResult): DimensionResult => {
    const usableDim = usable.filter((s) => pick(s).value !== null);
    if (usableDim.length === 0) return { value: null, level: 'insufficient', answeredCount: 0 };
    const w = usableDim.reduce((sum, s) => sum + s.weight, 0);
    const avg = usableDim.reduce((sum, s) => sum + (pick(s).value ?? 0) * s.weight, 0) / w;
    return { value: Number(avg.toFixed(2)), level: classify(avg), answeredCount: usableDim.reduce((s, o) => s + pick(o).answeredCount, 0) };
  };

  const competence = Number(weightedAvg((s) => s.competence).toFixed(2));
  const commitment = Number(weightedAvg((s) => s.commitment).toFixed(2));

  return {
    observerId: 'combined',
    observerName: 'Combined Result',
    role: 'direct-manager',
    weight: 1,
    K: combineDim((s) => s.K),
    T: combineDim((s) => s.T),
    M: combineDim((s) => s.M),
    C: combineDim((s) => s.C),
    competence,
    commitment,
    competenceLevel: classify(competence),
    commitmentLevel: classify(commitment),
  };
}

const DEV_MATRIX: Record<Level, Record<Level, { dev: DevelopmentLevel; warning: boolean }>> = {
  low: {
    low: { dev: 'D2', warning: true },
    moderate: { dev: 'D2', warning: false },
    high: { dev: 'D1', warning: false },
    insufficient: { dev: 'D2', warning: false },
  },
  moderate: {
    low: { dev: 'D2', warning: false },
    moderate: { dev: 'D3', warning: false },
    high: { dev: 'D3', warning: false },
    insufficient: { dev: 'D3', warning: false },
  },
  high: {
    low: { dev: 'D3', warning: false },
    moderate: { dev: 'D3', warning: false },
    high: { dev: 'D4', warning: false },
    insufficient: { dev: 'D3', warning: false },
  },
  insufficient: {
    low: { dev: 'D2', warning: false },
    moderate: { dev: 'D3', warning: false },
    high: { dev: 'D3', warning: false },
    insufficient: { dev: 'D2', warning: false },
  },
};

export const STYLE_FOR_LEVEL: Record<DevelopmentLevel, StyleId> = {
  D1: 'S1',
  D2: 'S2',
  D3: 'S3',
  D4: 'S4',
};

export function developmentLevel(competenceLevel: Level, commitmentLevel: Level) {
  return DEV_MATRIX[competenceLevel][commitmentLevel];
}

export function borderlineFlags(value: number | null): { axis: 'boundary'; boundary: number }[] {
  if (value === null) return [];
  const flags: { axis: 'boundary'; boundary: number }[] = [];
  if (Math.abs(value - 2.5) <= 0.25) flags.push({ axis: 'boundary', boundary: 2.5 });
  if (Math.abs(value - 3.5) <= 0.25) flags.push({ axis: 'boundary', boundary: 3.5 });
  return flags;
}

export function diagnoseTask(task: Task, observers: Observer[]): TaskDiagnosis {
  const taskObservers = observers.filter((o) => o.taskId === task.id);
  const managers = taskObservers.filter((o) => o.role === 'direct-manager' || o.role === 'other-manager');
  const selfObserver = taskObservers.find((o) => o.role === 'self') ?? null;

  const managerScores = managers.map(computeObserverScore);
  const selfScore = selfObserver ? computeObserverScore(selfObserver) : null;
  const combined = combineManagerScores(managerScores);

  const insights: string[] = [];
  const crossChecks: string[] = [];
  let d2Warning = false;
  let developmentLevelResult: DevelopmentLevel | null = null;
  let style: StyleId | null = null;
  const borderline: { axis: 'competence' | 'commitment'; boundary: number }[] = [];
  let insufficientData = !combined;

  if (combined && combined.competence !== null && combined.commitment !== null) {
    const result = developmentLevel(combined.competenceLevel, combined.commitmentLevel);
    developmentLevelResult = result.dev;
    d2Warning = result.warning;
    style = STYLE_FOR_LEVEL[result.dev];

    borderlineFlags(combined.competence).forEach((f) => borderline.push({ axis: 'competence', boundary: f.boundary }));
    borderlineFlags(combined.commitment).forEach((f) => borderline.push({ axis: 'commitment', boundary: f.boundary }));

    if (managerScores.length >= 2) {
      const competences = managerScores.filter((s) => s.competence !== null).map((s) => s.competence as number);
      const commitments = managerScores.filter((s) => s.commitment !== null).map((s) => s.commitment as number);
      const compSpread = competences.length ? Math.max(...competences) - Math.min(...competences) : 0;
      const commitSpread = commitments.length ? Math.max(...commitments) - Math.min(...commitments) : 0;
      if (compSpread > 1.0 || commitSpread > 1.0) {
        insights.push(
          'Different observers see this employee differently. Recommend discussing evidence before finalizing the leadership approach.'
        );
      }
    }

    if (selfScore && selfScore.competence !== null && combined.competence !== null) {
      if (selfScore.competence - combined.competence > 1.0) {
        insights.push(
          'Perception gap detected. The employee may not recognize a skill gap, or the manager may not have visibility into all of their work.'
        );
      }
    }

    if (selfScore && selfScore.C.value !== null && combined.C.value !== null) {
      if (combined.C.value - selfScore.C.value > 1.0) {
        insights.push('Hidden D3 signal: they may be capable but less confident than their manager realizes.');
      }
    }

    if (
      combined.competenceLevel === 'high' &&
      combined.M.level === 'low' &&
      (combined.C.level === 'moderate' || combined.C.level === 'high')
    ) {
      insights.push('Motivation, not capability, may be the issue.');
    }

    if (task.familiarity === 'new' && (result.dev === 'D3' || result.dev === 'D4')) {
      crossChecks.push(
        'Cross-check recommended. This task is new, but the assessment indicates high competence. Check whether observers evaluated general ability rather than competence for this specific task.'
      );
    }

    if (task.familiarity === 'regular' && result.dev === 'D1') {
      crossChecks.push(
        'Cross-check recommended. This task is performed regularly, but the assessment indicates low competence and high commitment. Confirm observers are evaluating current performance, not initial ramp-up.'
      );
    }
  }

  return {
    taskId: task.id,
    combined,
    selfScore,
    managerScores,
    developmentLevel: developmentLevelResult,
    style,
    d2Warning,
    borderline,
    insights,
    crossChecks,
    insufficientData,
  };
}

export const LEVEL_LABEL: Record<Level, string> = {
  low: 'LOW',
  moderate: 'MODERATE',
  high: 'HIGH',
  insufficient: 'Insufficient data',
};

export const DEV_LEVEL_META: Record<DevelopmentLevel, { title: string; description: string }> = {
  D1: { title: 'Enthusiastic Beginner', description: 'Low competence, high commitment for this task.' },
  D2: { title: 'Disillusioned Learner', description: 'Some competence gained, but commitment has dipped.' },
  D3: { title: 'Capable but Cautious Performer', description: 'Solid competence, variable confidence or motivation.' },
  D4: { title: 'Self-Reliant Achiever', description: 'High competence and high commitment for this task.' },
};

export const STYLE_META: Record<
  StyleId,
  { title: string; short: string; direction: 'high' | 'low'; support: 'high' | 'low'; tagline: string; color: string }
> = {
  S1: { title: 'DIRECTING', short: 'S1', direction: 'high', support: 'low', tagline: '"Tell me how."', color: 's1' },
  S2: { title: 'COACHING', short: 'S2', direction: 'high', support: 'high', tagline: '"Show me why."', color: 's2' },
  S3: { title: 'SUPPORTING', short: 'S3', direction: 'low', support: 'high', tagline: '"Let me try."', color: 's3' },
  S4: { title: 'DELEGATING', short: 'S4', direction: 'low', support: 'low', tagline: '"I\'ve got this."', color: 's4' },
};
