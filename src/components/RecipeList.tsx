import React, { useState } from 'react';
import { Recipe } from '../types';

interface RecipeListProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onCreateNew: () => void;
}

const CATEGORIES = ['全部', '高蛋白', '低脂正餐', '低卡暖汤', '轻食沙拉', '我的自建'];

export const RecipeList: React.FC<RecipeListProps> = ({
  recipes,
  onSelectRecipe,
  onCreateNew,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory =
      selectedCategory === '全部'
        ? true
        : selectedCategory === '我的自建'
        ? recipe.isCustom
        : recipe.category === selectedCategory;

    const matchesSearch =
      searchQuery.trim() === '' ||
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div id="recipe-list-view" className="space-y-4">
      {/* Category Pills */}
      <div
        role="tablist"
        aria-label="食谱分类"
        className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar"
      >
        {CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              id={`cat-pill-${cat}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-tight whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-black text-white font-semibold'
                  : 'bg-white card-border text-neutral-600 hover:border-neutral-400'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="space-y-2.5">
        <div className="relative">
          <label htmlFor="recipe-search-input" className="sr-only">
            搜索食材或食谱名称
          </label>
          <input
            id="recipe-search-input"
            type="search"
            role="searchbox"
            aria-label="搜索食材或食谱名称"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索食材或食谱名称（如：鸡胸肉、沙拉）"
            className="w-full bg-white card-border text-neutral-900 placeholder:text-neutral-400 text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Section Header: Count and Action */}
        <div className="flex items-center justify-between px-0.5">
          <span aria-live="polite" className="text-xs text-neutral-400 tracking-tight">
            共 {filteredRecipes.length} 道健康食谱
          </span>
          <button
            id="btn-create-recipe"
            type="button"
            onClick={onCreateNew}
            aria-label="自建新菜谱"
            className="text-xs font-semibold text-neutral-900 bg-white card-border hover:border-neutral-400 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 min-h-[32px]"
          >
            <span aria-hidden="true">+</span>
            <span>自建新菜谱</span>
          </button>
        </div>
      </div>

      {/* Recipe Cards List */}
      <div className="space-y-3" role="feed" aria-label="食谱列表">
        {filteredRecipes.length === 0 ? (
          <div className="bg-white card-border rounded-xl p-8 text-center space-y-1.5" role="status">
            <p className="text-sm font-semibold text-neutral-800">未找到相关食谱</p>
            <p className="text-xs text-neutral-400">试试更换关键词或点击上方按钮自建新菜谱</p>
          </div>
        ) : (
          filteredRecipes.map(recipe => (
            <article
              key={recipe.id}
              id={`recipe-card-${recipe.id}`}
              role="button"
              tabIndex={0}
              aria-label={`查看食谱：${recipe.title}`}
              onClick={() => onSelectRecipe(recipe)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectRecipe(recipe);
                }
              }}
              className="bg-white card-border rounded-xl p-4 transition-all cursor-pointer group hover:border-neutral-400 focus-visible:ring-2 focus-visible:ring-black"
            >
              {/* Header: Title and Badge (Tight proximity) */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-bold text-neutral-900 tracking-tight group-hover:text-black">
                  {recipe.title}
                </h3>
                {recipe.isCustom && (
                  <span className="text-[10px] font-semibold bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded shrink-0">
                    自建
                  </span>
                )}
              </div>

              {/* Summary Description: Tightly bound to Title */}
              <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 mt-1.5">
                {recipe.summary}
              </p>

              {/* Footer Metadata: Separated with clear divider and proportional spacing */}
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-neutral-100 text-xs">
                <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                  <span>{recipe.prepMinutes} 分钟</span>
                  <span className="text-neutral-200">·</span>
                  <span>{recipe.difficulty}</span>
                  <span className="text-neutral-200">·</span>
                  <span className="bg-neutral-100/80 text-neutral-600 px-1.5 py-0.5 rounded text-[10px] font-medium">
                    {recipe.category}
                  </span>
                </div>
                <div className="font-bold text-neutral-900 text-xs">
                  {recipe.totalCal} <span className="font-normal text-[10px] text-neutral-400">千卡</span>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
