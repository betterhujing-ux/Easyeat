import React, { useState, useEffect, useRef } from 'react';
import { Food, LogEntry, MealType } from '../types';
import { getMealName } from '../utils/mealUtils';
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
    }
  }, [food]);

  if (!isOpen || !food) return null;

  const validGrams = Math.max(1, Number(grams) || 1);
  const ratio = validGrams / (food.defaultGrams || 100);

  // 100g 基准营养数据 (固定展示 100g 含量)
  const ratio100 = 100 / (food.defaultGrams || 100);
  const nutrition100 = {
    calories: Math.round(food.nutrition.calories * ratio100),
    protein: parseFloat((food.nutrition.protein * ratio100).toFixed(1)),
    carbs: parseFloat((food.nutrition.carbs * ratio100).toFixed(1)),
    fat: parseFloat((food.nutrition.fat * ratio100).toFixed(1)),
  };

  // 实际入库营养数据（根据输入的克重等比折算）
  const calculatedNutrition = {
    calories: Math.round(food.nutrition.calories * ratio),
    protein: parseFloat((food.nutrition.protein * ratio).toFixed(1)),
    carbs: parseFloat((food.nutrition.carbs * ratio).toFixed(1)),
    fat: parseFloat((food.nutrition.fat * ratio).toFixed(1)),
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

  const mealName = getMealName(mealType);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="portion-sheet-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-[2px] animate-backdrop-fade"
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={sheetRef}
        className="w-full sm:max-w-md bg-white rounded-t-[16px] sm:rounded-2xl card-border p-5 space-y-4 max-h-[88vh] flex flex-col overflow-y-auto animate-sheet-up"
        onClick={e => e.stopPropagation()}
      >
        {/* 浮窗导航栏 */}
        <div className="flex items-center justify-between pb-1">
          <button
            type="button"
            onClick={onBack}
            aria-label="返回搜索"
            className="inline-flex items-center justify-center text-neutral-600 hover:text-black p-2 -ml-2 rounded-lg transition-colors min-h-[44px] min-w-[44px]"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" strokeWidth={2} />
          </button>

          <h2 id="portion-sheet-title" className="text-sm font-bold text-neutral-900 truncate px-2 leading-none">
            记入{mealName}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="关闭"
            className="text-neutral-400 hover:text-neutral-900 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors -mr-2"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* 1. 食物名称 */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <h3 className="text-lg font-bold text-neutral-950 truncate">{food.name}</h3>
          {food.source === 'custom' && (
            <span className="shrink-0 text-[11px] font-medium bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
              私房
            </span>
          )}
        </div>

        {/* 2. 营养数据 (保留样式，标题从摄入营养快照改为“营养数据”，展示100g含量) */}
        <div className="bg-white card-border rounded-xl p-4 space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold text-neutral-700">营养数据</span>
            <span className="text-sm font-bold text-neutral-950 tabular-nums">
              {nutrition100.calories}{' '}
              <span className="text-xs font-normal text-neutral-500">千卡/100g</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="px-1">
              <span className="block text-[11px] text-neutral-400">蛋白质</span>
              <span className="block text-sm font-bold text-neutral-900 mt-1 tabular-nums">
                {nutrition100.protein}g
              </span>
            </div>
            <div className="px-1">
              <span className="block text-[11px] text-neutral-400">碳水化合物</span>
              <span className="block text-sm font-bold text-neutral-900 mt-1 tabular-nums">
                {nutrition100.carbs}g
              </span>
            </div>
            <div className="px-1">
              <span className="block text-[11px] text-neutral-400">脂肪</span>
              <span className="block text-sm font-bold text-neutral-900 mt-1 tabular-nums">
                {nutrition100.fat}g
              </span>
            </div>
          </div>
        </div>

        {/* 表单容器 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 3. 输入数量 (纯输入框，不需要+-以及快捷选项) */}
          <div className="space-y-2">
            <label htmlFor="portion-grams-input" className="block text-xs font-semibold text-neutral-700">
              输入数量
            </label>

            <div className="relative">
              <input
                ref={inputRef}
                id="portion-grams-input"
                type="number"
                min="1"
                max="5000"
                step="1"
                value={grams}
                onChange={e => setGrams(e.target.value === '' ? ('' as any) : Number(e.target.value))}
                placeholder="请输入克重"
                required
                className="w-full h-11 pl-3.5 pr-14 bg-white card-border rounded-lg text-base text-neutral-950 placeholder:text-neutral-400 focus:border-black focus:outline-none focus:ring-0 transition-colors tabular-nums"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 pointer-events-none">
                克 (g)
              </span>
            </div>
          </div>

          {/* 可选烹饪做法 */}
          {food.steps && food.steps.length > 0 && (
            <div className="card-border rounded-xl p-3 space-y-2 bg-[#FAFAFA]">
              <button
                type="button"
                onClick={() => setShowSteps(!showSteps)}
                className="w-full flex items-center justify-between text-xs font-semibold text-neutral-800 text-left py-1"
                aria-expanded={showSteps}
              >
                <span>查看烹饪做法 <span className="tabular-nums">({food.steps.length} 步)</span></span>
                <span className="text-neutral-400 text-xs">{showSteps ? '收起' : '展开'}</span>
              </button>

              {showSteps && (
                <ol className="space-y-1.5 pt-1 text-xs text-neutral-700 leading-relaxed list-decimal list-inside">
                  {food.steps.map((st, i) => (
                    <li key={i} className="pl-1">
                      {st}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}

          {/* 4. 确认添加 (底部按钮，点击后回到首页，数据添加成功，给一个toast) */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 bg-black hover:bg-neutral-800 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-black shadow-none min-h-[44px]"
            >
              <Check className="w-4 h-4" aria-hidden="true" strokeWidth={2.5} />
              <span>确认添加</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
