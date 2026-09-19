import React from 'react';
import { Recipe } from '../types';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  onDeleteCustom?: (id: string) => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({
  recipe,
  onBack,
  onDeleteCustom,
}) => {
  return (
    <article id="recipe-detail-view" className="space-y-4 animate-fadeIn">
      {/* Top back button */}
      <div className="flex items-center justify-between">
        <button
          id="btn-recipe-back"
          type="button"
          aria-label="返回食谱列表"
          onClick={onBack}
          className="text-xs font-semibold text-neutral-800 bg-white card-border hover:border-neutral-400 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 min-h-[32px]"
        >
          <svg aria-hidden="true" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>返回食谱库</span>
        </button>

        {recipe.isCustom && onDeleteCustom && (
          <button
            id="btn-recipe-delete"
            type="button"
            aria-label={`删除自建食谱《${recipe.title}》`}
            onClick={() => {
              if (window.confirm(`确认删除自建食谱《${recipe.title}》吗？`)) {
                onDeleteCustom(recipe.id);
                onBack();
              }
            }}
            className="text-xs text-neutral-400 hover:text-red-600 transition-colors py-1.5 px-2"
          >
            删除此自建食谱
          </button>
        )}
      </div>

      {/* Header Card */}
      <header className="bg-white card-border rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
          <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded text-[11px] font-medium">{recipe.category}</span>
          <span aria-hidden="true" className="text-neutral-200">·</span>
          <span>用时约 {recipe.prepMinutes} 分钟</span>
          <span aria-hidden="true" className="text-neutral-200">·</span>
          <span>难度 {recipe.difficulty}</span>
        </div>

        <h1 className="text-lg font-bold text-neutral-950 tracking-tight leading-snug">
          {recipe.title}
        </h1>

        <p className="text-xs text-neutral-500 leading-relaxed font-normal">
          {recipe.summary}
        </p>
      </header>

      {/* Nutrition Breakdown Block */}
      <section className="bg-white card-border rounded-xl p-4 space-y-3" aria-label="单份营养成分">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-neutral-900 tracking-wider">营养成分 (单份)</h2>
          <span className="text-xs text-neutral-400">营养成分预估</span>
        </div>

        <div className="grid grid-cols-4 gap-2 pt-0.5">
          <div className="bg-[#FAFAFA] border border-neutral-100 rounded-lg py-2.5 px-1 text-center">
            <span className="block text-[11px] text-neutral-400">热量</span>
            <span className="block text-base font-extrabold text-neutral-950 my-0.5">{recipe.totalCal}</span>
            <span className="block text-[10px] text-neutral-400">千卡</span>
          </div>
          <div className="bg-[#FAFAFA] border border-neutral-100 rounded-lg py-2.5 px-1 text-center">
            <span className="block text-[11px] text-neutral-400">蛋白质</span>
            <span className="block text-base font-extrabold text-neutral-950 my-0.5">{recipe.totalProtein}</span>
            <span className="block text-[10px] text-neutral-400">克</span>
          </div>
          <div className="bg-[#FAFAFA] border border-neutral-100 rounded-lg py-2.5 px-1 text-center">
            <span className="block text-[11px] text-neutral-400">碳水</span>
            <span className="block text-base font-extrabold text-neutral-950 my-0.5">{recipe.totalCarbs}</span>
            <span className="block text-[10px] text-neutral-400">克</span>
          </div>
          <div className="bg-[#FAFAFA] border border-neutral-100 rounded-lg py-2.5 px-1 text-center">
            <span className="block text-[11px] text-neutral-400">脂肪</span>
            <span className="block text-base font-extrabold text-neutral-950 my-0.5">{recipe.totalFat}</span>
            <span className="block text-[10px] text-neutral-400">克</span>
          </div>
        </div>
      </section>

      {/* Ingredients List */}
      <section className="bg-white card-border rounded-xl p-4 space-y-2.5" aria-label="准备食材">
        <h2 className="text-xs font-bold text-neutral-900 tracking-tight">准备食材</h2>

        <ul className="space-y-1 list-none m-0 p-0">
          {recipe.ingredients.map((ing, idx) => (
            <li key={idx} className="flex items-center justify-between py-1.5 border-b border-neutral-100/60 last:border-0">
              <span className="text-xs text-neutral-800 font-medium">{ing.name}</span>
              <div className="text-right">
                <span className="text-xs font-semibold text-neutral-900">
                  {ing.amount} {ing.unit}
                </span>
                {ing.cal !== undefined && (
                  <span className="ml-1.5 text-[10px] text-neutral-400">
                    ({ing.cal} 千卡)
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Cooking Steps */}
      <section className="bg-white card-border rounded-xl p-4 space-y-3" aria-label="烹饪步骤">
        <h2 className="text-xs font-bold text-neutral-900 tracking-tight">烹饪步骤</h2>

        <ol className="space-y-3 list-none m-0 p-0">
          {recipe.steps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span aria-hidden="true" className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-xs text-neutral-700 leading-relaxed flex-1 pt-0.5">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Pro Tips / Insights */}
      {recipe.tips && (
        <section className="bg-[#FAFAFA] card-border rounded-xl p-3.5 space-y-1.5" aria-label="烹饪要点">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
            <svg aria-hidden="true" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>烹饪要点</span>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            {recipe.tips}
          </p>
        </section>
      )}
    </article>
  );
};
