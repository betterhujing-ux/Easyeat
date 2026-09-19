import React, { useState, useEffect } from 'react';
import { Recipe, LoggedItem, DailyTargets } from './types';
import {
  getAllRecipes,
  saveCustomRecipe,
  deleteCustomRecipe,
  getTodayDateString,
  getDailyLogs,
  addLogItem,
  removeLogItem,
  getDailyTargets,
} from './utils/storage';
import { Navigation, NavTab } from './components/Navigation';
import { RecipeList } from './components/RecipeList';
import { RecipeDetail } from './components/RecipeDetail';
import { RecipeEditor } from './components/RecipeEditor';
import { DietTracker } from './components/DietTracker';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('recipes');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);

  // Diet Tracker States
  const [currentDate, setCurrentDate] = useState<string>(getTodayDateString());
  const [dailyLogs, setDailyLogs] = useState<LoggedItem[]>([]);
  const [dailyTargets, setDailyTargets] = useState<DailyTargets>(getDailyTargets());
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  // Initialize
  useEffect(() => {
    setRecipes(getAllRecipes());
    setDailyLogs(getDailyLogs(currentDate));
    setDailyTargets(getDailyTargets());
  }, []);

  // Reload logs when date changes
  useEffect(() => {
    setDailyLogs(getDailyLogs(currentDate));
  }, [currentDate]);

  const showToast = (msg: string) => {
    setBannerNotice(msg);
    setTimeout(() => {
      setBannerNotice(null);
    }, 2500);
  };

  // Recipe actions
  const handleSelectRecipe = (recipe: Recipe) => {
    setActiveRecipe(recipe);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToRecipeList = () => {
    setActiveRecipe(null);
    setIsCreatingRecipe(false);
  };

  const handleSaveNewRecipe = (newRecipe: Recipe) => {
    saveCustomRecipe(newRecipe);
    setRecipes(getAllRecipes());
    setIsCreatingRecipe(false);
    setActiveRecipe(newRecipe);
    showToast(`已成功保存自建菜谱《${newRecipe.title}》`);
  };

  const handleDeleteCustomRecipe = (id: string) => {
    deleteCustomRecipe(id);
    setRecipes(getAllRecipes());
    setActiveRecipe(null);
    showToast('自建菜谱已删除');
  };

  // Tracker actions
  const handleAddLogItem = (item: LoggedItem) => {
    const updated = addLogItem(currentDate, item);
    setDailyLogs(updated);
    showToast(`已记录：${item.name} (${item.amount}g)`);
  };

  const handleDeleteLogItem = (id: string) => {
    const updated = removeLogItem(currentDate, id);
    setDailyLogs(updated);
  };

  const handleTabChange = (tab: NavTab) => {
    setCurrentTab(tab);
    if (tab !== 'recipes') {
      setActiveRecipe(null);
      setIsCreatingRecipe(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans antialiased">
      {/* Skip to Main Content Link for Keyboard Accessibility (Front-End Checklist) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-3 focus:py-2 focus:bg-black focus:text-white focus:text-xs focus:rounded-lg"
      >
        跳至主要内容
      </a>

      {/* Toast Notice */}
      {bannerNotice && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg transition-all animate-fadeIn"
        >
          {bannerNotice}
        </div>
      )}

      {/* Main Container */}
      <main id="main-content" className="max-w-xl mx-auto px-4 pt-5 pb-24">
        {/* App Header (Shows unless deeply reading recipe detail) */}
        {!activeRecipe && !isCreatingRecipe && (
          <header className="mb-4 space-y-0.5">
            <h1 className="text-xl font-bold tracking-tight text-neutral-950">
              {currentTab === 'recipes' && '健康食谱'}
              {currentTab === 'tracker' && '饮食记录'}
            </h1>
            <p className="text-xs text-neutral-400">
              {currentTab === 'recipes' && '精选健康膳食灵感与自建食谱'}
              {currentTab === 'tracker' && '记录每日三餐与营养摄入'}
            </p>
          </header>
        )}

        {/* Dynamic Views */}
        {currentTab === 'recipes' && (
          <div id="recipes-tab-panel" role="tabpanel" aria-labelledby="nav-tab-recipes">
            {isCreatingRecipe ? (
              <RecipeEditor
                onSave={handleSaveNewRecipe}
                onCancel={handleBackToRecipeList}
              />
            ) : activeRecipe ? (
              <RecipeDetail
                recipe={activeRecipe}
                onBack={handleBackToRecipeList}
                onDeleteCustom={handleDeleteCustomRecipe}
              />
            ) : (
              <RecipeList
                recipes={recipes}
                onSelectRecipe={handleSelectRecipe}
                onCreateNew={() => setIsCreatingRecipe(true)}
              />
            )}
          </div>
        )}

        {currentTab === 'tracker' && (
          <div id="tracker-tab-panel" role="tabpanel" aria-labelledby="nav-tab-tracker">
            <DietTracker
              currentDate={currentDate}
              logs={dailyLogs}
              targets={dailyTargets}
              onDateChange={setCurrentDate}
              onAddLog={handleAddLogItem}
              onDeleteLog={handleDeleteLogItem}
            />
          </div>
        )}
      </main>

      {/* Apple HIG compliant Bottom Navigation */}
      <Navigation currentTab={currentTab} onTabChange={handleTabChange} />
    </div>
  );
}
