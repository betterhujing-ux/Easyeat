import React, { useMemo, useRef, useEffect } from 'react';
import { LogEntry, MealType, DailyTargets } from '../types';
import { getTodayDateString } from '../utils/storage';
import { Plus, X, RotateCcw } from './icons';

interface DietTrackerProps {
  currentDate: string;
  logs: LogEntry[];
  targets: DailyTargets;
  onDateChange: (newDate: string) => void;
  onOpenRecord: (mealType: MealType) => void;
  onDeleteLog: (id: string) => void;
}

const MEAL_CONFIG: { type: MealType; name: string }[] = [
  { type: 'breakfast', name: '早餐' },
  { type: 'lunch', name: '午餐' },
  { type: 'dinner', name: '晚餐' },
  { type: 'snack', name: '加餐' },
];

interface MacroRingProps {
  label: string;
  current: number;
  target: number;
  unit: string;
}

const MacroRing: React.FC<MacroRingProps> = ({ label, current, target, unit }) => {
  const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  const radius = 21;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-15 h-15 flex items-center justify-center">
        <svg className="w-15 h-15 -rotate-90 transform" viewBox="0 0 54 54" aria-hidden="true">
          <circle
            cx="27"
            cy="27"
            r={radius}
            stroke="#EFEFEF"
            strokeWidth="4"
            fill="transparent"
          />
          <circle
            cx="27"
            cy="27"
            r={radius}
            stroke="#171717"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-neutral-900">{percentage}%</span>
        </div>
      </div>
      <span className="text-xs font-bold text-neutral-800 mt-1">{label}</span>
      <span className="text-[11px] text-neutral-400">
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

  return (
    <div id="diet-tracker-view" className="space-y-4">
      {/* 28-days Horizontal Date Selector */}
      <section
        className="bg-white card-border rounded-xl p-3 space-y-2.5"
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
              className="text-xs font-semibold text-neutral-700 hover:text-black flex items-center gap-1 py-1.5 px-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors min-h-[36px]"
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
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pt-0.5"
        >
          {daysList.map(item => {
            const isSelected = item.dateStr === currentDate;
            return (
              <button
                key={item.dateStr}
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
                className={`shrink-0 flex flex-col items-center justify-center w-11 h-14 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-black text-white'
                    : 'bg-[#FAFAFA] text-neutral-700 hover:bg-neutral-100 border border-[#E0E0E0]'
                }`}
              >
                <span className="text-[10px] leading-tight font-medium opacity-70">
                  {item.weekDayLabel}
                </span>
                <span className="text-sm font-bold leading-tight mt-0.5">
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
            );
          })}
        </div>
      </section>

      {/* Daily Overview Card with Macro Progress Rings & 4 Columns */}
      <section
        className="bg-white card-border rounded-xl p-4 space-y-4"
        aria-label="摄入概览与三大营养素达成"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-neutral-900 tracking-tight">
            {isToday ? '今日摄入概览' : `${displayDateText}摄入概览`}
          </h2>
          <span className="text-xs text-neutral-400">已记 {logs.length} 项</span>
        </div>

        {/* 4 Nutrient Columns */}
        <div className="grid grid-cols-4 divide-x divide-[#E0E0E0] py-1 text-center border-b border-[#E0E0E0] pb-3">
          <div className="px-1">
            <span className="block text-xs text-neutral-400 font-medium">总热量</span>
            <span className="block text-lg font-bold text-neutral-950 my-0.5 tracking-tight">
              {totalCal}
            </span>
            <span className="block text-[11px] text-neutral-400">千卡</span>
          </div>
          <div className="px-1">
            <span className="block text-xs text-neutral-400 font-medium">蛋白质</span>
            <span className="block text-lg font-bold text-neutral-950 my-0.5 tracking-tight">
              {totalProtein}
            </span>
            <span className="block text-[11px] text-neutral-400">克</span>
          </div>
          <div className="px-1">
            <span className="block text-xs text-neutral-400 font-medium">碳水</span>
            <span className="block text-lg font-bold text-neutral-950 my-0.5 tracking-tight">
              {totalCarbs}
            </span>
            <span className="block text-[11px] text-neutral-400">克</span>
          </div>
          <div className="px-1">
            <span className="block text-xs text-neutral-400 font-medium">脂肪</span>
            <span className="block text-lg font-bold text-neutral-950 my-0.5 tracking-tight">
              {totalFat}
            </span>
            <span className="block text-[11px] text-neutral-400">克</span>
          </div>
        </div>

        {/* 三大营养素环形进度 */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-600">三大营养素目标达成</span>
            <span className="text-[11px] text-neutral-400">
              目标总热量 {targets.calories} 千卡
            </span>
          </div>

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

      {/* Four Meals Groupings */}
      <section className="space-y-3" aria-label="四餐记录明细">
        {MEAL_CONFIG.map(({ type, name }) => {
          const mealItems = logs.filter(item => item.mealType === type);
          const mealCal = mealItems.reduce(
            (sum, i) => sum + (i.nutrition.calories || 0),
            0
          );

          return (
            <div
              key={type}
              className="bg-white card-border rounded-xl p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#E0E0E0]">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-neutral-900">{name}</h3>
                  <span className="text-xs font-bold text-neutral-700">
                    {mealCal}{' '}
                    <span className="font-normal text-[11px] text-neutral-400">
                      千卡
                    </span>
                  </span>
                </div>

                <button
                  id={`btn-record-${type}`}
                  type="button"
                  onClick={() => onOpenRecord(type)}
                  aria-label={`记录${name}`}
                  className="text-xs font-semibold text-neutral-900 hover:text-black bg-neutral-100 hover:bg-neutral-200 px-3.5 py-2 rounded-lg transition-colors min-h-[44px] flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-black"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" strokeWidth={2.5} />
                  <span>记录</span>
                </button>
              </div>

              {mealItems.length === 0 ? (
                <div className="py-2.5 flex items-center justify-between text-xs text-neutral-400">
                  <span>这一餐还没有记录</span>
                  <button
                    type="button"
                    onClick={() => onOpenRecord(type)}
                    className="text-xs font-semibold text-neutral-700 hover:text-black py-2 px-3 rounded hover:bg-neutral-100 transition-colors min-h-[44px] flex items-center"
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
                      <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                        <div className="text-[13px] font-semibold text-neutral-900 truncate">
                          {item.foodName}
                          <span className="ml-1.5 text-neutral-400 font-normal text-xs">
                            {item.grams}g
                          </span>
                        </div>
                        <div className="text-xs text-neutral-400 truncate">
                          蛋白 {item.nutrition.protein}g · 碳水 {item.nutrition.carbs}g · 脂肪 {item.nutrition.fat}g
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-neutral-900">
                          {item.nutrition.calories}{' '}
                          <span className="text-[11px] font-normal text-neutral-400">
                            千卡
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => onDeleteLog(item.id)}
                          aria-label={`移除 ${item.foodName} 记录`}
                          className="text-neutral-400 hover:text-red-500 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors"
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
      </section>
    </div>
  );
};
