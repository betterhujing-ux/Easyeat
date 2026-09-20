import { Food, LogEntry, DailyTargets, MealType } from '../types';
import { OFFICIAL_FOODS } from '../data/officialFoods';

const STORAGE_KEYS = {
  CUSTOM_FOODS: 'custom_foods_v2',
  LEGACY_CUSTOM_RECIPES: 'custom_recipes',
  LOG_PREFIX: 'diet_logs_',
  TARGETS: 'daily_nutrition_targets',
};

export const DEFAULT_TARGETS: DailyTargets = {
  calories: 1800,
  protein: 120,
  fat: 50,
  carbs: 200,
};

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'f-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
}

// 获取用户自建食物 (含旧版自定义食谱迁移)
export function getCustomFoods(): Food[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_FOODS);
    if (raw) {
      return JSON.parse(raw);
    }

    // 检查并迁移旧版自建食谱
    const legacyRaw = localStorage.getItem(STORAGE_KEYS.LEGACY_CUSTOM_RECIPES);
    if (legacyRaw) {
      const legacyRecipes: Array<{
        id: string;
        title: string;
        steps?: string[];
        totalCal?: number;
        totalProtein?: number;
        totalFat?: number;
        totalCarbs?: number;
        createdAt?: string;
      }> = JSON.parse(legacyRaw);

      if (Array.isArray(legacyRecipes) && legacyRecipes.length > 0) {
        const migrated: Food[] = legacyRecipes.map(r => ({
          id: r.id || generateUUID(),
          name: r.title || '私房菜肴',
          source: 'custom',
          defaultGrams: 100,
          nutrition: {
            calories: Number(r.totalCal) || 0,
            protein: Number(r.totalProtein) || 0,
            carbs: Number(r.totalCarbs) || 0,
            fat: Number(r.totalFat) || 0,
          },
          steps: Array.isArray(r.steps) ? r.steps.filter(Boolean) : [],
          createdAt: r.createdAt ? new Date(r.createdAt).getTime() || Date.now() : Date.now(),
        }));
        localStorage.setItem(STORAGE_KEYS.CUSTOM_FOODS, JSON.stringify(migrated));
        return migrated;
      }
    }
    return [];
  } catch {
    return [];
  }
}

export function saveCustomFood(food: Food): Food[] {
  const existing = getCustomFoods();
  const index = existing.findIndex(f => f.id === food.id);
  let updated: Food[];
  if (index >= 0) {
    updated = [...existing];
    updated[index] = food;
  } else {
    updated = [food, ...existing];
  }
  localStorage.setItem(STORAGE_KEYS.CUSTOM_FOODS, JSON.stringify(updated));
  return updated;
}

export function deleteCustomFood(id: string): Food[] {
  const existing = getCustomFoods();
  const updated = existing.filter(f => f.id !== id);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_FOODS, JSON.stringify(updated));
  return updated;
}

export function getAllFoods(): Food[] {
  const custom = getCustomFoods();
  return [...custom, ...OFFICIAL_FOODS];
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 获取某一天的记录 (含兼容旧版 LoggedItem 结构)
export function getDailyLogs(dateStr: string): LogEntry[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.LOG_PREFIX}${dateStr}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item: any) => {
      // 已经是 schema v2 LogEntry
      if (item.foodId && item.foodName && item.nutrition) {
        return {
          id: item.id || generateUUID(),
          foodId: item.foodId,
          foodName: item.foodName,
          grams: Number(item.grams) || 100,
          nutrition: {
            calories: Number(item.nutrition?.calories) || 0,
            protein: Number(item.nutrition?.protein) || 0,
            carbs: Number(item.nutrition?.carbs) || 0,
            fat: Number(item.nutrition?.fat) || 0,
          },
          mealType: (item.mealType as MealType) || 'lunch',
          date: item.date || dateStr,
        };
      }

      // 旧版 LoggedItem 自动兼容迁移
      const grams = Number(item.amount) || Number(item.grams) || 100;
      return {
        id: item.id || generateUUID(),
        foodId: item.foodId || generateUUID(),
        foodName: item.name || item.foodName || '食物',
        grams,
        nutrition: {
          calories: Number(item.cal ?? item.nutrition?.calories) || 0,
          protein: Number(item.protein ?? item.nutrition?.protein) || 0,
          carbs: Number(item.carbs ?? item.nutrition?.carbs) || 0,
          fat: Number(item.fat ?? item.nutrition?.fat) || 0,
        },
        mealType: (item.mealType as MealType) || 'lunch',
        date: item.date || dateStr,
      };
    });
  } catch {
    return [];
  }
}

export function saveDailyLogs(dateStr: string, logs: LogEntry[]): void {
  localStorage.setItem(`${STORAGE_KEYS.LOG_PREFIX}${dateStr}`, JSON.stringify(logs));
}

export function addLogEntry(dateStr: string, entry: LogEntry): LogEntry[] {
  const current = getDailyLogs(dateStr);
  const updated = [...current, entry];
  saveDailyLogs(dateStr, updated);
  return updated;
}

export function removeLogEntry(dateStr: string, entryId: string): LogEntry[] {
  const current = getDailyLogs(dateStr);
  const updated = current.filter(i => i.id !== entryId);
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
