import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FoodItem, LoggedItem, MealType, DailyTargets } from '../types';
import { FOODS_DATABASE } from '../data/foodDatabase';
import { getTodayDateString } from '../utils/storage';

interface DietTrackerProps {
  currentDate: string;
  logs: LoggedItem[];
  targets?: DailyTargets;
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
  onDateChange,
  onAddLog,
  onDeleteLog,
}) => {
  const [activeRecordingMeal, setActiveRecordingMeal] = useState<MealType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [amountInput, setAmountInput] = useState<number>(100);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const todayDateRef = useRef<HTMLButtonElement | null>(null);
  const activeDateRef = useRef<HTMLButtonElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const todayStr = useMemo(() => getTodayDateString(), []);
  const isToday = currentDate === todayStr;

  // Generate recent 28 days of history up to today (4 full weeks)
  const daysList = useMemo(() => {
    const list: {
      dateStr: string;
      dayNumber: number;
      weekDayLabel: string;
      monthLabel: string;
      year: number;
      isToday: boolean;
      fullDateLabel: string;
    }[] = [];

    const now = new Date();
    const weekdayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

    // 28 days back to today (offset: -28 to 0)
    for (let offset = -28; offset <= 0; offset++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      list.push({
        dateStr,
        dayNumber: d.getDate(),
        weekDayLabel: weekdayNames[d.getDay()],
        monthLabel: `${d.getMonth() + 1}月`,
        year: yyyy,
        isToday: dateStr === todayStr,
        fullDateLabel: `${d.getMonth() + 1}月${d.getDate()}日 ${weekdayNames[d.getDay()]}`,
      });
    }
    return list;
  }, [todayStr]);

  // Default anchor to today on mount
  useEffect(() => {
    const target = todayDateRef.current || activeDateRef.current;
    if (target && scrollContainerRef.current) {
      target.scrollIntoView({
        behavior: 'auto',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, []);

  // Handle modal escape and overflow lock
  useEffect(() => {
    if (!activeRecordingMeal) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Auto-focus search input when modal opens
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [activeRecordingMeal]);

  const handleSelectDate = (dateStr: string) => {
    onDateChange(dateStr);
  };

  const handleBackToToday = () => {
    onDateChange(todayStr);
    if (todayDateRef.current) {
      todayDateRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  };

  const handleOpenRecordModal = (meal: MealType) => {
    setActiveRecordingMeal(meal);
    setSearchQuery('');
    setSelectedFood(null);
    setAmountInput(100);
  };

  const handleCloseModal = () => {
    setActiveRecordingMeal(null);
    setSearchQuery('');
    setSelectedFood(null);
    setAmountInput(100);
  };

  // Calculate totals
  const totalCal = logs.reduce((sum, i) => sum + (i.cal || 0), 0);
  const totalProtein = parseFloat(logs.reduce((sum, i) => sum + (i.protein || 0), 0).toFixed(1));
  const totalCarbs = parseFloat(logs.reduce((sum, i) => sum + (i.carbs || 0), 0).toFixed(1));
  const totalFat = parseFloat(logs.reduce((sum, i) => sum + (i.fat || 0), 0).toFixed(1));

  // Current display date label
  const currentDayInfo = daysList.find(d => d.dateStr === currentDate);
  const displayDateText = currentDayInfo
    ? `${currentDayInfo.monthLabel}${currentDayInfo.dayNumber}日 ${currentDayInfo.weekDayLabel}`
    : currentDate;

  // Filter food search
  const filteredFoods = searchQuery.trim()
    ? FOODS_DATABASE.filter(f => f.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : [];

  // Frequent quick picks when search query is empty
  const frequentFoods = useMemo(() => {
    return FOODS_DATABASE.slice(0, 10);
  }, []);

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
  };

  const handleConfirmAdd = () => {
    if (!selectedFood || !activeRecordingMeal) return;
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
      mealType: activeRecordingMeal,
      loggedAt: new Date().toISOString(),
    };

    onAddLog(newItem);
    handleCloseModal();
  };

  const currentMealName = MEAL_CONFIG.find(m => m.type === activeRecordingMeal)?.name || '饮食';

  return (
    <div id="diet-tracker-view" className="space-y-4">
      {/* Horizontal 7-days Date Selector */}
      <section
        className="bg-white card-border rounded-xl p-3 space-y-2.5"
        role="region"
        aria-label="日期选择"
      >
        <div className="flex items-center justify-between px-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-bold text-neutral-950 tracking-tight">
              {isToday ? '今日' : displayDateText}
            </span>
            <span className="text-[11px] text-neutral-400">
              {isToday ? displayDateText : '历史饮食记录'}
            </span>
          </div>

          {!isToday && (
            <button
              id="btn-back-to-today"
              type="button"
              onClick={handleBackToToday}
              aria-label="返回今日"
              className="text-[11px] font-semibold text-neutral-700 hover:text-black bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded-md transition-colors min-h-[32px] flex items-center gap-1"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              <span>回到今日</span>
            </button>
          )}
        </div>

        {/* Scrollable strip displaying 7 days at a glance, horizontally scrollable to view earlier days */}
        <div
          ref={scrollContainerRef}
          role="tablist"
          aria-label="横向日期选择"
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pt-0.5 scroll-smooth"
        >
          {daysList.map(item => {
            const isSelected = item.dateStr === currentDate;
            return (
              <button
                key={item.dateStr}
                id={`date-tab-${item.dateStr}`}
                ref={el => {
                  if (isSelected) activeDateRef.current = el;
                  if (item.isToday) todayDateRef.current = el;
                }}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`${item.fullDateLabel}${item.isToday ? ' 今日' : ''}`}
                onClick={() => handleSelectDate(item.dateStr)}
                className={`flex-shrink-0 flex flex-col items-center justify-between min-w-[46px] w-[calc((100%-36px)/7)] h-[66px] py-1.5 px-1 rounded-lg transition-all focus-visible:outline-2 focus-visible:outline-black ${
                  isSelected
                    ? 'bg-neutral-950 text-white font-bold'
                    : 'bg-[#FAFAFA] card-border text-neutral-700 hover:bg-neutral-100 hover:border-neutral-300'
                }`}
              >
                <span
                  className={`text-[10px] tracking-tight leading-none ${
                    isSelected ? 'text-neutral-300 font-medium' : 'text-neutral-400 font-normal'
                  }`}
                >
                  {item.weekDayLabel}
                </span>

                <span
                  className={`text-base leading-none tracking-tight font-bold my-0.5 ${
                    isSelected ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {item.dayNumber}
                </span>

                <span
                  className={`text-[9px] leading-none font-semibold ${
                    item.isToday
                      ? isSelected
                        ? 'text-neutral-300'
                        : 'text-neutral-900'
                      : 'opacity-0'
                  }`}
                >
                  今日
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Daily Overview Card */}
      <section className="bg-white card-border rounded-xl p-4 space-y-3" aria-label="今日摄入概览">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-neutral-900 tracking-tight">今日摄入概览</h2>
          <span className="text-xs text-neutral-400">已记 {logs.length} 项</span>
        </div>

        {/* 4 Nutrient Columns (Flattened depth - no card-in-card nesting) */}
        <div className="grid grid-cols-4 divide-x divide-[#E0E0E0] py-1 text-center">
          <div className="px-1">
            <span className="block text-[11px] text-neutral-400 font-medium">总热量</span>
            <span className="block text-base font-bold text-neutral-950 my-0.5 tracking-tight">{totalCal}</span>
            <span className="block text-[10px] text-neutral-400">千卡</span>
          </div>
          <div className="px-1">
            <span className="block text-[11px] text-neutral-400 font-medium">蛋白质</span>
            <span className="block text-base font-bold text-neutral-950 my-0.5 tracking-tight">{totalProtein}</span>
            <span className="block text-[10px] text-neutral-400">克</span>
          </div>
          <div className="px-1">
            <span className="block text-[11px] text-neutral-400 font-medium">碳水</span>
            <span className="block text-base font-bold text-neutral-950 my-0.5 tracking-tight">{totalCarbs}</span>
            <span className="block text-[10px] text-neutral-400">克</span>
          </div>
          <div className="px-1">
            <span className="block text-[11px] text-neutral-400 font-medium">脂肪</span>
            <span className="block text-base font-bold text-neutral-950 my-0.5 tracking-tight">{totalFat}</span>
            <span className="block text-[10px] text-neutral-400">克</span>
          </div>
        </div>
      </section>

      {/* Meals Log Section */}
      <section className="space-y-3" aria-label="三餐记录明细">
        {MEAL_CONFIG.map(({ type, name }) => {
          const mealItems = logs.filter(item => item.mealType === type);
          const mealCal = mealItems.reduce((sum, i) => sum + (i.cal || 0), 0);

          return (
            <div key={type} className="bg-white card-border rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#E0E0E0]">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-neutral-900">{name}</h3>
                  <span className="text-xs font-bold text-neutral-700">
                    {mealCal} <span className="font-normal text-[10px] text-neutral-400">千卡</span>
                  </span>
                </div>

                <button
                  id={`btn-record-${type}`}
                  type="button"
                  onClick={() => handleOpenRecordModal(type)}
                  aria-label={`记录${name}`}
                  className="text-xs font-semibold text-neutral-900 hover:text-black bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg transition-colors min-h-[34px] flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-black"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>记录</span>
                </button>
              </div>

              {mealItems.length === 0 ? (
                <div className="py-2.5 flex items-center justify-between text-xs text-neutral-400">
                  <span>这一餐还没有记录</span>
                  <button
                    type="button"
                    onClick={() => handleOpenRecordModal(type)}
                    className="text-xs font-semibold text-neutral-700 hover:text-black py-1 px-2 rounded hover:bg-neutral-100 transition-colors"
                  >
                    + 记一笔
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  {mealItems.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 border-b border-[#E0E0E0] last:border-0 hover:bg-[#FAFAFA] rounded-lg transition-colors px-1 -mx-1"
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
                          aria-label={`移除 ${item.name} 记录`}
                          className="text-neutral-300 hover:text-red-500 text-sm leading-none p-1.5 transition-colors min-w-[28px] min-h-[28px] flex items-center justify-center"
                          title="撤销此项"
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

      {/* Floating Record Layer (Modal) */}
      {activeRecordingMeal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="record-modal-title"
          onClick={e => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div
            className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl card-border p-4 h-[80vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E0E0E0] flex-shrink-0">
              <div className="flex items-baseline gap-2">
                <h2 id="record-modal-title" className="text-sm font-bold text-neutral-950">
                  记录{currentMealName}
                </h2>
                <span className="text-[11px] text-neutral-400">
                  {isToday ? '今日' : displayDateText}
                </span>
              </div>

              <button
                id="btn-close-record-modal"
                type="button"
                onClick={handleCloseModal}
                aria-label="关闭记录窗口"
                className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center text-neutral-400 hover:text-black transition-colors rounded-lg focus-visible:outline-2 focus-visible:outline-black"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="pt-3 space-y-3 overflow-y-auto flex-1 px-1 pr-1.5">
              {/* 顶部搜索框 */}
              <div className="relative">
                <label htmlFor="modal-food-search-input" className="sr-only">
                  搜索食材
                </label>
                <div className="relative flex items-center">
                  <svg
                    className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    ref={searchInputRef}
                    id="modal-food-search-input"
                    type="search"
                    role="searchbox"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    value={searchQuery}
                    onChange={e => {
                      setSearchQuery(e.target.value);
                      if (selectedFood) setSelectedFood(null);
                    }}
                    placeholder="搜索食材（如：鸡胸肉、燕麦、鸡蛋、米饭）"
                    className="w-full bg-[#FAFAFA] border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 text-xs rounded-full pl-10 pr-10 py-2.5 outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-colors [appearance:none] [-webkit-appearance:none]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        searchInputRef.current?.focus();
                      }}
                      aria-label="清空搜索内容"
                      className="absolute right-3 text-neutral-400 hover:text-black p-1 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* IF FOOD IS SELECTED */}
              {selectedFood ? (
                <div className="bg-[#FAFAFA] card-border rounded-xl p-3.5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-neutral-950 block">{selectedFood.name}</span>
                      <span className="text-[11px] text-neutral-400 block">
                        每 100g 含有 {selectedFood.cal} 千卡 · 蛋白 {selectedFood.protein}g · 碳水 {selectedFood.carbs}g · 脂肪 {selectedFood.fat}g
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFood(null)}
                      aria-label="更换食材"
                      className="text-xs font-medium text-neutral-500 hover:text-black py-1 px-2 rounded-md hover:bg-neutral-200 transition-colors"
                    >
                      换个食材
                    </button>
                  </div>

                  {/* Quick grams selection */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] text-neutral-500 font-medium block">常用分量</span>
                    <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="常用分量选择">
                      {[50, 100, 150, 200, 250].map(grams => (
                        <button
                          key={grams}
                          type="button"
                          onClick={() => setAmountInput(grams)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
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

                  {/* Grams input */}
                  <div>
                    <label htmlFor="food-gram-input" className="block text-xs font-medium text-neutral-600 mb-1">
                      实际食用克数 (g)
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="food-gram-input"
                        type="number"
                        inputMode="numeric"
                        min="1"
                        max="5000"
                        value={amountInput || ''}
                        onChange={e => setAmountInput(Number(e.target.value))}
                        className="w-full bg-white card-border text-neutral-950 text-sm font-bold rounded-lg px-3 py-2 outline-none focus:border-black"
                      />
                      <span className="absolute right-3 text-xs text-neutral-400 pointer-events-none">克</span>
                    </div>
                  </div>

                  {/* Realtime Nutrition Summary for this portion */}
                  <div className="bg-white card-border rounded-lg p-2.5 text-xs text-neutral-600 space-y-1">
                    <div className="flex justify-between items-center font-bold text-neutral-950">
                      <span>预估总热量</span>
                      <span className="text-sm">
                        {Math.round(selectedFood.cal * ((amountInput || 0) / 100))} 千卡
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-neutral-400 pt-0.5 border-t border-[#E0E0E0]">
                      <span>蛋白 {parseFloat((selectedFood.protein * ((amountInput || 0) / 100)).toFixed(1))}g</span>
                      <span>碳水 {parseFloat((selectedFood.carbs * ((amountInput || 0) / 100)).toFixed(1))}g</span>
                      <span>脂肪 {parseFloat((selectedFood.fat * ((amountInput || 0) / 100)).toFixed(1))}g</span>
                    </div>
                  </div>

                  {/* Actions (Note: meal selection is gone because it was already chosen!) */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 text-xs font-semibold text-neutral-600 hover:text-black bg-neutral-100 hover:bg-neutral-200 py-2.5 rounded-lg transition-colors min-h-[44px]"
                    >
                      取消
                    </button>
                    <button
                      id="btn-confirm-add-food"
                      type="button"
                      onClick={handleConfirmAdd}
                      className="flex-1 bg-black text-white text-xs font-bold py-2.5 rounded-lg hover:bg-neutral-800 transition-colors min-h-[44px]"
                    >
                      记入{currentMealName}
                    </button>
                  </div>
                </div>
              ) : (
                /* SEARCH RESULTS OR FREQUENT FOODS */
                <div className="space-y-2">
                  {searchQuery.trim() ? (
                    <div className="space-y-1">
                      <div className="text-[11px] text-neutral-400 font-medium px-1">
                        找到 {filteredFoods.length} 种匹配食材：
                      </div>
                      {filteredFoods.length > 0 ? (
                        <div className="space-y-1 max-h-72 overflow-y-auto">
                          {filteredFoods.map(food => (
                            <div
                              key={food.id}
                              role="button"
                              tabIndex={0}
                              onClick={() => handleSelectFood(food)}
                              onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  handleSelectFood(food);
                                }
                              }}
                              className="p-3 rounded-xl bg-white hover:bg-neutral-50 card-border cursor-pointer flex items-center justify-between transition-colors focus-visible:outline-2 focus-visible:outline-black"
                            >
                              <div className="space-y-0.5">
                                <div className="text-xs font-bold text-neutral-900">{food.name}</div>
                                <div className="text-[11px] text-neutral-400">
                                  每百克 {food.cal} 千卡 · 蛋白 {food.protein}g · 碳水 {food.carbs}g · 脂肪 {food.fat}g
                                </div>
                              </div>
                              <span className="text-xs font-semibold text-black bg-neutral-100 px-2.5 py-1 rounded-md">
                                选择
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-xs text-neutral-400 card-border rounded-xl bg-[#FAFAFA]">
                          未在食材库中找到“{searchQuery}”，可尝试更换关键词
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Common / Frequent foods quick pick */
                    <div className="space-y-1.5">
                      <div className="text-[11px] text-neutral-400 font-medium px-1">
                        常见食材快捷选择
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 max-h-72 overflow-y-auto p-0.5">
                        {frequentFoods.map(food => (
                          <button
                            key={food.id}
                            type="button"
                            onClick={() => handleSelectFood(food)}
                            className="p-2.5 rounded-xl bg-white hover:bg-neutral-50 card-border text-left transition-colors flex flex-col justify-between min-h-[58px] focus-visible:outline-2 focus-visible:outline-black"
                          >
                            <span className="text-xs font-bold text-neutral-900 block truncate">{food.name}</span>
                            <span className="text-[10px] text-neutral-400 block mt-1">
                              {food.cal} kcal / 100g
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
