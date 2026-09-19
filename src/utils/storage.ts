import { LoggedItem, Recipe, DailyTargets } from '../types';
import { PRESET_RECIPES } from '../data/presetRecipes';

const STORAGE_KEYS = {
  CUSTOM_RECIPES: 'custom_recipes',
  LOG_PREFIX: 'diet_logs_',
  TARGETS: 'daily_nutrition_targets',
};

export const DEFAULT_TARGETS: DailyTargets = {
  calories: 1800,
  protein: 120,
  fat: 50,
  carbs: 200,
};

export function getCustomRecipes(): Recipe[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_RECIPES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomRecipe(recipe: Recipe): Recipe[] {
  const existing = getCustomRecipes();
  const index = existing.findIndex(r => r.id === recipe.id);
  let updated: Recipe[];
  if (index >= 0) {
    updated = [...existing];
    updated[index] = recipe;
  } else {
    updated = [recipe, ...existing];
  }
  localStorage.setItem(STORAGE_KEYS.CUSTOM_RECIPES, JSON.stringify(updated));
  return updated;
}

export function deleteCustomRecipe(id: string): Recipe[] {
  const existing = getCustomRecipes();
  const updated = existing.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_RECIPES, JSON.stringify(updated));
  return updated;
}

export function getAllRecipes(): Recipe[] {
  const custom = getCustomRecipes();
  return [...custom, ...PRESET_RECIPES];
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDailyLogs(dateStr: string): LoggedItem[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.LOG_PREFIX}${dateStr}`);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveDailyLogs(dateStr: string, logs: LoggedItem[]): void {
  localStorage.setItem(`${STORAGE_KEYS.LOG_PREFIX}${dateStr}`, JSON.stringify(logs));
}

export function addLogItem(dateStr: string, item: LoggedItem): LoggedItem[] {
  const current = getDailyLogs(dateStr);
  const updated = [...current, item];
  saveDailyLogs(dateStr, updated);
  return updated;
}

export function removeLogItem(dateStr: string, itemId: string): LoggedItem[] {
  const current = getDailyLogs(dateStr);
  const updated = current.filter(i => i.id !== itemId);
  saveDailyLogs(dateStr, updated);
  return updated;
}

export function getDailyTargets(): DailyTargets {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TARGETS);
    if (!raw) return DEFAULT_TARGETS;
    return { ...DEFAULT_TARGETS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_TARGETS;
  }
}

export function saveDailyTargets(targets: DailyTargets): void {
  localStorage.setItem(STORAGE_KEYS.TARGETS, JSON.stringify(targets));
}
