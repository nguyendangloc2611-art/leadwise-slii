import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import type { AppState, Employee, Observer, ObserverRole, PageId, QuestionAnswers, Task } from '../types';
import { BLANK_ANSWERS } from '../types';
import { loadState, saveState, clearState } from '../lib/storage';
import { buildDemoState, buildBlankState } from '../lib/demoData';
import { uid } from '../lib/utils';

type Action =
  | { type: 'SET_PAGE'; page: PageId }
  | { type: 'LOAD_DEMO' }
  | { type: 'RESET' }
  | { type: 'UPDATE_EMPLOYEE'; employee: Partial<Employee> }
  | { type: 'ADD_TASK' }
  | { type: 'UPDATE_TASK'; taskId: string; patch: Partial<Task> }
  | { type: 'REMOVE_TASK'; taskId: string }
  | { type: 'SET_ACTIVE_TASK'; taskId: string }
  | { type: 'ADD_OBSERVER'; taskId: string; role: ObserverRole }
  | { type: 'UPDATE_OBSERVER'; observerId: string; patch: Partial<Observer> }
  | { type: 'REMOVE_OBSERVER'; observerId: string }
  | { type: 'SET_ANSWER'; observerId: string; key: keyof QuestionAnswers; value: QuestionAnswers[keyof QuestionAnswers] }
  | { type: 'SET_EVIDENCE'; observerId: string; text: string }
  | { type: 'SET_ACTIVE_ASSESSMENT'; taskId: string; observerId: string }
  | { type: 'SET_REASSESS_DATE'; taskId: string; date: string }
  | { type: 'TOGGLE_ACTION_ITEM'; key: string };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, activePage: action.page };

    case 'LOAD_DEMO':
      return buildDemoState();

    case 'RESET':
      return buildBlankState();

    case 'UPDATE_EMPLOYEE':
      return { ...state, employee: { ...state.employee, ...action.employee }, hasStarted: true };

    case 'ADD_TASK': {
      if (state.tasks.length >= 3) return state;
      const task: Task = {
        id: uid('task'),
        name: `Task ${state.tasks.length + 1}`,
        outcome: '',
        measurement: '',
        deadline: '',
        familiarity: null,
        risk: null,
      };
      return {
        ...state,
        tasks: [...state.tasks, task],
        activeTaskId: state.activeTaskId ?? task.id,
      };
    }

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.taskId ? { ...t, ...action.patch } : t)),
      };

    case 'REMOVE_TASK': {
      const tasks = state.tasks.filter((t) => t.id !== action.taskId);
      const observers = state.observers.filter((o) => o.taskId !== action.taskId);
      const reassessDates = { ...state.reassessDates };
      delete reassessDates[action.taskId];
      return {
        ...state,
        tasks,
        observers,
        reassessDates,
        activeTaskId: state.activeTaskId === action.taskId ? (tasks[0]?.id ?? null) : state.activeTaskId,
      };
    }

    case 'SET_ACTIVE_TASK':
      return { ...state, activeTaskId: action.taskId };

    case 'ADD_OBSERVER': {
      const existingOfRole = state.observers.filter((o) => o.taskId === action.taskId && o.role === action.role);
      if (action.role === 'other-manager' && existingOfRole.length >= 3) return state;
      if (action.role === 'self' && existingOfRole.length >= 1) return state;
      if (action.role === 'direct-manager' && existingOfRole.length >= 1) return state;
      const observer: Observer = {
        id: uid('obs'),
        taskId: action.taskId,
        role: action.role,
        name: '',
        title: '',
        frequency: null,
        recency: null,
        answers: { ...BLANK_ANSWERS },
        evidence: '',
      };
      return { ...state, observers: [...state.observers, observer] };
    }

    case 'UPDATE_OBSERVER':
      return {
        ...state,
        observers: state.observers.map((o) => (o.id === action.observerId ? { ...o, ...action.patch } : o)),
      };

    case 'REMOVE_OBSERVER':
      return { ...state, observers: state.observers.filter((o) => o.id !== action.observerId) };

    case 'SET_ANSWER':
      return {
        ...state,
        observers: state.observers.map((o) =>
          o.id === action.observerId ? { ...o, answers: { ...o.answers, [action.key]: action.value } } : o
        ),
      };

    case 'SET_EVIDENCE':
      return {
        ...state,
        observers: state.observers.map((o) => (o.id === action.observerId ? { ...o, evidence: action.text } : o)),
      };

    case 'SET_ACTIVE_ASSESSMENT':
      return {
        ...state,
        activeAssessment: { taskId: action.taskId, observerId: action.observerId, questionIndex: 0 },
      };

    case 'SET_REASSESS_DATE':
      return { ...state, reassessDates: { ...state.reassessDates, [action.taskId]: action.date } };

    case 'TOGGLE_ACTION_ITEM':
      return {
        ...state,
        actionPlanChecks: { ...state.actionPlanChecks, [action.key]: !state.actionPlanChecks[action.key] },
      };

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  navigate: (page: PageId) => void;
  loadDemo: () => void;
  resetAll: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      dispatch,
      navigate: (page) => dispatch({ type: 'SET_PAGE', page }),
      loadDemo: () => dispatch({ type: 'LOAD_DEMO' }),
      resetAll: () => {
        clearState();
        dispatch({ type: 'RESET' });
      },
    }),
    [state]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
