import React, { useMemo, useState, useRef, useEffect } from 'react';
import { LogEntry, MealType, DailyTargets } from '../types';
import { getTodayDateString } from '../utils/storage';
import { matchesMeal } from '../utils/mealUtils';
import { Plus, X, RotateCcw } from './icons';

interface DietTrackerProps {
  currentDate: string;
  logs: LogEntry[];
  targets: DailyTargets;
  onDateChange: (newDate: string) => void;
  onOpenRecord: (mealType: MealType) => void;
  onDeleteLog: (id: string) => void;
}

interface MacroRingProps {
  label: string;
  current: number;
  target: number;
  unit: string;
}

const MacroRing: React.FC<MacroRingProps> = ({ label, current, target, unit }) => {
  const percentage = target > 0 ? Math.round((current / target) * 100) : 0;
  const isAchieved = percentage >= 100;
  const radius = 21;
  const circumference = 2 * Math.PI * radius;
  const visualPercentage = Math.min(100, percentage);
  const strokeDashoffset = circumference - (visualPercentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-14 h-14 flex items-center justify-center">
        <svg className="w-14 h-14 -rotate-90 transform" viewBox="0 0 54 54" aria-hidden="true">
          <circle
            cx="27"
            cy="27"
            r={radius}
            stroke="#EFEFEF"
            strokeWidth="3.5"
            fill="transparent"
          />
          <circle
            cx="27"
            cy="27"
            r={radius}
            stroke="#171717"
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-bold tabular-nums text-neutral-900">{percentage}%</span>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-2">
        <span className="text-xs font-bold text-neutral-800">{label}</span>
        {isAchieved && (
          <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded-full leading-none">
            已达成
          </span>
        )}
      </div>
      <span className="text-[11px] text-neutral-400 tabular-nums mt-1">
        {current} / {target}{unit}
      </span>
    </div>
  );
};

