import React from 'react';
import { X, ShieldCheck, AlertTriangle, PhoneCall, Lock, HeartPulse } from 'lucide-react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Medical Disclaimer & Privacy Commitment
              </h3>
              <p className="text-[11px] text-slate-500">
                MediGuide AI Safety & Compliance Framework
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* Section 1: Educational Scope */}
          <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-xl space-y-1.5">
            <h4 className="font-bold text-teal-950 flex items-center gap-1.5 text-xs uppercase tracking-wide">
              <HeartPulse className="w-4 h-4 text-teal-700" />
              <span>1. Educational Purpose Only (Not Medical Care)</span>
            </h4>
            <p className="text-xs text-slate-700">
              MediGuide AI is designed solely for general health literacy, educational exploration, and appointment preparation. 
              <strong> It does not provide medical diagnoses, treatment plans, or clinical prescriptions.</strong>
              Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </div>

          {/* Section 2: Zero Health Data Storage */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wide">
              <Lock className="w-4 h-4 text-teal-600" />
              <span>2. Strict Privacy: Zero Health Data Retention</span>
            </h4>
            <p className="text-xs text-slate-600">
              We respect your health privacy. <strong>MediGuide AI does not save, profile, or store your personal symptoms, questions, or medical notes to any database.</strong> All data resides temporarily in your active browser memory and can be cleared instantly via the "Clear Session Data" button.
            </p>
          </div>

          {/* Section 3: Medication & Dosage Rules */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>3. No Individual Medication Dosages</span>
            </h4>
            <p className="text-xs text-slate-600">
              Prescription medications require individual clinical evaluation by a licensed healthcare provider considering liver/kidney function, age, body weight, and drug interactions. MediGuide AI never calculates or recommends personalized dosage amounts.
            </p>
          </div>

          {/* Section 4: Emergency Assistance */}
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5">
            <h4 className="font-bold text-rose-950 flex items-center gap-1.5 text-xs uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>4. Acute Emergencies: Dial India 112</span>
            </h4>
            <p className="text-xs text-rose-900">
              If you experience crushing chest pain, difficulty breathing, stroke symptoms (facial droop, arm weakness, slurred speech), severe bleeding, or allergic swelling, call <strong>112 (India)</strong> or your local emergency hospital immediately.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <a
            href="tel:112"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-900"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency: Call 112</span>
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
