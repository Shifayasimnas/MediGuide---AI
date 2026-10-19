import React from 'react';
import { ShieldAlert, HeartPulse, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onEmergencyClick: () => void;
  onDisclaimerClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onEmergencyClick,
  onDisclaimerClick,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onTabChange('qa')}
          className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-lg group"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-slate-900">
                MediGuide<span className="text-teal-600"> AI</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <span>Healthcare Information</span>
              <span aria-hidden="true">·</span>
              <span className="text-teal-700">Educational</span>
            </div>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Desktop/Tablet) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onTabChange('qa')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'qa'
                ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                : 'hover:text-slate-900'
            }`}
          >
            Health Q&A
          </button>
          <button
            onClick={() => onTabChange('symptoms')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'symptoms'
                ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                : 'hover:text-slate-900'
            }`}
          >
            Symptom Guide
          </button>
          <button
            onClick={() => onTabChange('medicine')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'medicine'
                ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                : 'hover:text-slate-900'
            }`}
          >
            Medicine Info
          </button>
          <button
            onClick={() => onTabChange('doctor-prep')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'doctor-prep'
                ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                : 'hover:text-slate-900'
            }`}
          >
            Doctor Prep & Note
          </button>
          <button
            onClick={() => onTabChange('emergency')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'emergency'
                ? 'text-rose-700 font-semibold border-b-2 border-rose-600'
                : 'hover:text-rose-700'
            }`}
          >
            Emergency 112
          </button>
        </nav>

        {/* Zone 3: Primary Action & Safety Info */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onDisclaimerClick}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-teal-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors whitespace-nowrap min-h-[36px]"
            title="Read medical safety disclaimer and zero-storage privacy policy"
          >
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Safety & Privacy</span>
          </button>

          <button
            onClick={onEmergencyClick}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] rounded-lg shadow-sm transition-all whitespace-nowrap min-h-[44px]"
            aria-label="Emergency warning signs and India 112 hotline"
          >
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            <span>Emergency 112</span>
          </button>
        </div>
      </div>
    </header>
  );
};
