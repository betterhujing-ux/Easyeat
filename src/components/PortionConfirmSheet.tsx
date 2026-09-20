import React, { useState, useEffect, useRef } from 'react';
import { Food, LogEntry, MealType } from '../types';
import { ChevronLeft, X, Check } from './icons';
import { generateUUID } from '../utils/storage';

interface PortionConfirmSheetProps {
  isOpen: boolean;
  food: Food | null;
  mealType: MealType;
  dateStr: string;
  onConfirm: (entry: LogEntry) => void;
  onBack: () => void;
  onClose: () => void;
}

const MEAL_NAMES: Record<MealType, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '加餐',
};

export const PortionConfirmSheet: React.FC<PortionConfirmSheetProps> = ({
  isOpen,
  food,
  mealType,
  dateStr,
  onConfirm,
  onBack,
  onClose,
}) => {
  const [grams, setGrams] = useState<number>(100);
  const [showSteps, setShowSteps] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (food) {
      setGrams(food.defaultGrams > 0 ? food.defaultGrams : 100);
      setShowSteps(false);
      setTimeout(() => {
        inputRef.current?.select();
      }, 50);
    }
  }, [food]);

  if (!isOpen || !food) return null;

  const validGrams = Math.max(1, Number(grams) || 1);
  const ratio = validGrams / (food.defaultGrams || 100);

  const calculatedNutrition = {
    calories: Math.round(food.nutrition.calories * ratio),
    protein: parseFloat((food.nutrition.protein * ratio).toFixed(1)),
    carbs: parseFloat((food.nutrition.carbs * ratio).toFixed(1)),
    fat: parseFloat((food.nutrition.fat * ratio).toFixed(1)),
  };

  const quickPillOptions = [
    Math.round(food.defaultGrams * 0.5),
    food.defaultGrams,
    Math.round(food.defaultGrams * 1.5),
    Math.round(food.defaultGrams * 2),
  ].filter((g, idx, arr) => g > 0 && arr.indexOf(g) === idx);

  const handleQuickSelect = (g: number) => {
    setGrams(g);
  };

  const handleStepAdjust = (delta: number) => {
    setGrams(prev => Math.max(10, Math.round((Number(prev) || 100) + delta)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: LogEntry = {
      id: generateUUID(),
      foodId: food.id,
      foodName: food.name,
      grams: validGrams,
      nutrition: calculatedNutrition,
      mealType,
      date: dateStr,
    };
    onConfirm(entry);
  };

  const mealName = MEAL_NAMES[mealType] || '饮食';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="portion-sheet-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-[2px]"
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={sheetRef}
        className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl card-border p-5 space-y-4 max-h-[88vh] flex flex-col overflow-y-auto"
      >
        {/* Header with navigation */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E0E0E0]">
          <button
            type="button"
            onClick={onBack}
            aria-label="返回食物搜索"
            className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-black py-2 px-2 -ml-2 rounded-lg transition-colors min-h-[44px] min-w-[44px]"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" strokeWidth={2.5} />
            <span>返回搜索</span>
          </button>

          <h2 id="portion-sheet-title" className="text-sm font-bold text-neutral-900 truncate px-2">
            记入{mealName}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="关闭份量设置"
            className="text-neutral-400 hover:text-neutral-900 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors -mr-2"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Selected Food Info */}
        <div className="bg-[#FAFAFA] rounded-xl p-3.5 card-border space-y-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-base font-bold text-neutral-950 truncate">{food.name}</h3>
            {food.source === 'custom' && (
              <span className="shrink-0 text-[11px] font-medium bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded">
                自建
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500">
            基准单份（{food.defaultGrams}g）：{food.nutrition.calories} 千卡 · 蛋白 {food.nutrition.protein}g · 碳水 {food.nutrition.carbs}g · 脂肪 {food.nutrition.fat}g
          </p>
        </div>

        {/* Portion Input & Quick Pills */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="portion-grams-input" className="block text-xs font-semibold text-neutral-700">
              实际吃下的克重 (g)
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleStepAdjust(-10)}
                aria-label="减少10克"
                className="w-11 h-11 shrink-0 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-lg flex items-center justify-center transition-colors min-w-[44px] min-h-[44px]"
              >
                -
              </button>

              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  id="portion-grams-input"
                  type="number"
                  min="1"
                  max="5000"
                  step="1"
                  value={grams}
                  onChange={e => setGrams(e.target.value === '' ? ('' as any) : Number(e.target.value))}
                  required
                  className="w-full h-11 text-center font-bold text-lg text-neutral-950 bg-white card-border rounded-lg focus-visible:outline-2 focus-visible:outline-black px-3"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 pointer-events-none">
                  克
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleStepAdjust(10)}
                aria-label="增加10克"
                className="w-11 h-11 shrink-0 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-lg flex items-center justify-center transition-colors min-w-[44px] min-h-[44px]"
              >
                +
              </button>
            </div>

            {/* Quick Pills */}
            <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="快捷克数选择">
              {quickPillOptions.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleQuickSelect(opt)}
                  className={`text-xs font-medium py-1.5 px-3 rounded-full min-h-[36px] transition-colors border ${
                    validGrams === opt
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-neutral-700 border-[#E0E0E0] hover:bg-neutral-100'
                  }`}
                >
                  {opt}g {opt === food.defaultGrams ? '(标准)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Calculated Nutrition */}
          <div className="bg-white card-border rounded-xl p-3.5 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold text-neutral-600">摄入营养快照</span>
              <span className="text-base font-bold text-neutral-950">
                {calculatedNutrition.calories}{' '}
                <span className="text-xs font-normal text-neutral-500">千卡</span>
              </span>
            </div>

            <div className="grid grid-cols-3 divide-x divide-[#E0E0E0] text-center pt-1 border-t border-[#E0E0E0]">
              <div className="px-1">
                <span className="block text-[11px] text-neutral-400">蛋白质</span>
                <span className="block text-sm font-bold text-neutral-900 mt-0.5">
                  {calculatedNutrition.protein}g
                </span>
              </div>
              <div className="px-1">
                <span className="block text-[11px] text-neutral-400">碳水化合物</span>
                <span className="block text-sm font-bold text-neutral-900 mt-0.5">
                  {calculatedNutrition.carbs}g
                </span>
              </div>
              <div className="px-1">
                <span className="block text-[11px] text-neutral-400">脂肪</span>
                <span className="block text-sm font-bold text-neutral-900 mt-0.5">
                  {calculatedNutrition.fat}g
                </span>
              </div>
            </div>
          </div>

          {/* Optional Steps Preview (if food has cooking steps) */}
          {food.steps && food.steps.length > 0 && (
            <div className="border border-[#E0E0E0] rounded-xl p-3 space-y-2 bg-[#FAFAFA]">
              <button
                type="button"
                onClick={() => setShowSteps(!showSteps)}
                className="w-full flex items-center justify-between text-xs font-semibold text-neutral-800 text-left py-1"
                aria-expanded={showSteps}
              >
                <span>查看烹饪做法 ({food.steps.length} 步)</span>
                <span className="text-neutral-400 text-xs">{showSteps ? '收起' : '展开'}</span>
              </button>

              {showSteps && (
                <ol className="space-y-2 pt-2 border-t border-[#E0E0E0] text-xs text-neutral-700 leading-relaxed list-decimal list-inside">
                  {food.steps.map((st, i) => (
                    <li key={i} className="pl-1">
                      {st}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 bg-black hover:bg-neutral-800 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-black shadow-none"
            >
              <Check className="w-4 h-4" aria-hidden="true" strokeWidth={2.5} />
              <span>记入{mealName}（{validGrams}g）</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
