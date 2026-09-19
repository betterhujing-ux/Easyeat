export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  cal: number;       // kcal per 100g
  protein: number;   // g per 100g
  fat: number;       // g per 100g
  carbs: number;     // g per 100g
  servingDesc?: string; // e.g. "中等个约 50g"
}

export interface LoggedItem {
  id: string;
  foodId: string;
  name: string;
  amount: number;    // in grams
  cal: number;
  protein: number;
  fat: number;
  carbs: number;
  mealType: MealType;
  loggedAt: string;  // ISO string
}

export interface Ingredient {
  name: string;
  amount: number;    // grams or count
  unit: string;      // g, ml, 个, 勺, etc.
  cal?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
}

export interface Recipe {
  id: string;
  title: string;
  summary: string;
  category: string;
  prepMinutes: number;
  difficulty: '简单' | '适中' | '进阶';
  servings: number;
  ingredients: Ingredient[];
  steps: string[];
  tips?: string;
  isCustom?: boolean;
  createdAt: string;
  totalCal: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
}

export interface DailyTargets {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}
