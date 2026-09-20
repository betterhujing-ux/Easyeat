/**
 * 营养素计算与转换工具函数
 * 符合《人机界面指南》严谨度与真实饮食换算标准
 */

/**
 * 解析用户输入的数字字符串，空输入/NaN/负数一律按 0 返回，避免任何 NaN 扩散
 */
export function parseNum(val: string | number | undefined | null): number {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') {
    return isNaN(val) || val < 0 ? 0 : val;
  }
  const n = parseFloat(val);
  return isNaN(n) || n < 0 ? 0 : n;
}

/**
 * 核心热量派生计算函数
 * 公式：蛋白质×4 + 碳水×4 + 脂肪×9，四舍五入取整
 * 空输入/NaN/负数一律按 0 参与计算
 */
export function calcCalories(m: { protein: number; carbs: number; fat: number }): number {
  const p = isNaN(m?.protein) || m?.protein < 0 ? 0 : m.protein;
  const c = isNaN(m?.carbs) || m?.carbs < 0 ? 0 : m.carbs;
  const f = isNaN(m?.fat) || m?.fat < 0 ? 0 : m.fat;
  return Math.round(p * 4 + c * 4 + f * 9);
}
