import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Food, MealType } from '../types';
import { Search, X, Plus, Edit2 } from './icons';

interface FoodSearchSheetProps {
  isOpen: boolean;
  mealType: MealType;
  dateStr: string;
  foods: Food[];
  onSelectFood: (food: Food) => void;
  onCreateCustom: (prefillName?: string) => void;
  onEditCustom?: (food: Food) => void;
  onClose: () => void;
}

const MEAL_NAMES: Record<MealType, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '加餐',
};

export const FoodSearchSheet: React.FC<FoodSearchSheetProps> = ({
  isOpen,
  mealType,
  foods,
  onSelectFood,
  onCreateCustom,
  onEditCustom,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'custom'>('all');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setFilterType('all');
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const customFoodsCount = useMemo(() => {
    return foods.filter(f => f.source === 'custom').length;
  }, [foods]);

  const filteredFoods = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = foods;
    if (filterType === 'custom') {
      list = list.filter(f => f.source === 'custom');
    }
    if (!q) {
      return list;
    }
    return list.filter(f => f.name.toLowerCase().includes(q));
  }, [foods, query, filterType]);

  if (!isOpen) return null;

  const mealName = MEAL_NAMES[mealType] || '饮食';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-sheet-title"
      className="fixed inset-0 z-40 bg-[#FAFAFA] flex flex-col max-w-xl mx-auto overflow-hidden"
    >
      {/* Header */}
      <header className="bg-white border-b border-[#E0E0E0] px-4 py-3 flex items-center justify-between shrink-0">
        <div>
          <h1 id="search-sheet-title" className="text-sm font-bold text-neutral-900">
            记入{mealName}
          </h1>
          <p className="text-[11px] text-neutral-400">选择或搜索食物以记录份量</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="关闭搜索页面"
          className="text-neutral-500 hover:text-black min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors -mr-2"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </header>

      {/* Search Input & Action Row */}
      <div className="p-4 bg-white border-b border-[#E0E0E0] space-y-3 shrink-0">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>

          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜索食物、菜肴名（如：鸡胸肉、燕麦、自建菜）..."
            className="w-full h-11 pl-10 pr-10 bg-[#FAFAFA] card-border rounded-full text-xs text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-black"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                searchInputRef.current?.focus();
              }}
              aria-label="清空搜索框"
              className="absolute right-2 text-neutral-400 hover:text-neutral-800 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Filter Pills & Create Food Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5" role="group" aria-label="数据来源过滤">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors min-h-[36px] ${
                filterType === 'all'
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:text-black'
              }`}
            >
              全部 ({foods.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('custom')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors min-h-[36px] ${
                filterType === 'custom'
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:text-black'
              }`}
            >
              我的私房 ({customFoodsCount})
            </button>
          </div>

          <button
            type="button"
            onClick={() => onCreateCustom(query.trim())}
            aria-label="新建自定义食物或菜肴"
            className="inline-flex items-center gap-1 text-xs font-bold text-neutral-900 hover:text-black bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-full transition-colors min-h-[36px]"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" strokeWidth={2.5} />
            <span>自建食物</span>
          </button>
        </div>
      </div>

      {/* Food Results List */}
      <main className="flex-1 overflow-y-auto p-4 space-y-2" role="region" aria-label="食物候选列表">
        {filteredFoods.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
              <Search className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-neutral-800">
                {query ? `未找到与「${query}」匹配的食物` : '暂无对应食物'}
              </p>
              <p className="text-xs text-neutral-400">
                如果是自己烹饪的菜肴或市售食品，可直接自建收录
              </p>
            </div>

            <button
              type="button"
              onClick={() => onCreateCustom(query.trim())}
              className="inline-flex items-center gap-1.5 bg-black hover:bg-neutral-800 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors min-h-[44px]"
            >
              <Plus className="w-4 h-4" aria-hidden="true" strokeWidth={2.5} />
              <span>为「{query || '自选'}」自建食物档案</span>
            </button>
          </div>
        ) : (
          filteredFoods.map(food => (
            <div
              key={food.id}
              className="w-full bg-white card-border rounded-xl p-3 hover:border-black transition-all flex items-center justify-between group"
            >
              <button
                type="button"
                onClick={() => onSelectFood(food)}
                className="text-left flex-1 min-w-0 pr-2 py-0.5 focus-visible:outline-2 focus-visible:outline-black rounded"
                aria-label={`选择${food.name}，热量${food.nutrition.calories}千卡`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-neutral-900 group-hover:text-black truncate">
                      {food.name}
                    </span>
                    {food.source === 'custom' && (
                      <span className="text-[10px] font-medium bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded">
                        私房
                      </span>
                    )}
                    {food.steps && food.steps.length > 0 && (
                      <span className="text-[10px] font-medium text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                        含做法
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-neutral-400">
                    每 {food.defaultGrams}g：蛋白 {food.nutrition.protein}g · 碳水 {food.nutrition.carbs}g · 脂肪 {food.nutrition.fat}g
                  </div>
                </div>
              </button>

              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <span className="text-sm font-bold text-neutral-950 block">
                    {food.nutrition.calories}{' '}
                    <span className="text-[11px] font-normal text-neutral-400">千卡</span>
                  </span>
                  <span className="text-[11px] text-neutral-400 block mt-0.5">
                    每份 {food.defaultGrams}g
                  </span>
                </div>

                {food.source === 'custom' && onEditCustom && (
                  <button
                    type="button"
                    onClick={() => onEditCustom(food)}
                    aria-label={`编辑私房食物「${food.name}」`}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors ml-1 focus-visible:outline-2 focus-visible:outline-black"
                  >
                    <Edit2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};
