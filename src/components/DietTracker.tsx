import React, { useState } from 'react';
import { FoodItem, LoggedItem, MealType, DailyTargets } from '../types';
import { FOODS_DATABASE } from '../data/foodDatabase';

interface DietTrackerProps {
  currentDate: string;
  logs: LoggedItem[];
  targets: DailyTargets;
  onDateChange: (newDate: string) => void;
  onAddLog: (item: LoggedItem) => void;
  onDeleteLog: (id: string) => void;
}

const MEAL_CONFIG: { type: MealType; name: string }[] = [
  { type: 'breakfast', name: '早餐' },
  { type: 'lunch', name: '午餐' },
  { type: 'dinner', name: '晚餐' },
  { type: 'snack', name: '加餐' },
];

export const DietTracker: React.FC<DietTrackerProps> = ({
  currentDate,
  logs,
  targets,
  onDateChange,
  onAddLog,
  onDeleteLog,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [amountInput, setAmountInput] = useState<number>(100);
  const [selectedMeal, setSelectedMeal] = useState<MealType>('lunch');

  // Calculate totals
  const totalCal = logs.reduce((sum, i) => sum + (i.cal || 0), 0);
  const totalProtein = parseFloat(logs.reduce((sum, i) => sum + (i.protein || 0), 0).toFixed(1));
  const totalCarbs = parseFloat(logs.reduce((sum, i) => sum + (i.carbs || 0), 0).toFixed(1));
  const totalFat = parseFloat(logs.reduce((sum, i) => sum + (i.fat || 0), 0).toFixed(1));

  // Date controls
  const handleOffsetDate = (offset: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + offset);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    onDateChange(`${yyyy}-${mm}-${dd}`);
  };

  const isToday = (() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return currentDate === `${yyyy}-${mm}-${dd}`;
  })();

  // Filter food search
  const filteredFoods = searchQuery.trim()
    ? FOODS_DATABASE.filter(f => f.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : [];

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setSearchQuery('');
  };

  const handleConfirmAdd = () => {
    if (!selectedFood) return;
    const amount = Number(amountInput) || 100;
    const ratio = amount / 100;

    const newItem: LoggedItem = {
      id: 'log-' + Date.now(),
      foodId: selectedFood.id,
      name: selectedFood.name,
      amount,
      cal: Math.round(selectedFood.cal * ratio),
      protein: parseFloat((selectedFood.protein * ratio).toFixed(1)),
      fat: parseFloat((selectedFood.fat * ratio).toFixed(1)),
      carbs: parseFloat((selectedFood.carbs * ratio).toFixed(1)),
      mealType: selectedMeal,
      loggedAt: new Date().toISOString(),
    };

    onAddLog(newItem);
    setSelectedFood(null);
    setAmountInput(100);
  };

  return (
    <div id="diet-tracker-view" className="space-y-4">
      {/* Date Switcher Card */}
      <div
        className="bg-white card-border rounded-xl px-4 py-2.5 flex items-center justify-between"
        role="region"
        aria-label="日期选择"
      >
        <button
          id="btn-prev-day"
          type="button"
          aria-label="前一天"
          onClick={() => handleOffsetDate(-1)}
          className="text-xs font-semibold text-neutral-600 hover:text-black bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg transition-colors min-h-[32px]"
        >
          前一天
        </button>

        <div className="flex items-baseline gap-2">
          <time dateTime={currentDate} className="text-sm font-bold text-neutral-900">
            {isToday ? '今日' : currentDate}
          </time>
          {isToday && (
            <time dateTime={currentDate} className="text-xs text-neutral-400">
              {currentDate}
            </time>
          )}
        </div>

        <button
          id="btn-next-day"
          type="button"
          aria-label="后一天"
          onClick={() => handleOffsetDate(1)}
          className="text-xs font-semibold text-neutral-600 hover:text-black bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg transition-colors min-h-[32px]"
        >
          后一天
        </button>
      </div>

      {/* Daily Overview Card */}
      <section className="bg-white card-border rounded-xl p-4 space-y-3.5" aria-label="今日摄入概览">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-neutral-900 tracking-wider">今日摄入概览</h2>
          <span className="text-xs text-neutral-400">目标 {targets.calories} 千卡</span>
        </div>

        {/* 4 Nutrient Cards */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-[#FAFAFA] border border-neutral-100 rounded-lg py-2.5 px-1 text-center">
            <span className="block text-[11px] text-neutral-400 font-medium">总热量</span>
            <span className="block text-base font-extrabold text-neutral-950 my-0.5 leading-tight">{totalCal}</span>
            <span className="block text-[10px] text-neutral-400">千卡</span>
          </div>
          <div className="bg-[#FAFAFA] border border-neutral-100 rounded-lg py-2.5 px-1 text-center">
            <span className="block text-[11px] text-neutral-400 font-medium">蛋白质</span>
            <span className="block text-base font-extrabold text-neutral-950 my-0.5 leading-tight">{totalProtein}</span>
            <span className="block text-[10px] text-neutral-400">克</span>
          </div>
          <div className="bg-[#FAFAFA] border border-neutral-100 rounded-lg py-2.5 px-1 text-center">
            <span className="block text-[11px] text-neutral-400 font-medium">碳水</span>
            <span className="block text-base font-extrabold text-neutral-950 my-0.5 leading-tight">{totalCarbs}</span>
            <span className="block text-[10px] text-neutral-400">克</span>
          </div>
          <div className="bg-[#FAFAFA] border border-neutral-100 rounded-lg py-2.5 px-1 text-center">
            <span className="block text-[11px] text-neutral-400 font-medium">脂肪</span>
            <span className="block text-base font-extrabold text-neutral-950 my-0.5 leading-tight">{totalFat}</span>
            <span className="block text-[10px] text-neutral-400">克</span>
          </div>
        </div>

        {/* Calorie Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs text-neutral-400">
            <span>摄入进度</span>
            <span className="font-semibold text-neutral-700">{Math.round((totalCal / targets.calories) * 100)}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={totalCal}
            aria-valuemin={0}
            aria-valuemax={targets.calories}
            aria-label="今日热量摄入比例"
            className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-black rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.round((totalCal / targets.calories) * 100))}%` }}
            />
          </div>
        </div>
      </section>

      {/* Fast Input Section */}
      <section className="bg-white card-border rounded-xl p-4 space-y-3" aria-label="添加饮食记录">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-neutral-900 tracking-tight">添加饮食记录</h2>
          <span className="text-xs text-neutral-400">选择食材快速记账</span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <label htmlFor="diet-search-food-input" className="sr-only">
            搜索食物
          </label>
          <input
            id="diet-search-food-input"
            type="search"
            role="combobox"
            aria-expanded={filteredFoods.length > 0}
            aria-autocomplete="list"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索食物（如：鸡胸肉、米饭、鸡蛋、牛肉）"
            className="w-full bg-white card-border text-neutral-900 placeholder:text-neutral-400 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-black focus:ring-1 focus:ring-black"
          />

          {/* Quick Search Dropdown */}
          {filteredFoods.length > 0 && (
            <div
              role="listbox"
              aria-label="匹配的食物列表"
              className="absolute top-full left-0 right-0 z-20 mt-1.5 bg-white card-border rounded-xl shadow-lg max-h-56 overflow-y-auto p-1.5 space-y-1"
            >
              {filteredFoods.map(food => (
                <div
                  key={food.id}
                  role="option"
                  tabIndex={0}
                  aria-selected={selectedFood?.id === food.id}
                  onClick={() => handleSelectFood(food)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectFood(food);
                    }
                  }}
                  className="p-2.5 rounded-lg hover:bg-neutral-50 cursor-pointer flex items-center justify-between transition-colors focus:bg-neutral-100 outline-none"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-neutral-900">{food.name}</div>
                    <div className="text-[11px] text-neutral-400">
                      每百克 {food.cal} 千卡 · 蛋白 {food.protein}g · 碳水 {food.carbs}g
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-black bg-neutral-100 px-2.5 py-1 rounded-md">
                    选用
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Food Form */}
        {selectedFood && (
          <div className="bg-[#FAFAFA] card-border rounded-xl p-3.5 space-y-3 animate-fadeIn">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-neutral-900 block">{selectedFood.name}</span>
                {selectedFood.servingDesc && (
                  <span className="text-[11px] text-neutral-400 block mt-0.5">{selectedFood.servingDesc}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedFood(null)}
                aria-label="取消选择当前食物"
                className="text-xs text-neutral-400 hover:text-black p-1"
              >
                取消
              </button>
            </div>

            {/* Quick portions */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-neutral-400 font-medium block">快捷分量预设</span>
              <div className="flex items-center gap-1.5" role="group" aria-label="快捷分量预设">
                {[50, 100, 150, 200].map(grams => (
                  <button
                    key={grams}
                    type="button"
                    onClick={() => setAmountInput(grams)}
                    className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                      amountInput === grams
                        ? 'bg-black text-white font-semibold'
                        : 'bg-white card-border text-neutral-600 hover:border-neutral-400'
                    }`}
                  >
                    {grams}g
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label htmlFor="food-gram-input" className="block text-xs font-medium text-neutral-600 mb-1">分量 (克)</label>
                <input
                  id="food-gram-input"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="5000"
                  value={amountInput}
                  onChange={e => setAmountInput(Number(e.target.value))}
                  className="w-full bg-white card-border text-neutral-900 text-xs rounded-lg px-3 py-2 outline-none font-semibold focus:border-black"
                />
              </div>

              <div>
                <label htmlFor="food-meal-select" className="block text-xs font-medium text-neutral-600 mb-1">餐次</label>
                <select
                  id="food-meal-select"
                  value={selectedMeal}
                  onChange={e => setSelectedMeal(e.target.value as MealType)}
                  className="w-full bg-white card-border text-neutral-900 text-xs rounded-lg px-3 py-2 outline-none font-semibold focus:border-black"
                >
                  <option value="breakfast">早餐</option>
                  <option value="lunch">午餐</option>
                  <option value="dinner">晚餐</option>
                  <option value="snack">加餐</option>
                </select>
              </div>
            </div>

            {/* Live calculation & action */}
            <div className="text-xs text-neutral-600 pt-1 flex justify-between items-center border-t border-neutral-200/60">
              <span className="font-semibold text-neutral-800">
                约 {Math.round(selectedFood.cal * ((amountInput || 0) / 100))} 千卡
              </span>
              <button
                type="button"
                id="btn-confirm-add-food"
                onClick={handleConfirmAdd}
                className="bg-black text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors min-h-[32px]"
              >
                确认记录
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Meals Log Section */}
      <section className="space-y-3" aria-label="各餐食物记录">
        {MEAL_CONFIG.map(({ type, name }) => {
          const mealItems = logs.filter(item => item.mealType === type);
          const mealCal = mealItems.reduce((sum, i) => sum + (i.cal || 0), 0);

          return (
            <div key={type} className="bg-white card-border rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <h3 className="text-xs font-bold text-neutral-900">{name}</h3>
                <span className="text-xs font-bold text-neutral-700">
                  {mealCal} <span className="font-normal text-[10px] text-neutral-400">千卡</span>
                </span>
              </div>

              {mealItems.length === 0 ? (
                <div className="py-2 text-xs text-neutral-300 font-normal">
                  暂未记录食物
                </div>
              ) : (
                <div className="space-y-1">
                  {mealItems.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 border-b border-neutral-100/60 last:border-0 hover:bg-[#FAFAFA] rounded-lg transition-colors px-1 -mx-1"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-neutral-900">
                          {item.name}
                          <span className="ml-1.5 text-neutral-400 font-normal text-[11px]">
                            {item.amount}g
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          蛋白 {item.protein}g · 碳水 {item.carbs}g · 脂肪 {item.fat}g
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-neutral-900">
                          {item.cal} <span className="text-[10px] font-normal text-neutral-400">kcal</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => onDeleteLog(item.id)}
                          aria-label={`删除 ${item.name} 记录`}
                          className="text-neutral-300 hover:text-red-500 text-sm leading-none p-1.5 transition-colors min-w-[28px] min-h-[28px] flex items-center justify-center"
                          title="移出此项"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
};
