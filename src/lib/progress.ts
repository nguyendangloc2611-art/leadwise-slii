import type { AppState } from '../types';

export function computeProgress(state: AppState): number {
  let score = 0;

  const emp = state.employee;
  if (emp.name && emp.position && emp.department && emp.tenure) score += 15;
  else if (emp.name) score += 7;

  const validTasks = state.tasks.filter((t) => t.outcome && t.measurement && t.deadline && t.familiarity && t.risk);
  if (state.tasks.length > 0) score += Math.min(15, (validTasks.length / state.tasks.length) * 15);

  const hasDirectManager = state.tasks.every((t) =>
    state.observers.some((o) => o.taskId === t.id && o.role === 'direct-manager' && o.name && o.frequency && o.recency)
  );
  if (state.tasks.length > 0 && hasDirectManager) score += 15;

  const totalQuestions = state.observers.length * 12;
  const answeredQuestions = state.observers.reduce((sum, o) => {
    return sum + Object.values(o.answers).filter((v) => v !== null).length;
  }, 0);
  if (totalQuestions > 0) score += (answeredQuestions / totalQuestions) * 40;

  if (totalQuestions > 0 && answeredQuestions >= totalQuestions * 0.9) score += 15;

  return Math.round(Math.min(100, score));
}
