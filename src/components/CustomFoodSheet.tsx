import React, { useState, useRef, useEffect } from 'react';
import { Food } from '../types';
import { ChevronLeft, Plus, X, Check } from './icons';
import { generateUUID } from '../utils/storage';
import { calcCalories, parseNum } from '../utils/nutrition';

export interface CustomFoodSheetProps {
  isOpen: boolean;
  initialName?: string;
  initialFood?: Food | null;
  onBack: () => void;
  onSaved: (food: Food) => void;
  onNotify: (msg: string) => void;
}

const decimalRegex = /^\d*(\.\d{0,2})?$/;

export const CustomFoodSheet: React.FC<CustomFoodSheetProps> = ({
  isOpen,
  initialName = '',
  initialFood = null,
  onBack,
  onSaved,
  onNotify,
}) => {
  const [name, setName] = useState('');
  const [defaultGrams, setDefaultGrams] = useState<number>(100);
  const [proteinStr, setProteinStr] = useState('');
  const [carbsStr, setCarbsStr] = useState('');
  const [fatStr, setFatStr] = useState('');
  const [steps, setSteps] = useState<string[]>([]);

  const nameInputRef = useRef<HTMLInputElement | null>(null);

  // 初始化或切换食物时回填
  useEffect(() => {
    if (isOpen) {
      if (initialFood) {
        setName(initialFood.name);
        setDefaultGrams(initialFood.defaultGrams > 0 ? initialFood.defaultGrams : 100);
        setProteinStr(initialFood.nutrition.protein > 0 ? String(initialFood.nutrition.protein) : '');
        setCarbsStr(initialFood.nutrition.carbs > 0 ? String(initialFood.nutrition.carbs) : '');
        setFatStr(initialFood.nutrition.fat > 0 ? String(initialFood.nutrition.fat) : '');
        setSteps(initialFood.steps || []);
      } else {
        setName(initialName);
        setDefaultGrams(100);
        setProteinStr('');
        setCarbsStr('');
        setFatStr('');
        setSteps([]);
      }
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, initialName, initialFood]);

  // 纯派生计算：任何宏量变动即时触发，不乘克重，不保留任何可编辑热量状态与锁定标志
  const parsedProtein = parseNum(proteinStr);
  const parsedCarbs = parseNum(carbsStr);
  const parsedFat = parseNum(fatStr);

  const calories = calcCalories({
    protein: parsedProtein,
    carbs: parsedCarbs,
    fat: parsedFat,
  });

  if (!isOpen) return null;

  const baseName = initialFood ? initialFood.name : initialName;
  const initialProtein = initialFood && initialFood.nutrition.protein > 0 ? String(initialFood.nutrition.protein) : '';
  const initialCarbs = initialFood && initialFood.nutrition.carbs > 0 ? String(initialFood.nutrition.carbs) : '';
  const initialFat = initialFood && initialFood.nutrition.fat > 0 ? String(initialFood.nutrition.fat) : '';

  const isDirty =
    Boolean(name.trim() && name !== baseName) ||
    Boolean(proteinStr !== initialProtein) ||
    Boolean(carbsStr !== initialCarbs) ||
    Boolean(fatStr !== initialFat) ||
    steps.length !== (initialFood?.steps?.length || 0);

  // 保存按钮禁用条件：名称为空 ∨ defaultGrams ≤ 0 ∨ 三项宏量全部 ≤ 0
  const isMacrosEmpty = parsedProtein <= 0 && parsedCarbs <= 0 && parsedFat <= 0;
  const isNameEmpty = !name.trim();
  const isGramsInvalid = !defaultGrams || defaultGrams <= 0;
  const isSaveDisabled = isNameEmpty || isGramsInvalid || isMacrosEmpty;

  const handleSafeBack = () => {
    if (isDirty) {
      const ok = window.confirm('当前自建内容尚未保存，确定要放弃吗？');
      if (!ok) return;
    }
    onBack();
  };

  const handleProteinChange = (val: string) => {
    if (decimalRegex.test(val)) {
      setProteinStr(val);
    }
  };

  const handleCarbsChange = (val: string) => {
    if (decimalRegex.test(val)) {
      setCarbsStr(val);
    }
  };

  const handleFatChange = (val: string) => {
    if (decimalRegex.test(val)) {
      setFatStr(val);
    }
  };

  const handleAddStep = () => {
    setSteps(prev => [...prev, '']);
  };

  const handleUpdateStep = (index: number, val: string) => {
    setSteps(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleRemoveStep = (index: number) => {
    setSteps(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaveDisabled) {
      if (isNameEmpty) {
        onNotify('请填写食物名称');
        nameInputRef.current?.focus();
      } else if (isGramsInvalid) {
        onNotify('每份参考克重需大于 0');
      } else if (isMacrosEmpty) {
        onNotify('请至少填写一项营养素');
      }
      return;
    }

    const cleanName = name.trim();
    const gramsNum = Number(defaultGrams) || 100;

    const newFood: Food = {
      id: initialFood ? initialFood.id : generateUUID(),
      name: cleanName,
      source: 'custom',
      defaultGrams: gramsNum,
      nutrition: {
        calories,
        protein: parsedProtein,
        carbs: parsedCarbs,
        fat: parsedFat,
      },
      steps: steps.map(s => s.trim()).filter(Boolean),
      createdAt: initialFood ? initialFood.createdAt : Date.now(),
    };

    onSaved(newFood);
  };

  const pageTitle = initialFood ? '编辑自建食物' : '自建食物';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-food-title"
      className="fixed inset-0 z-50 bg-[#FAFAFA] flex flex-col max-w-xl mx-auto overflow-y-auto"
    >
      {/* Top Bar */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-[#E0E0E0] px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={handleSafeBack}
          aria-label="返回食物搜索"
          className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-black py-2 px-2 -ml-2 rounded-lg transition-colors min-h-[44px] min-w-[44px]"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" strokeWidth={2.5} />
          <span>返回搜索</span>
        </button>

        <h1 id="custom-food-title" className="text-sm font-bold text-neutral-900">
          {pageTitle}
        </h1>

        <div className="w-16 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaveDisabled}
            className={`text-xs font-bold py-2 px-2 min-h-[44px] flex items-center transition-colors ${
              isSaveDisabled
                ? 'text-neutral-300 cursor-not-allowed'
                : 'text-black hover:text-neutral-700 cursor-pointer'
            }`}
          >
            保存
          </button>
        </div>
      </header>

      {/* Form Content */}
      <main className="p-4 space-y-4 max-w-lg mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card 1: 基础属性 */}
          <section className="bg-white card-border rounded-xl p-4 space-y-3.5" aria-label="食物基础信息">
            <h2 className="text-xs font-bold text-neutral-900">基础信息</h2>

            <div className="space-y-1">
              <label htmlFor="custom-food-name" className="block text-xs font-medium text-neutral-600">
                食物或菜品名称 <span className="text-neutral-400">*</span>
              </label>
              <input
                ref={nameInputRef}
                id="custom-food-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="如：香煎巴沙鱼柳、低脂香蕉燕麦饼"
                required
                className="w-full h-11 px-3 bg-white card-border rounded-lg text-sm text-neutral-950 placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-black"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="custom-food-grams" className="block text-xs font-medium text-neutral-600">
                单份参考克重 (g) <span className="text-neutral-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="custom-food-grams"
                  type="number"
                  min="1"
                  max="5000"
                  value={defaultGrams}
                  onChange={e => setDefaultGrams(Number(e.target.value))}
                  required
                  className="w-full h-11 px-3 bg-white card-border rounded-lg text-sm text-neutral-950 focus-visible:outline-2 focus-visible:outline-black"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 pointer-events-none">
                  克 / 份
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                记录时可按实际进食克数换算，常规默认单份为 100g。
              </p>
            </div>
          </section>

          {/* Card 2: 单份营养含量（纯白卡片，divide-[#E0E0E0] 分隔，无阴影） */}
          <section
            className="bg-white card-border rounded-xl p-4 divide-y divide-[#E0E0E0] space-y-3.5"
            aria-label="营养成分参考"
          >
            <div>
              <h2 className="text-xs font-bold text-neutral-900">单份营养成分</h2>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                填写每 {defaultGrams || 100}g 的营养素含量
              </p>
            </div>

            {/* 热量静态展示行：只读派生值 */}
            <div className="pt-3.5 space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-neutral-700">热量</span>
                <span className="text-base font-bold text-neutral-950">
                  {calories > 0 ? `${calories} 千卡` : '—'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                自动计算：蛋白质×4 + 碳水×4 + 脂肪×9
              </p>
            </div>

            {/* 三大营养素输入：inputMode="decimal" 与正则限制 */}
            <div className="pt-3.5">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="space-y-1">
                  <label htmlFor="custom-food-protein" className="block text-xs font-medium text-neutral-600">
                    蛋白质 (g)
                  </label>
                  <input
                    id="custom-food-protein"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0"
                    value={proteinStr}
                    onChange={e => handleProteinChange(e.target.value)}
                    className="w-full h-10 px-2.5 bg-white card-border rounded-lg text-sm text-neutral-950 focus-visible:outline-2 focus-visible:outline-black"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="custom-food-carbs" className="block text-xs font-medium text-neutral-600">
                    碳水 (g)
                  </label>
                  <input
                    id="custom-food-carbs"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0"
                    value={carbsStr}
                    onChange={e => handleCarbsChange(e.target.value)}
                    className="w-full h-10 px-2.5 bg-white card-border rounded-lg text-sm text-neutral-950 focus-visible:outline-2 focus-visible:outline-black"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="custom-food-fat" className="block text-xs font-medium text-neutral-600">
                    脂肪 (g)
                  </label>
                  <input
                    id="custom-food-fat"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0"
                    value={fatStr}
                    onChange={e => handleFatChange(e.target.value)}
                    className="w-full h-10 px-2.5 bg-white card-border rounded-lg text-sm text-neutral-950 focus-visible:outline-2 focus-visible:outline-black"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Card 3: 烹饪制作步骤 (可选) */}
          <section className="bg-white card-border rounded-xl p-4 space-y-3" aria-label="制作做法模块">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold text-neutral-900">烹饪步骤 (可选)</h2>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  若是自己常做的特色私房菜，可在此记录烹饪秘诀
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddStep}
                aria-label="新增一个烹饪步骤"
                className="text-xs font-semibold text-neutral-900 hover:text-black bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg transition-colors min-h-[44px] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" strokeWidth={2.5} />
                <span>加步骤</span>
              </button>
            </div>

            {steps.length === 0 ? (
              <div className="text-center py-4 text-xs text-neutral-400 border border-dashed border-[#E0E0E0] rounded-lg">
                暂未添加步骤，如需备忘可点击上方按钮添加
              </div>
            ) : (
              <div className="space-y-2.5">
                {steps.map((stepText, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="shrink-0 w-6 h-10 flex items-center justify-center text-xs font-semibold text-neutral-400">
                      {idx + 1}.
                    </span>
                    <textarea
                      rows={2}
                      value={stepText}
                      onChange={e => handleUpdateStep(idx, e.target.value)}
                      placeholder={`步骤 ${idx + 1} 具体操作...`}
                      aria-label={`第 ${idx + 1} 步烹饪说明`}
                      className="flex-1 p-2.5 bg-white card-border rounded-lg text-xs text-neutral-900 focus-visible:outline-2 focus-visible:outline-black resize-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      aria-label={`移除第 ${idx + 1} 步`}
                      className="text-neutral-400 hover:text-red-500 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Bottom Submit Button & Inline Hint */}
          <div className="pt-2 pb-6 space-y-2">
            {isMacrosEmpty && (
              <p className="text-center text-xs text-neutral-500 font-medium">
                填写任意一项营养素，热量会自动算好
              </p>
            )}
            <button
              type="submit"
              disabled={isSaveDisabled}
              className={`w-full h-12 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-black shadow-none ${
                isSaveDisabled
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-[#E0E0E0]'
                  : 'bg-black hover:bg-neutral-800 text-white cursor-pointer'
              }`}
            >
              <Check className="w-4 h-4" aria-hidden="true" strokeWidth={2.5} />
              <span>保存并继续确认份量</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
