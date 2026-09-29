import type { AppState } from '../types';
import { buildBlankState } from './demoData';

const STORAGE_KEY = 'leadwise-state-v1';

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildBlankState();
    const parsed = JSON.parse(raw) as AppState;
    return { ...buildBlankState(), ...parsed };
  } catch {
    return buildBlankState();
  }
}

export function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable (private browsing, quota) - fail silently
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
