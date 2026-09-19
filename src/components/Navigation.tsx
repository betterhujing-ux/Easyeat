import React from 'react';

export type NavTab = 'recipes' | 'tracker';

interface NavigationProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  return (
    <nav
      id="main-navigation"
      role="tablist"
      aria-label="主要导航"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-hairline-t max-w-xl mx-auto px-12 pt-2.5 pb-[max(1rem,env(safe-area-inset-bottom))] flex justify-around items-center"
    >
      {/* 饮食记录 (第一位) */}
      <button
        id="nav-tab-tracker"
        type="button"
        role="tab"
        aria-selected={currentTab === 'tracker'}
        aria-controls="tracker-tab-panel"
        aria-label="记录"
        onClick={() => onTabChange('tracker')}
        className={`flex flex-col items-center gap-1 min-h-[44px] min-w-[56px] justify-center transition-colors ${
          currentTab === 'tracker' ? 'text-black font-bold' : 'text-neutral-400 hover:text-neutral-600 font-medium'
        }`}
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill={currentTab === 'tracker' ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline
            points="12 6 12 12 16 14"
            stroke={currentTab === 'tracker' ? '#FFFFFF' : 'currentColor'}
          />
        </svg>
        <span className="text-[11px] tracking-tight">记录</span>
      </button>

      {/* 健康食谱 (第二位) */}
      <button
        id="nav-tab-recipes"
        type="button"
        role="tab"
        aria-selected={currentTab === 'recipes'}
        aria-controls="recipes-tab-panel"
        aria-label="食谱"
        onClick={() => onTabChange('recipes')}
        className={`flex flex-col items-center gap-1 min-h-[44px] min-w-[56px] justify-center transition-colors ${
          currentTab === 'recipes' ? 'text-black font-bold' : 'text-neutral-400 hover:text-neutral-600 font-medium'
        }`}
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill={currentTab === 'recipes' ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M8 6h8" stroke={currentTab === 'recipes' ? '#FFFFFF' : 'currentColor'} />
          <path d="M8 10h8" stroke={currentTab === 'recipes' ? '#FFFFFF' : 'currentColor'} />
        </svg>
        <span className="text-[11px] tracking-tight">食谱</span>
      </button>
    </nav>
  );
};
