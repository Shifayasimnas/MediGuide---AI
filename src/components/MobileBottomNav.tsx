import React from 'react';
import { MessageSquare, Activity, Pill, ClipboardCheck, PhoneCall } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'qa', label: 'Q&A', icon: MessageSquare },
    { id: 'symptoms', label: 'Symptoms', icon: Activity },
    { id: 'medicine', label: 'Medicines', icon: Pill },
    { id: 'doctor-prep', label: 'Doctor Prep', icon: ClipboardCheck },
    { id: 'emergency', label: '112 Alert', icon: PhoneCall, isEmergency: true },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg pb-safe">
      <nav className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isEmergency = tab.isEmergency;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors relative ${
                isEmergency
                  ? isActive
                    ? 'text-rose-600 font-semibold'
                    : 'text-rose-500 hover:text-rose-700'
                  : isActive
                  ? 'text-teal-700 font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div
                className={`w-9 h-7 flex items-center justify-center rounded-full transition-all ${
                  isActive
                    ? isEmergency
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-teal-100 text-teal-700'
                    : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                {tab.label}
              </span>
              {isActive && (
                <span
                  className={`absolute bottom-1 w-1 h-1 rounded-full ${
                    isEmergency ? 'bg-rose-600' : 'bg-teal-600'
                  }`}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
