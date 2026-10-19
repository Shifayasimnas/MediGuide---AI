import React, { useState } from 'react';
import { PhoneCall, AlertTriangle, ShieldAlert, Heart, CheckCircle2, ChevronDown, ChevronUp, AlertOctagon, Info, Activity } from 'lucide-react';
import { INDIAN_EMERGENCY_SERVICES, RED_FLAG_SIGNS } from '../types';

export const EmergencySection: React.FC = () => {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(0);
  const [selectedSigns, setSelectedSigns] = useState<string[]>([]);

  const toggleCategory = (idx: number) => {
    setExpandedCategory(expandedCategory === idx ? null : idx);
  };

  const toggleSign = (sign: string) => {
    if (selectedSigns.includes(sign)) {
      setSelectedSigns(selectedSigns.filter((s) => s !== sign));
    } else {
      setSelectedSigns([...selectedSigns, sign]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Primary Emergency Banner with India 112 */}
      <div className="bg-rose-600 rounded-3xl text-white p-6 sm:p-8 shadow-lg shadow-rose-600/20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wide uppercase mb-3">
            <AlertOctagon className="w-4 h-4 animate-pulse" />
            <span>Emergency Response Priority</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            India Unified Emergency Hotline: 112
          </h2>

          <p className="mt-3 text-sm sm:text-base text-rose-100 leading-relaxed">
            112 is India's single All-in-One Emergency Response Support System (ERSS), integrating Medical Ambulance, Police, and Fire services across all States and Union Territories.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="tel:112"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-white text-rose-700 hover:bg-rose-50 font-extrabold text-base rounded-2xl shadow-md transition-all active:scale-95"
            >
              <PhoneCall className="w-5 h-5 text-rose-600" />
              <span>Tap to Call 112 Now</span>
            </a>

            <a
              href="tel:108"
              className="inline-flex items-center gap-2 px-4 py-3 bg-rose-700/80 hover:bg-rose-700 text-white font-bold text-sm rounded-2xl border border-rose-400/40 transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Ambulance 108</span>
            </a>
          </div>
        </div>
      </div>

      {/* Emergency Self-Triage Assessment Warning Bar */}
      {selectedSigns.length > 0 && (
        <div className="p-5 bg-rose-50 border-2 border-rose-500 rounded-2xl shadow-md text-rose-950 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-base text-rose-900">
                {selectedSigns.length} Red Flag Sign{selectedSigns.length > 1 ? 's' : ''} Checked
              </div>
              <div className="text-xs text-rose-800">
                You have marked potential critical symptoms. Do not wait. Call 112 or head to the nearest Emergency Department immediately.
              </div>
            </div>
          </div>

          <a
            href="tel:112"
            className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition-transform active:scale-95 text-center whitespace-nowrap min-h-[40px] flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 112 Now</span>
          </a>
        </div>
      )}

      {/* Red Flag Symptoms Directory */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Critical Clinical Warnings</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Emergency Red Flags & Warning Signs Checklist
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Tap on any category to review warning symptoms. Check boxes to highlight immediate urgent signs.
          </p>
        </div>

        <div className="space-y-3">
          {RED_FLAG_SIGNS.map((cat, idx) => {
            const isExpanded = expandedCategory === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-slate-50/50"
              >
                <button
                  type="button"
                  onClick={() => toggleCategory(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {cat.title}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 sm:p-5 pt-0 space-y-3 border-t border-slate-200 bg-white">
                    <div className="space-y-2 pt-3">
                      {cat.symptoms.map((sym, sIdx) => {
                        const checked = selectedSigns.includes(sym);
                        return (
                          <label
                            key={sIdx}
                            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors text-xs sm:text-sm ${
                              checked
                                ? 'bg-rose-50 border-rose-300 text-rose-950 font-medium'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleSign(sym)}
                              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                            />
                            <span>{sym}</span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 font-semibold flex items-center gap-2">
                      <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Immediate Action: {cat.action}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Directory of Emergency Numbers in India */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Government of India Essential Emergency Helplines
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Toll-free 24x7 public emergency assistance numbers across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {INDIAN_EMERGENCY_SERVICES.map((srv, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                srv.isPrimary
                  ? 'bg-rose-50/60 border-rose-300 shadow-sm'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-900 line-clamp-1">
                    {srv.name}
                  </span>
                  <span
                    className={`text-sm font-extrabold px-2.5 py-0.5 rounded-md ${
                      srv.isPrimary
                        ? 'bg-rose-600 text-white'
                        : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {srv.number}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {srv.purpose}
                </p>
              </div>

              <a
                href={`tel:${srv.number}`}
                className={`inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg transition-colors min-h-[38px] ${
                  srv.isPrimary
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-800'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call {srv.number}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency First Aid Guidelines */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-teal-600" />
            <span>Essential Emergency First Aid Education (Until Help Arrives)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            General guidance while waiting for emergency ambulance services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              1. Hands-Only CPR for Adults
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <li>&bull; Check responsiveness and breathing.</li>
              <li>&bull; Place hands in center of chest.</li>
              <li>&bull; Push hard and fast at 100-120 beats per minute (to the rhythm of "Stayin' Alive").</li>
              <li>&bull; Allow complete chest recoil between compressions.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              2. Suspected Stroke (FAST)
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <li>&bull; Keep person comfortable and resting flat or slightly elevated.</li>
              <li>&bull; <strong>Do NOT give food, water, or aspirin.</strong></li>
              <li>&bull; Note the exact time symptoms began.</li>
              <li>&bull; Call 112 immediately to notify stroke-ready hospital.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              3. Recovery Position
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <li>&bull; If unconscious but breathing normally:</li>
              <li>&bull; Roll person gently onto their side.</li>
              <li>&bull; Tilt head back slightly to keep airway clear.</li>
              <li>&bull; Prevents choking on vomit or tongue obstruction.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
