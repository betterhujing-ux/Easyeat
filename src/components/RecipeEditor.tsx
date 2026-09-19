import React, { useState } from 'react';
import { Recipe, Ingredient } from '../types';
import { FOODS_DATABASE } from '../data/foodDatabase';

interface RecipeEditorProps {
  onSave: (recipe: Recipe) => void;
  onCancel: () => void;
}

export const RecipeEditor: React.FC<RecipeEditorProps> = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('高蛋白');
  const [prepMinutes, setPrepMinutes] = useState(15);
  const [difficulty, setDifficulty] = useState<'简单' | '适中' | '进阶'>('简单');
  const [tips, setTips] = useState('');

  // Dynamic ingredients
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '鸡胸肉', amount: 150, unit: 'g', cal: 200, protein: 36.9, fat: 2.8, carbs: 3.7 },
  ]);

  // Dynamic steps
  const [steps, setSteps] = useState<string[]>([
    '食材洗净处理切块备用。',
    '锅中加水或少许橄榄油加热，烹饪至熟透入味。'
  ]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: 100, unit: 'g', cal: 100, protein: 10, fat: 2, carbs: 10 }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, idx) => idx !== index));
  };

  const handleIngredientChange = (index: number, field: keyof Ingredient, val: any) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: val };

    // Auto calculate nutritional data if user selected or typed a recognized name
    if (field === 'name') {
      const match = FOODS_DATABASE.find(f => f.name.includes(val) || val.includes(f.name.split(' ')[0]));
      if (match) {
        const ratio = (updated[index].amount || 100) / 100;
        updated[index].cal = Math.round(match.cal * ratio);
        updated[index].protein = parseFloat((match.protein * ratio).toFixed(1));
        updated[index].fat = parseFloat((match.fat * ratio).toFixed(1));
        updated[index].carbs = parseFloat((match.carbs * ratio).toFixed(1));
      }
    } else if (field === 'amount') {
      const match = FOODS_DATABASE.find(f => f.name.includes(updated[index].name) || updated[index].name.includes(f.name.split(' ')[0]));
      if (match) {
        const ratio = (Number(val) || 100) / 100;
        updated[index].cal = Math.round(match.cal * ratio);
        updated[index].protein = parseFloat((match.protein * ratio).toFixed(1));
        updated[index].fat = parseFloat((match.fat * ratio).toFixed(1));
        updated[index].carbs = parseFloat((match.carbs * ratio).toFixed(1));
      }
    }

    setIngredients(updated);
  };

  const handleAddStep = () => {
    setSteps([...steps, '']);
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, idx) => idx !== index));
  };

  const handleStepChange = (index: number, val: string) => {
    const updated = [...steps];
    updated[index] = val;
    setSteps(updated);
  };

  const totalCal = ingredients.reduce((sum, i) => sum + (Number(i.cal) || 0), 0);
  const totalProtein = parseFloat(ingredients.reduce((sum, i) => sum + (Number(i.protein) || 0), 0).toFixed(1));
  const totalFat = parseFloat(ingredients.reduce((sum, i) => sum + (Number(i.fat) || 0), 0).toFixed(1));
  const totalCarbs = parseFloat(ingredients.reduce((sum, i) => sum + (Number(i.carbs) || 0), 0).toFixed(1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('请填写菜谱名称');
      return;
    }

    const newRecipe: Recipe = {
      id: 'custom-' + Date.now(),
      title: title.trim(),
      summary: summary.trim() || '自创日常健康菜谱',
      category,
      prepMinutes: Number(prepMinutes) || 15,
      difficulty,
      servings: 1,
      ingredients: ingredients.filter(i => i.name.trim() !== ''),
      steps: steps.filter(s => s.trim() !== ''),
      tips: tips.trim() || undefined,
      isCustom: true,
      createdAt: new Date().toISOString().split('T')[0],
      totalCal,
      totalProtein,
      totalFat,
      totalCarbs,
    };

    onSave(newRecipe);
  };

  return (
    <div id="recipe-editor-view" className="space-y-4 animate-fadeIn pb-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-semibold text-neutral-600 bg-white card-border hover:border-neutral-400 px-3 py-1.5 rounded-lg min-h-[32px] transition-colors"
        >
          取消
        </button>
        <h2 className="text-sm font-bold text-neutral-900">记录私房食谱</h2>
        <div className="w-12" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" aria-label="创建私房食谱表单">
        {/* Base Info */}
        <div className="bg-white card-border rounded-xl p-4 space-y-3">
          <div>
            <label htmlFor="editor-recipe-title" className="block text-xs font-bold text-neutral-800 mb-1.5">
              食谱名称 <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="editor-recipe-title"
              type="text"
              required
              aria-required="true"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="例如：少油黑椒鸡胸肉丸"
              className="w-full bg-white border border-[#E0E0E0] text-neutral-900 text-xs rounded-lg px-3 py-2 outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label htmlFor="editor-recipe-summary" className="block text-xs font-bold text-neutral-800 mb-1.5">
              一句话简介
            </label>
            <textarea
              id="editor-recipe-summary"
              rows={2}
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="简述这道菜的特点，如：口感脆嫩、高蛋白快手..."
              className="w-full bg-white border border-[#E0E0E0] text-neutral-900 text-xs rounded-lg px-3 py-2 outline-none focus:border-black resize-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor="editor-recipe-category" className="block text-[11px] font-bold text-neutral-700 mb-1">分类</label>
              <select
                id="editor-recipe-category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-white border border-[#E0E0E0] text-neutral-900 text-xs rounded-lg px-2 py-1.5 outline-none min-h-[34px] focus:border-black"
              >
                <option value="高蛋白">高蛋白</option>
                <option value="低脂正餐">低脂正餐</option>
                <option value="低卡暖汤">低卡暖汤</option>
                <option value="轻食沙拉">轻食沙拉</option>
                <option value="家常减脂">家常减脂</option>
              </select>
            </div>

            <div>
              <label htmlFor="editor-recipe-prep-time" className="block text-[11px] font-bold text-neutral-700 mb-1">用时(分)</label>
              <input
                id="editor-recipe-prep-time"
                type="number"
                inputMode="numeric"
                min="1"
                max="600"
                value={prepMinutes}
                onChange={e => setPrepMinutes(Number(e.target.value))}
                className="w-full bg-white border border-[#E0E0E0] text-neutral-900 text-xs rounded-lg px-2 py-1.5 outline-none min-h-[34px] focus:border-black"
              />
            </div>

            <div>
              <label htmlFor="editor-recipe-difficulty" className="block text-[11px] font-bold text-neutral-700 mb-1">难度</label>
              <select
                id="editor-recipe-difficulty"
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as any)}
                className="w-full bg-white border border-[#E0E0E0] text-neutral-900 text-xs rounded-lg px-2 py-1.5 outline-none min-h-[34px] focus:border-black"
              >
                <option value="简单">简单</option>
                <option value="适中">适中</option>
                <option value="进阶">进阶</option>
              </select>
            </div>
          </div>
        </div>

        {/* Nutritional Summary Preview */}
        <div className="bg-white card-border rounded-xl p-4 space-y-2" aria-label="全道菜参考营养">
          <div className="text-[11px] text-neutral-400 font-medium">全道菜参考营养</div>
          <div className="grid grid-cols-4 divide-x divide-[#E0E0E0] py-1 text-center">
            <div className="px-1">
              <span className="block text-[11px] text-neutral-400 font-medium">热量</span>
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
        </div>

        {/* Ingredients */}
        <div className="bg-white card-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900">所需食材</span>
            <button
              type="button"
              onClick={handleAddIngredient}
              className="text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded-md min-h-[30px]"
            >
              + 添加食材
            </button>
          </div>

          <div className="space-y-2">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="食材名称"
                  aria-label={`第 ${idx + 1} 种食材名称`}
                  value={ing.name}
                  onChange={e => handleIngredientChange(idx, 'name', e.target.value)}
                  className="flex-1 bg-white border border-[#E0E0E0] text-neutral-900 text-xs rounded-lg px-2.5 py-1.5 outline-none min-h-[34px] focus:border-black"
                />
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="克数"
                  aria-label={`第 ${idx + 1} 种食材克数`}
                  value={ing.amount}
                  onChange={e => handleIngredientChange(idx, 'amount', Number(e.target.value))}
                  className="w-16 bg-white border border-[#E0E0E0] text-neutral-900 text-xs rounded-lg px-1.5 py-1.5 text-center outline-none min-h-[34px] focus:border-black"
                />
                <span className="text-xs text-neutral-400 w-5">{ing.unit}</span>
                <button
                  type="button"
                  aria-label={`删除第 ${idx + 1} 种食材`}
                  onClick={() => handleRemoveIngredient(idx)}
                  className="text-neutral-400 hover:text-red-500 text-sm px-2 py-1 min-w-[28px] min-h-[28px]"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white card-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900">制作步骤</span>
            <button
              type="button"
              onClick={handleAddStep}
              className="text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded-md min-h-[30px]"
            >
              + 添加制作步骤
            </button>
          </div>

          <div className="space-y-2.5">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span aria-hidden="true" className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-1">
                  {idx + 1}
                </span>
                <textarea
                  rows={2}
                  placeholder={`第 ${idx + 1} 步说明...`}
                  aria-label={`第 ${idx + 1} 步说明`}
                  value={step}
                  onChange={e => handleStepChange(idx, e.target.value)}
                  className="flex-1 bg-white border border-[#E0E0E0] text-neutral-900 text-xs rounded-lg px-2.5 py-1.5 outline-none resize-none focus:border-black"
                />
                <button
                  type="button"
                  aria-label={`删除第 ${idx + 1} 步`}
                  onClick={() => handleRemoveStep(idx)}
                  className="text-neutral-400 hover:text-red-500 text-sm mt-1.5 px-2 py-1 min-w-[28px] min-h-[28px]"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white card-border rounded-xl p-4 space-y-1.5">
          <label htmlFor="editor-recipe-tips" className="block text-xs font-bold text-neutral-800">制作心得与贴士 (选填)</label>
          <textarea
            id="editor-recipe-tips"
            rows={2}
            value={tips}
            onChange={e => setTips(e.target.value)}
            placeholder="例如：肉片逆纹切更嫩，出锅前淋少许柠檬汁去腥..."
            className="w-full bg-white border border-[#E0E0E0] text-neutral-900 text-xs rounded-lg px-2.5 py-1.5 outline-none resize-none focus:border-black"
          />
        </div>

        {/* Save button */}
        <button
          type="submit"
          className="w-full bg-black text-white font-bold text-xs py-2.5 rounded-xl hover:bg-neutral-800 transition-colors min-h-[40px]"
        >
          保存这份私房食谱
        </button>
      </form>
    </div>
  );
};