export const DietTracker: React.FC<DietTrackerProps> = ({
  currentDate,
  logs,
  targets,
  onDateChange,
  onOpenRecord,
  onDeleteLog,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const todayDateRef = useRef<HTMLButtonElement | null>(null);
  const activeDateRef = useRef<HTMLButtonElement | null>(null);

  const todayStr = useMemo(() => getTodayDateString(), []);
  const isToday = currentDate === todayStr;

  // Dynamic Meals Management (Default 3 meals: 第 1 餐、第 2 餐、第 3 餐)
  const [mealCount, setMealCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('diet_tracker_meal_count');
      const n = saved ? parseInt(saved, 10) : 3;
      return isNaN(n) || n < 1 ? 3 : n;
    } catch {
      return 3;
    }
  });

  const highestLogMealIndex = useMemo(() => {
    let maxIdx = 3;
    logs.forEach(item => {
      if (item.mealType === 'snack') maxIdx = Math.max(maxIdx, 4);
      const m = item.mealType?.match(/^meal_(\d+)$/);
      if (m) {
        maxIdx = Math.max(maxIdx, parseInt(m[1], 10));
      }
    });
    return maxIdx;
  }, [logs]);

  const totalMeals = Math.max(mealCount, highestLogMealIndex);

  const mealList = useMemo(() => {
    const list: { type: string; name: string; index: number }[] = [];
    for (let i = 1; i <= totalMeals; i++) {
      list.push({
        type: `meal_${i}`,
        name: `第 ${i} 餐`,
        index: i,
      });
    }
    return list;
  }, [totalMeals]);

  const handleAddMeal = () => {
    const next = totalMeals + 1;
    setMealCount(next);
    try {
      localStorage.setItem('diet_tracker_meal_count', String(next));
    } catch {}
  };

  const handleRemoveMeal = (mealIndex: number) => {
    if (mealIndex <= 3) return;
    const next = Math.max(3, totalMeals - 1);
    setMealCount(next);
    try {
      localStorage.setItem('diet_tracker_meal_count', String(next));
    } catch {}
  };

  // Generate 28 days history
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

  // Initial anchor to active date on mount without sliding
  useEffect(() => {
    const target = todayDateRef.current || activeDateRef.current;
    const container = scrollContainerRef.current;
    if (target && container) {
      container.scrollLeft =
        target.offsetLeft - container.clientWidth / 2 + target.clientWidth / 2;
    }
  }, []);

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

  // Nutrition Totals
  const totalCal = logs.reduce((sum, i) => sum + (i.nutrition.calories || 0), 0);
  const totalProtein = parseFloat(
    logs.reduce((sum, i) => sum + (i.nutrition.protein || 0), 0).toFixed(1)
  );
  const totalCarbs = parseFloat(
    logs.reduce((sum, i) => sum + (i.nutrition.carbs || 0), 0).toFixed(1)
  );
  const totalFat = parseFloat(
    logs.reduce((sum, i) => sum + (i.nutrition.fat || 0), 0).toFixed(1)
  );

  const currentDayInfo = daysList.find(d => d.dateStr === currentDate);
  const displayDateText = currentDayInfo
    ? `${currentDayInfo.monthLabel}${currentDayInfo.dayNumber}日 ${currentDayInfo.weekDayLabel}`
    : currentDate;

  const calorieDiff = targets.calories - totalCal;

  return (
    <div id="diet-tracker-view" className="space-y-4">
      {/* 28-days Horizontal Date Selector */}
      <section
        className="bg-white card-border rounded-xl p-3 space-y-2"
        role="region"
        aria-label="日期选择"
      >
        <div className="flex items-center justify-between px-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-bold text-neutral-900 tracking-tight">
              {displayDateText}
            </span>
            {isToday && (
              <span className="text-[11px] font-medium text-neutral-400">今日</span>
            )}
          </div>

          {!isToday && (
            <button
              type="button"
              onClick={handleBackToToday}
              aria-label="回到今日日期"
              className="text-xs font-semibold text-neutral-700 hover:text-black flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors min-h-[32px]"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" strokeWidth={2.5} />
              <span>回到今日</span>
            </button>
          )}
        </div>

        {/* Scrollable Date Strip */}
        <div
          ref={scrollContainerRef}
          role="tablist"
          aria-label="横向日期选择"
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 snap-x snap-proximity"
        >
          {daysList.map(item => {
            const isSelected = item.dateStr === currentDate;
            const isFirstOfMonth = item.dayNumber === 1;

            return (
              <React.Fragment key={item.dateStr}>
                {isFirstOfMonth && (
                  <span
                    aria-hidden="true"
                    className="shrink-0 flex items-center justify-center text-[10px] font-bold text-neutral-400 px-1 select-none"
                  >
                    {item.monthLabel}
                  </span>
                )}
                <button
                  ref={
                    item.dateStr === todayStr
                      ? todayDateRef
                      : isSelected
                      ? activeDateRef
                      : null
                  }
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={item.fullDateLabel}
                  onClick={() => onDateChange(item.dateStr)}
                  className={`shrink-0 flex flex-col items-center justify-center w-10 h-12 rounded-xl transition-all snap-center min-w-[40px] min-h-[48px] ${
                    isSelected
                      ? 'bg-black text-white'
                      : 'bg-[#FAFAFA] text-neutral-700 hover:bg-neutral-100 border border-[#E0E0E0]'
                  }`}
                >
                  <span className="text-[10px] leading-tight font-medium opacity-70">
                    {item.weekDayLabel}
                  </span>
                  <span className="text-xs font-bold leading-tight mt-0.5 tabular-nums">
                    {item.dayNumber}
                  </span>
                  {item.isToday && (
                    <span
                      className={`w-1 h-1 rounded-full mt-1 ${
                        isSelected ? 'bg-white' : 'bg-black'
                      }`}
                    />
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* Daily Overview Card with Macro Progress Rings */}
      <section
        className="bg-white card-border rounded-xl p-4 space-y-4"
        aria-label="摄入概览与三大营养素达成"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-neutral-900 tracking-tight">
            {isToday ? '今日摄入概览' : `${displayDateText}摄入概览`}
          </h2>
        </div>

        {/* 主叙事区（热量） */}
        <div className="flex items-center justify-between py-1">
          <div>
            <span className="text-xs text-neutral-400 font-medium block mb-1">
              {calorieDiff >= 0 ? '还可摄入' : '已超出'}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tabular-nums tracking-tight text-neutral-950">
                {Math.abs(calorieDiff)}
              </span>
              <span className="text-xs font-normal text-neutral-400">千卡</span>
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="text-xs text-neutral-400">
              已摄入 <span className="font-semibold text-neutral-900 tabular-nums">{totalCal}</span> 千卡
            </div>
            <div className="text-xs text-neutral-400">
              目标 <span className="tabular-nums">{targets.calories}</span> 千卡
            </div>
          </div>
        </div>

        {/* 三大营养素环形进度（通过自然留白呼吸过渡，无分割线） */}
        <div className="pt-2">
          <div className="grid grid-cols-3 gap-2 py-1 justify-items-center">
            <MacroRing
              label="蛋白质"
              current={totalProtein}
              target={targets.protein}
              unit="g"
            />
            <MacroRing
              label="碳水"
              current={totalCarbs}
              target={targets.carbs}
              unit="g"
            />
            <MacroRing
              label="脂肪"
              current={totalFat}
              target={targets.fat}
              unit="g"
            />
          </div>
        </div>
      </section>

      {/* Dynamic Meals Groupings (默认 3 餐：第 1 餐、第 2 餐、第 3 餐) */}
      <section className="space-y-4" aria-label="各餐记录明细">
        {mealList.map(({ type, name, index }) => {
          const mealItems = logs.filter(item => matchesMeal(item.mealType, type));
          const mealCal = mealItems.reduce(
            (sum, i) => sum + (i.nutrition.calories || 0),
            0
          );

          return (
            <div
              key={type}
              className="bg-white card-border rounded-xl p-4 space-y-3"
            >
              {/* Meal Header (no divider line, relying on generous vertical whitespace) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-neutral-900">{name}</h3>
                  <span className="text-xs font-bold text-neutral-700 tabular-nums">
                    {mealCal}{' '}
                    <span className="font-normal text-[11px] text-neutral-400">
                      千卡
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {index > 3 && mealItems.length === 0 && index === totalMeals && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMeal(index)}
                      aria-label={`移除${name}`}
                      className="text-xs text-neutral-400 hover:text-neutral-700 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors"
                      title="移除此餐"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}

                  <button
                    id={`btn-record-${type}`}
                    type="button"
                    onClick={() => onOpenRecord(type)}
                    aria-label={`记录${name}`}
                    className="text-xs font-semibold text-neutral-900 hover:text-black bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg transition-colors min-h-[44px] flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-black"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" strokeWidth={2.5} />
                    <span>记录</span>
                  </button>
                </div>
              </div>

              {/* 仅在有记录时展示列表，无记录时不输出多余空状态行，保持极致轻盈 */}
              {mealItems.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {mealItems.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2.5 hover:bg-[#FAFAFA] rounded-lg transition-colors px-1 -mx-1"
                    >
                      <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                        <div className="text-[13px] font-semibold text-neutral-900 truncate">
                          {item.foodName}
                          <span className="ml-2 text-neutral-400 font-normal text-xs tabular-nums">
                            {item.grams}g
                          </span>
                        </div>
                        <div className="text-xs text-neutral-400 truncate tabular-nums">
                          蛋白 {item.nutrition.protein}g · 碳水 {item.nutrition.carbs}g · 脂肪 {item.nutrition.fat}g
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-neutral-900 tabular-nums">
                          {item.nutrition.calories}{' '}
                          <span className="text-[11px] font-normal text-neutral-400">
                            千卡
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => onDeleteLog(item.id)}
                          aria-label={`移除 ${item.foodName} 记录`}
                          className="text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-black"
                          title="删除此项"
                        >
                          <X className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Add Meal Action */}
        <div className="pt-1 flex items-center justify-center">
          <button
            type="button"
            onClick={handleAddMeal}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-black bg-white hover:bg-neutral-50 card-border px-4 py-2.5 rounded-xl transition-colors min-h-[44px]"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" strokeWidth={2.5} />
            <span>添加第 {totalMeals + 1} 餐</span>
          </button>
        </div>
      </section>
    </div>
  );
};
