import type { AppState, Observer, QuestionAnswers, Task } from '../types';
import { BLANK_ANSWERS } from '../types';
import { uid } from './utils';

function answers(partial: Partial<QuestionAnswers>): QuestionAnswers {
  return { ...BLANK_ANSWERS, ...partial };
}

export function buildDemoState(): AppState {
  const taskCampaign: Task = {
    id: uid('task'),
    name: 'Campaign Planning',
    outcome: 'A launch-ready Q4 campaign plan with channel mix, budget, and timeline.',
    measurement: 'Plan approved by department head with no more than one revision round.',
    deadline: '2026-10-15',
    familiarity: 'occasional',
    risk: 'medium',
  };

  const taskReporting: Task = {
    id: uid('task'),
    name: 'Client Reporting',
    outcome: 'Monthly client performance report with clear insights and recommendations.',
    measurement: 'Report delivered on time with no factual corrections requested by the client.',
    deadline: '2026-11-05',
    familiarity: 'occasional',
    risk: 'medium',
  };

  const taskAnalysis: Task = {
    id: uid('task'),
    name: 'Data Analysis',
    outcome: 'Weekly performance dashboard highlighting trends and anomalies.',
    measurement: 'Dashboard used directly by leadership without manual rework.',
    deadline: '2026-11-20',
    familiarity: 'regular',
    risk: 'low',
  };

  const tasks = [taskCampaign, taskReporting, taskAnalysis];

  const observers: Observer[] = [
    // Campaign Planning -> D2 (Coaching), with warning + borderline example
    {
      id: uid('obs'),
      taskId: taskCampaign.id,
      role: 'direct-manager',
      name: 'David Tran',
      title: 'Marketing Manager',
      frequency: 'daily',
      recency: 'within-2-weeks',
      answers: answers({
        K1: 2, K2: 3, K3: 2,
        T1: 3, T2: 2, T3: 2,
        M1: 2, M2: 2, M3: 2,
        C1: 2, C2: 3, C3: 2,
      }),
      evidence:
        'Linh needed step-by-step guidance to structure the channel budget and missed the first internal deadline before asking for help.',
    },

    // Client Reporting -> D3 (Supporting), rich multi-observer example
    {
      id: uid('obs'),
      taskId: taskReporting.id,
      role: 'direct-manager',
      name: 'David Tran',
      title: 'Marketing Manager',
      frequency: 'weekly',
      recency: 'within-2-weeks',
      answers: answers({
        K1: 4, K2: 4, K3: 4,
        T1: 4, T2: 3, T3: 4,
        M1: 3, M2: 3, M3: 3,
        C1: 3, C2: 3, C3: 4,
      }),
      evidence:
        'Delivered the last two client reports with minimal edits and proactively flagged a data anomaly before it reached the client.',
    },
    {
      id: uid('obs'),
      taskId: taskReporting.id,
      role: 'other-manager',
      name: 'Priya Nair',
      title: 'Account Director',
      frequency: 'monthly',
      recency: 'within-2-weeks',
      answers: answers({
        K1: 4, K2: 3, K3: 4,
        T1: 3, T2: 3, T3: 4,
        M1: 3, M2: 2, M3: 3,
        C1: 3, C2: 3, C3: 3,
      }),
      evidence: 'Presented findings confidently in the client review call, though relied on the manager for final sign-off.',
    },
    {
      id: uid('obs'),
      taskId: taskReporting.id,
      role: 'self',
      name: 'Nguyen Linh',
      title: 'Marketing Executive',
      frequency: null,
      recency: null,
      answers: answers({
        K1: 4, K2: 4, K3: 3,
        T1: 3, T2: 3, T3: 3,
        M1: 3, M2: 3, M3: 2,
        C1: 2, C2: 1, C3: 2,
      }),
      evidence: 'I still second-guess myself before sending reports out, even when my manager says they look good.',
    },

    // Data Analysis -> D4 (Delegating)
    {
      id: uid('obs'),
      taskId: taskAnalysis.id,
      role: 'direct-manager',
      name: 'David Tran',
      title: 'Marketing Manager',
      frequency: 'daily',
      recency: 'within-2-weeks',
      answers: answers({
        K1: 5, K2: 4, K3: 5,
        T1: 4, T2: 4, T3: 4,
        M1: 4, M2: 5, M3: 4,
        C1: 4, C2: 4, C3: 5,
      }),
      evidence: 'Owns the weekly dashboard end-to-end and has started mentoring a teammate on the underlying queries.',
    },
  ];

  return {
    hasStarted: true,
    employee: {
      name: 'Nguyen Linh',
      position: 'Marketing Executive',
      department: 'Marketing',
      tenure: '2 years in role',
    },
    tasks,
    activeTaskId: taskReporting.id,
    observers,
    activeAssessment: null,
    reassessDates: {
      [taskCampaign.id]: '2026-10-20',
      [taskReporting.id]: '2026-11-15',
      [taskAnalysis.id]: '2026-12-01',
    },
    actionPlanChecks: {},
    activePage: 'overview',
  };
}

export function buildBlankState(): AppState {
  return {
    hasStarted: false,
    employee: { name: '', position: '', department: '', tenure: '' },
    tasks: [],
    activeTaskId: null,
    observers: [],
    activeAssessment: null,
    reassessDates: {},
    actionPlanChecks: {},
    activePage: 'overview',
  };
}
