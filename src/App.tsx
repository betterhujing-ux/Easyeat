import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Food, LogEntry, DailyTargets, MealType } from './types';
import {
  getAllFoods,
  saveCustomFood,
  getTodayDateString,
  getDailyLogs,
  saveDailyLogs,
  addLogEntry,
  removeLogEntry,
  getDailyTargets,
} from './utils/storage';
import { DietTracker } from './components/DietTracker';
import { FoodSearchSheet } from './components/FoodSearchSheet';
import { CustomFoodSheet } from './components/CustomFoodSheet';
import { PortionConfirmSheet } from './components/PortionConfirmSheet';

type SheetType = 'search' | 'create' | 'portion' | null;

interface ToastState {
  message: string;
  onUndo?: () => void;
}

export default function App() {
  // Main Data States
  const [currentDate, setCurrentDate] = useState<string>(getTodayDateString());
  const [dailyLogs, setDailyLogs] = useState<LogEntry[]>([]);
  const [dailyTargets, setDailyTargets] = useState<DailyTargets>(getDailyTargets());
  const [allFoods, setAllFoods] = useState<Food[]>([]);

  // Sheet Layer Navigation States
  const [activeMealType, setActiveMealType] = useState<MealType>('lunch');
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [createFoodPrefillName, setCreateFoodPrefillName] = useState<string>('');
  const [editingCustomFood, setEditingCustomFood] = useState<Food | null>(null);

  // Toast with Undo
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingDeletedRef = useRef<{
    date: string;
    item: LogEntry;
    index: number;
  } | null>(null);

  // Initialize
  useEffect(() => {
    setAllFoods(getAllFoods());
    setDailyLogs(getDailyLogs(currentDate));
    setDailyTargets(getDailyTargets());
  }, []);

  // Reload logs on date change
  useEffect(() => {
    setDailyLogs(getDailyLogs(currentDate));
  }, [currentDate]);

  // Prevent background scroll when any sheet is open
  useEffect(() => {
    if (activeSheet !== null) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [activeSheet]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // Regular toast notification
  const showNotice = useCallback((msg: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    pendingDeletedRef.current = null;
    setToast({ message: msg });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 2500);
  }, []);

  // Esc key closes top layer
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;

      if (activeSheet === 'create') {
        // Handled in CustomFoodSheet or fallback to search
        setActiveSheet('search');
      } else if (activeSheet === 'portion') {
        // Return to search
        setActiveSheet('search');
      } else if (activeSheet === 'search') {
        // Return to main view
        setActiveSheet(null);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [activeSheet]);

  // Start recording flow from meal card
  const handleOpenRecordFlow = (meal: MealType) => {
    setActiveMealType(meal);
    setSelectedFood(null);
    setCreateFoodPrefillName('');
    setActiveSheet('search');
  };

  // Selecting a food from Sheet 1 -> Opens Sheet 3 (份量确认)
  const handleSelectFoodFromSearch = (food: Food) => {
    setSelectedFood(food);
    setActiveSheet('portion');
  };

  // Triggering custom food creation from Sheet 1 -> Opens Sheet 2 (自建食物)
  const handleStartCreateCustom = (prefillName = '') => {
    setEditingCustomFood(null);
    setCreateFoodPrefillName(prefillName);
    setActiveSheet('create');
  };

  // Editing existing custom food
  const handleEditCustomFood = (food: Food) => {
    setEditingCustomFood(food);
    setCreateFoodPrefillName(food.name);
    setActiveSheet('create');
  };

  // Saving custom food in Sheet 2 -> Saves and immediately proceeds to Sheet 3 (份量确认)
  const handleCustomFoodSaved = (newFood: Food) => {
    const isEditing = Boolean(editingCustomFood);
    const updatedFoods = saveCustomFood(newFood);
    setAllFoods(updatedFoods);
    setEditingCustomFood(null);
    setSelectedFood(newFood);
    setActiveSheet('portion');
    showNotice(isEditing ? `已更新自建食物「${newFood.name}」` : `已建立自建食物「${newFood.name}」`);
  };

  // Confirming portion in Sheet 3 -> Saves log entry and returns to main view
  const handleConfirmLogEntry = (entry: LogEntry) => {
    const updated = addLogEntry(currentDate, entry);
    setDailyLogs(updated);
    setActiveSheet(null);
    setSelectedFood(null);
    showNotice(`已记入饮食：${entry.foodName} (${entry.grams}克)`);
  };

  // Delete log entry with Undo
  const handleDeleteLogItem = (id: string) => {
    const itemIndex = dailyLogs.findIndex(i => i.id === id);
    const itemToDelete = dailyLogs[itemIndex];
    if (!itemToDelete) return;

    const updated = removeLogEntry(currentDate, id);
    setDailyLogs(updated);

    pendingDeletedRef.current = {
      date: currentDate,
      item: itemToDelete,
      index: itemIndex,
    };

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    const handleUndo = () => {
      const pending = pendingDeletedRef.current;
      if (!pending) return;

      const currentLogs = getDailyLogs(pending.date);
      const restored = [...currentLogs];
      restored.splice(pending.index, 0, pending.item);
      saveDailyLogs(pending.date, restored);

      if (pending.date === currentDate) {
        setDailyLogs(restored);
      }

      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
      pendingDeletedRef.current = null;
      setToast(null);
    };

    setToast({
      message: `已删除「${itemToDelete.foodName}」`,
      onUndo: handleUndo,
    });

    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      pendingDeletedRef.current = null;
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans antialiased">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-3 focus:py-2 focus:bg-black focus:text-white focus:text-xs focus:rounded-lg"
      >
        跳至主要内容
      </a>

      {/* Toast Notice */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-4 py-2.5 rounded-full z-50 flex items-center gap-3 animate-fadeIn"
        >
          <span>{toast.message}</span>
          {toast.onUndo && (
            <button
              type="button"
              onClick={toast.onUndo}
              aria-label="撤销删除"
              className="text-white font-bold underline hover:text-neutral-300 transition-colors ml-1"
            >
              撤销
            </button>
          )}
        </div>
      )}

      {/* Main Single-View Container */}
      <main id="main-content" className="max-w-xl mx-auto px-4 pt-5 pb-16">
        <header className="mb-4">
          <h1 className="text-xl font-bold tracking-tight text-neutral-950">
            今日饮食
          </h1>
        </header>

        {/* Main View: Diet Tracker */}
        <DietTracker
          currentDate={currentDate}
          logs={dailyLogs}
          targets={dailyTargets}
          onDateChange={setCurrentDate}
          onOpenRecord={handleOpenRecordFlow}
          onDeleteLog={handleDeleteLogItem}
        />
      </main>

      {/* Sheet 1: 食物搜索（全屏） */}
      <FoodSearchSheet
        isOpen={activeSheet === 'search'}
        mealType={activeMealType}
        dateStr={currentDate}
        foods={allFoods}
        onSelectFood={handleSelectFoodFromSearch}
        onCreateCustom={handleStartCreateCustom}
        onEditCustom={handleEditCustomFood}
        onClose={() => setActiveSheet(null)}
      />

      {/* Sheet 2: 自建食物表单（全屏，在 Sheet 1 之上） */}
      <CustomFoodSheet
        isOpen={activeSheet === 'create'}
        initialName={createFoodPrefillName}
        initialFood={editingCustomFood}
        onBack={() => {
          setActiveSheet('search');
          setEditingCustomFood(null);
        }}
        onSaved={handleCustomFoodSaved}
        onNotify={showNotice}
      />

      {/* Sheet 3: 份量确认（半屏） */}
      <PortionConfirmSheet
        isOpen={activeSheet === 'portion'}
        food={selectedFood}
        mealType={activeMealType}
        dateStr={currentDate}
        onConfirm={handleConfirmLogEntry}
        onBack={() => setActiveSheet('search')}
        onClose={() => setActiveSheet(null)}
      />
    </div>
  );
}
