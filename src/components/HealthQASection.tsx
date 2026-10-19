import React, { useState } from 'react';
import { Search, Loader2, AlertOctagon, HelpCircle, ArrowRight, CheckCircle2, Shield, PhoneCall, Sparkles } from 'lucide-react';
import { HealthQAResponse } from '../types';

interface HealthQAProps {
  onSelectEmergencyTab: () => void;
  onNavigateToSymptoms: (initialSymptom?: string) => void;
}

const PRESET_TOPICS = [
  {
    title: 'Blood Pressure Ranges',
    question: 'What are normal adult blood pressure ranges and what do systolic and diastolic numbers mean?',
    category: 'Cardiovascular',
  },
  {
    title: 'Cold vs. Influenza',
    question: 'What are the physiological differences between a common cold and seasonal influenza?',
    category: 'Respiratory',
  },
  {
    title: 'Hydration & Electrolytes',
    question: 'How do hydration and electrolyte balance affect daily physical energy and kidney function?',
    category: 'Wellness',
  },
  {
    title: 'Fever in Adults',
    question: 'At what temperature and duration does an adult fever warrant a medical consultation?',
    category: 'General Care',
  },
  {
    title: 'Sleep & Immune Health',
    question: 'How does restorative sleep architecture support immune function and metabolic health?',
    category: 'Lifestyle',
  },
  {
    title: 'Type 2 Diabetes Basics',
    question: 'What are the subtle early physiological signs of insulin resistance and high blood sugar?',
    category: 'Endocrinology',
  },
];

export const HealthQASection: React.FC<HealthQAProps> = ({
  onSelectEmergencyTab,
  onNavigateToSymptoms,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<HealthQAResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async (questionToAsk: string) => {
    if (!questionToAsk.trim()) return;
    setLoading(true);
    setError(null);
    setQuery(questionToAsk);

    try {
      const res = await fetch('/api/health-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: questionToAsk }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Unable to retrieve healthcare information');
      }

      const data: HealthQAResponse = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err?.message || 'A network error occurred while connecting to MediGuide AI.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk(query);
  };

  return (
    <div className="space-y-8">
      {/* Hero Introduction Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
              <span className="text-teal-700 font-semibold">Evidence-Based</span>
              <span aria-hidden="true">·</span>
              <span>General Health Education</span>
              <span aria-hidden="true">·</span>
              <span>Non-Diagnostic</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
              Reliable Healthcare Knowledge & Practical Medical Guidance
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Ask general health questions, understand physiological symptoms, explore medicine information safely, and prepare organized notes for your doctor's appointment.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md">
                <Shield className="w-3.5 h-3.5 text-teal-600" />
                <span>Zero Data Storage (Session-Only)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                <span>Emergency Hotline: India 112</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full bg-slate-100">
            <img
              src="/src/assets/images/mediguide_hero_banner_1792394303915.jpg"
              alt="MediGuide AI Healthcare Information Interface"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // styled fallback container
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent lg:hidden" />
          </div>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <form onSubmit={handleFormSubmit} className="space-y-3">
          <label htmlFor="health-search" className="block text-sm font-semibold text-slate-900">
            Ask a General Health or Medical Education Question
          </label>
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              id="health-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Why do muscles ache during viral infections? What causes high cholesterol?"
              className="w-full pl-12 pr-28 py-3.5 text-sm sm:text-base bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 rounded-xl transition-all text-slate-900 placeholder:text-slate-400"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 min-h-[38px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching</span>
                </>
              ) : (
                <>
                  <span>Explain</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-slate-500">
            For personal diagnoses or individualized medication dosage, always consult your physician directly.
          </p>
        </form>

        {/* Preset Topics Carousel / Grid */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
            Suggested Health Education Topics
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {PRESET_TOPICS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleAsk(item.question)}
                disabled={loading}
                className="text-left p-3 rounded-xl border border-slate-200/90 hover:border-teal-500 bg-slate-50/70 hover:bg-teal-50/40 transition-all group"
              >
                <div className="flex items-center justify-between text-[11px] font-medium text-teal-700 mb-1">
                  <span>{item.category}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-xs font-medium text-slate-900 group-hover:text-teal-950 line-clamp-2">
                  {item.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error View */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-sm flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">Unable to process health request</div>
            <div className="text-xs mt-0.5 text-rose-800">{error}</div>
            <button
              onClick={() => handleAsk(query)}
              className="mt-2 text-xs font-semibold text-rose-700 underline hover:text-rose-900"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div className="space-y-6">
          {/* Emergency Alert (if triggered) */}
          {response.isEmergency && (
            <div className="bg-rose-50 border-2 border-rose-500 rounded-2xl p-5 sm:p-6 shadow-md text-rose-950">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <AlertOctagon className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-rose-900">
                      Possible Acute Medical Emergency Detected
                    </h3>
                    <a
                      href="tel:112"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-sm"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Dial India 112</span>
                    </a>
                  </div>
                  <p className="text-sm font-medium text-rose-900 leading-relaxed">
                    {response.emergencyAdvice ||
                      'These symptoms suggest a condition requiring immediate hospital or emergency room evaluation. Do not drive yourself if dizzy or experiencing severe chest pain.'}
                  </p>
                  <button
                    onClick={onSelectEmergencyTab}
                    className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline"
                  >
                    View Emergency Warning Signs & National Services &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Educational Answer Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </span>
                <span className="text-xs font-semibold text-teal-800 uppercase tracking-wider">
                  Health Education Analysis
                </span>
              </div>
              <span className="text-xs text-slate-400">Educational Review</span>
            </div>

            {/* Answer Text */}
            <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {response.answer}
            </div>

            {/* Key Takeaways */}
            {response.keyTakeaways && response.keyTakeaways.length > 0 && (
              <div className="bg-teal-50/60 border border-teal-100 rounded-xl p-4 sm:p-5">
                <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                  <span>Key Educational Takeaways</span>
                </h4>
                <ul className="space-y-2">
                  {response.keyTakeaways.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* When to consult a physician */}
            {response.whenToSeeDoctor && (
              <div className="border border-amber-200/80 bg-amber-50/40 rounded-xl p-4">
                <div className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-1">
                  When to Consult a Physician
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {response.whenToSeeDoctor}
                </p>
              </div>
            )}

            {/* Next Step Prompts */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
              <button
                onClick={() => onNavigateToSymptoms(query)}
                className="inline-flex items-center gap-1.5 text-teal-700 hover:text-teal-900 font-semibold"
              >
                <span>Have related symptoms? Check the Symptom Information Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Suggested Follow-Ups */}
            {response.suggestedFollowUps && response.suggestedFollowUps.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-500 mb-2.5">
                  Related Questions You Might Ask:
                </div>
                <div className="flex flex-wrap gap-2">
                  {response.suggestedFollowUps.map((fu, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAsk(fu)}
                      className="text-left text-xs text-slate-700 hover:text-teal-900 bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-lg px-3 py-2 transition-colors"
                    >
                      {fu}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Standard Safety Disclaimer */}
            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 leading-normal">
              {response.disclaimer}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
