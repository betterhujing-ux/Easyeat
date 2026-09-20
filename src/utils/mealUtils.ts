export function getMealName(mealType: string): string {
  if (!mealType) return '第 1 餐';
  if (mealType === 'breakfast' || mealType === 'meal_1') return '第 1 餐';
  if (mealType === 'lunch' || mealType === 'meal_2') return '第 2 餐';
  if (mealType === 'dinner' || mealType === 'meal_3') return '第 3 餐';
  if (mealType === 'snack' || mealType === 'meal_4') return '第 4 餐';
  const match = mealType.match(/^meal_(\d+)$/);
  if (match) {
    return `第 ${match[1]} 餐`;
  }
  return mealType;
}

export function matchesMeal(itemMealType: string, targetMealType: string): boolean {
  if (itemMealType === targetMealType) return true;
  if (targetMealType === 'meal_1' && itemMealType === 'breakfast') return true;
  if (targetMealType === 'meal_2' && itemMealType === 'lunch') return true;
  if (targetMealType === 'meal_3' && itemMealType === 'dinner') return true;
  if (targetMealType === 'meal_4' && itemMealType === 'snack') return true;
  return false;
}
