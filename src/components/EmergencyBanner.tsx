import React from 'react';
import { PhoneCall, AlertTriangle, ChevronRight } from 'lucide-react';

interface EmergencyBannerProps {
  onOpenEmergency: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ onOpenEmergency }) => {
  return (
    <div className="bg-rose-50 border-b border-rose-200/80 text-rose-950 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
            <AlertTriangle className="w-3 h-3" />
          </span>
          <div className="text-slate-700 leading-snug">
            <span className="font-semibold text-rose-800">Possible Medical Emergency?</span>{' '}
            For sudden chest pain, stroke signs (FAST), or severe shortness of breath, call{' '}
            <span className="font-bold text-rose-900 underline decoration-rose-400">India 112</span>{' '}
            or your local emergency number immediately.
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:112"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shadow-sm whitespace-nowrap min-h-[36px]"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 112</span>
          </a>
          <button
            onClick={onOpenEmergency}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-rose-800 hover:text-rose-950 hover:bg-rose-100/80 font-medium text-xs transition-colors whitespace-nowrap min-h-[36px]"
          >
            <span>Emergency Checklist</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
