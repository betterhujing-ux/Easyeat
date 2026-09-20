export type MealType = string;

export type FoodSource = 'official' | 'custom';

export interface Food {
  id: string;                  // crypto.randomUUID()
  name: string;
  source: FoodSource;
  defaultGrams: number;        // 每份克重，> 0
  nutrition: {
    calories: number;          // kcal
    protein: number;           // g
    carbs: number;             // g
    fat: number;               // g
  };
  steps: string[];             // 烹饪步骤，可为空数组
  createdAt: number;
}

export interface LogEntry {
  id: string;
  foodId: string;
  foodName: string;            // 快照，防食物被删后历史失真
  grams: number;
  nutrition: Food['nutrition'];// 快照 = 单份值 × grams/defaultGrams
  mealType: MealType;
  date: string;                // YYYY-MM-DD
}

export interface DailyTargets {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}
