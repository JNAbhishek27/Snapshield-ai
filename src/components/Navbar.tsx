import React from 'react';
import {
  ShieldCheck,
  Cpu,
  Moon,
  Sun,
  Server,
  Layers,
  FileText,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { AIProvider } from '../types';

interface NavbarProps {
  snapdragonMode: boolean;
  onToggleSnapdragonMode: (enabled: boolean) => void;
  activeProvider: AIProvider;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeTab: 'document' | 'privacy' | 'technical' | 'pipeline';
  setActiveTab: (tab: 'document' | 'privacy' | 'technical' | 'pipeline') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  snapdragonMode,
  onToggleSnapdragonMode,
  activeProvider,
  darkMode,
  onToggleDarkMode,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-red-600 text-white shadow-md shadow-indigo-500/20">
              <ShieldCheck className="w-6 h-6" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                  SnapShield AI
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-900/60">
                  <Cpu className="w-3 h-3" /> Snapdragon AI Lab
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Privacy-first document intelligence for HP PCs
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('document')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'document'
                  ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              Document Studio
            </button>

            <button
              onClick={() => setActiveTab('privacy')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'privacy'
                  ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Privacy Shield
            </button>

            <button
              onClick={() => setActiveTab('technical')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'technical'
                  ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900'
              }`}
            >
              <Cpu className="w-4 h-4 text-red-600 dark:text-red-400" />
              Technical Details
            </button>

            <button
              onClick={() => setActiveTab('pipeline')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'pipeline'
                  ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              AI Pipeline
            </button>
          </nav>

          {/* Controls: Snapdragon Mode Toggle & Theme Toggle */}
          <div className="flex items-center gap-3">
            {/* Snapdragon AI Mode Toggle Switch */}
            <div
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full border transition-all ${
                snapdragonMode
                  ? 'bg-red-50/80 dark:bg-red-950/40 border-red-300 dark:border-red-800/80 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
              title="Snapdragon AI Mode: Enforces on-device processing via Qualcomm AI Hub architecture"
            >
              <Cpu
                className={`w-4 h-4 ${
                  snapdragonMode
                    ? 'text-red-600 dark:text-red-400 animate-pulse'
                    : 'text-slate-400'
                }`}
              />
              <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-300">
                Snapdragon AI Mode
              </span>

              <button
                type="button"
                role="switch"
                aria-checked={snapdragonMode}
                onClick={() => onToggleSnapdragonMode(!snapdragonMode)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  snapdragonMode ? 'bg-red-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    snapdragonMode ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Toggle theme"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('document')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md shrink-0 ${
              activeTab === 'document'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Document Studio
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md shrink-0 ${
              activeTab === 'privacy'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Privacy Shield
          </button>
          <button
            onClick={() => setActiveTab('technical')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md shrink-0 ${
              activeTab === 'technical'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Technical Details
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md shrink-0 ${
              activeTab === 'pipeline'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            AI Pipeline
          </button>
        </div>
      </div>
    </header>
  );
};
