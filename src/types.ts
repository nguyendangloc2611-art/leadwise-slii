export type PageId =
  | 'overview'
  | 'employee-tasks'
  | 'observers'
  | 'assessment'
  | 'analysis'
  | 'action-plan'
  | 'summary';

export type Familiarity = 'new' | 'occasional' | 'regular';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  name: string;
  outcome: string;
  measurement: string;
  deadline: string;
  familiarity: Familiarity | null;
  risk: RiskLevel | null;
}

export type Frequency = 'daily' | 'weekly' | 'monthly' | 'rarely';
export type Recency = 'within-2-weeks' | '2-weeks-1-month' | 'more-than-1-month';
export type ObserverRole = 'direct-manager' | 'other-manager' | 'self';

export type RatingValue = 1 | 2 | 3 | 4 | 5 | null;

export interface QuestionAnswers {
  K1: RatingValue;
  K2: RatingValue;
  K3: RatingValue;
  T1: RatingValue;
  T2: RatingValue;
  T3: RatingValue;
  M1: RatingValue;
  M2: RatingValue;
  M3: RatingValue;
  C1: RatingValue;
  C2: RatingValue;
  C3: RatingValue;
}

export const BLANK_ANSWERS: QuestionAnswers = {
  K1: null, K2: null, K3: null,
  T1: null, T2: null, T3: null,
  M1: null, M2: null, M3: null,
  C1: null, C2: null, C3: null,
};

export interface Observer {
  id: string;
  taskId: string;
  role: ObserverRole;
  name: string;
  title: string;
  frequency: Frequency | null;
  recency: Recency | null;
  answers: QuestionAnswers;
  evidence: string;
}

export interface Employee {
  name: string;
  position: string;
  department: string;
  tenure: string;
}

export interface ActiveAssessmentPointer {
  taskId: string;
  observerId: string;
  questionIndex: number;
}

export interface AppState {
  hasStarted: boolean;
  employee: Employee;
  tasks: Task[];
  activeTaskId: string | null;
  observers: Observer[];
  activeAssessment: ActiveAssessmentPointer | null;
  reassessDates: Record<string, string>;
  actionPlanChecks: Record<string, boolean>;
  activePage: PageId;
}

export type DimensionKey = 'K' | 'T' | 'M' | 'C';

export type Level = 'low' | 'moderate' | 'high' | 'insufficient';

export interface DimensionResult {
  value: number | null;
  level: Level;
  answeredCount: number;
}

export interface ObserverScore {
  observerId: string;
  observerName: string;
  role: ObserverRole;
  weight: number;
  K: DimensionResult;
  T: DimensionResult;
  M: DimensionResult;
  C: DimensionResult;
  competence: number | null;
  commitment: number | null;
  competenceLevel: Level;
  commitmentLevel: Level;
}

export type DevelopmentLevel = 'D1' | 'D2' | 'D3' | 'D4';
export type StyleId = 'S1' | 'S2' | 'S3' | 'S4';

export interface TaskDiagnosis {
  taskId: string;
  combined: ObserverScore | null;
  selfScore: ObserverScore | null;
  managerScores: ObserverScore[];
  developmentLevel: DevelopmentLevel | null;
  style: StyleId | null;
  d2Warning: boolean;
  borderline: { axis: 'competence' | 'commitment'; boundary: number }[];
  insights: string[];
  crossChecks: string[];
  insufficientData: boolean;
}
