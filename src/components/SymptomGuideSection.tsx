import React, { useState } from 'react';
import { Activity, AlertTriangle, AlertOctagon, HelpCircle, ArrowRight, ShieldCheck, PhoneCall, Loader2, Sparkles, Stethoscope, ChevronRight, RefreshCw } from 'lucide-react';
import { SymptomGuideResponse } from '../types';

interface SymptomGuideProps {
  initialSymptom?: string;
  onSendToDoctorPrep: (symptomData: {
    chiefComplaint: string;
    onsetDuration: string;
    severity: number;
    characteristics: string;
  }) => void;
  onSelectEmergencyTab: () => void;
}

const BODY_SYSTEMS = [
  'Head, Neck & Neurological',
  'Chest, Heart & Lungs',
  'Abdomen, Stomach & Digestive',
  'Back, Joints & Muscles',
  'Skin, Rashes & Allergies',
  'General, Fatigue & Fever',
];

const EXAMPLE_SYMPTOMS = [
  {
    name: 'Throbbing Temple Headache',
    duration: '2 days',
    severity: 5,
    system: 'Head, Neck & Neurological',
    notes: 'Sensitive to bright computer light and screen glare',
  },
  {
    name: 'Dry Persistent Cough',
    duration: '10 days',
    severity: 4,
    system: 'Chest, Heart & Lungs',
    notes: 'Began after seasonal cold; worse at night when lying down',
  },
  {
    name: 'Dull Lower Back Tightness',
    duration: '1 week',
    severity: 4,
    system: 'Back, Joints & Muscles',
    notes: 'Worse after prolonged desk sitting, eases with slow walking',
  },
  {
    name: 'Sudden High Fever with Severe Chills',
    duration: '6 hours',
    severity: 7,
    system: 'General, Fatigue & Fever',
    notes: 'Body temperature spiking, sweating, severe fatigue',
  },
];

export const SymptomGuideSection: React.FC<SymptomGuideProps> = ({
  initialSymptom = '',
  onSendToDoctorPrep,
  onSelectEmergencyTab,
}) => {
  const [symptom, setSymptom] = useState(initialSymptom);
  const [duration, setDuration] = useState('2-3 days');
  const [severity, setSeverity] = useState(4);
  const [bodySystem, setBodySystem] = useState(BODY_SYSTEMS[0]);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<SymptomGuideResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!symptom.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/symptom-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptom,
          duration,
          severity,
          bodySystem,
          additionalNotes,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to analyze symptom profile');
      }

      const data: SymptomGuideResponse = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err?.message || 'Network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyExample = (ex: typeof EXAMPLE_SYMPTOMS[0]) => {
    setSymptom(ex.name);
    setDuration(ex.duration);
    setSeverity(ex.severity);
    setBodySystem(ex.system);
    setAdditionalNotes(ex.notes);
  };

  const handleReset = () => {
    setSymptom('');
    setDuration('2-3 days');
    setSeverity(4);
    setAdditionalNotes('');
    setResponse(null);
    setError(null);
  };

  const getSeverityBadge = (val: number) => {
    if (val <= 3) return { label: 'Mild (1-3)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val <= 6) return { label: 'Moderate (4-6)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (val <= 8) return { label: 'Severe (7-8)', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    return { label: 'Critical / Urgent (9-10)', color: 'text-rose-700 bg-rose-50 border-rose-300' };
  };

  const severityBadge = getSeverityBadge(severity);

  return (
    <div className="space-y-8">
      {/* Educational Notice Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Symptom Educational Information Guide
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Understand how clinicians assess symptoms, explore anatomical systems involved, and learn key questions a doctor will ask. 
              <strong className="text-slate-800"> This tool never provides medical diagnoses or prescriptions.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Symptom Input Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span>Symptom Profile Form</span>
          </h3>
          <button
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Quick Example Presets */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">
            Try a common symptom scenario:
          </label>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_SYMPTOMS.map((ex, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyExample(ex)}
                className="text-xs text-slate-700 hover:text-teal-900 bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-lg px-2.5 py-1.5 transition-colors"
              >
                {ex.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Symptom Name */}
            <div className="md:col-span-2">
              <label htmlFor="symptom-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Primary Symptom Description <span className="text-rose-600">*</span>
              </label>
              <input
                id="symptom-name"
                type="text"
                required
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                placeholder="e.g., Throbbing pressure behind right temple, dry persistent cough, burning sensation in upper stomach"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all text-slate-900"
              />
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="symptom-duration" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Onset & Duration
              </label>
              <input
                id="symptom-duration"
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 2 hours, 3 days, 2 weeks, on and off"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all text-slate-900"
              />
            </div>

            {/* Body System */}
            <div>
              <label htmlFor="body-system" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Suspected Body System / Area
              </label>
              <select
                id="body-system"
                value={bodySystem}
                onChange={(e) => setBodySystem(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all text-slate-900"
              >
                {BODY_SYSTEMS.map((sys) => (
                  <option key={sys} value={sys}>
                    {sys}
                  </option>
                ))}
              </select>
            </div>

            {/* Severity Slider */}
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="severity-range" className="text-xs font-semibold text-slate-700">
                  Perceived Severity Rating (1 to 10)
                </label>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${severityBadge.color}`}>
                  Score {severity}/10 · {severityBadge.label}
                </span>
              </div>
              <input
                id="severity-range"
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>1 (Very mild discomfort)</span>
                <span>5 (Moderate, interferes with tasks)</span>
                <span className="text-rose-600 font-semibold">10 (Unbearable / Emergency)</span>
              </div>
            </div>

            {/* Additional notes */}
            <div className="md:col-span-2">
              <label htmlFor="additional-notes" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Associated Signs or Context (Triggers, Relieving Factors, Other Sensations)
              </label>
              <textarea
                id="additional-notes"
                rows={2}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="e.g., Accompanied by mild nausea, worse after climbing stairs, relieved when applying cool cloth..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition-all text-slate-900"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-slate-500">
              * Educational triage guide only. No health data is stored.
            </div>
            <button
              type="submit"
              disabled={loading || !symptom.trim()}
              className="w-full sm:w-auto px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 min-h-[44px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Symptom Framework...</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>Generate Symptom Information Guide</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">Unable to analyze symptom</div>
            <div className="text-xs text-rose-800">{error}</div>
          </div>
        </div>
      )}

      {/* Results View */}
      {response && (
        <div className="space-y-6">
          {/* Emergency Alert Banner */}
          {response.isEmergency && (
            <div className="bg-rose-50 border-2 border-rose-500 rounded-2xl p-5 sm:p-6 shadow-md text-rose-950">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <AlertOctagon className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-rose-900">
                      Emergency Warning Flags Identified
                    </h3>
                    <a
                      href="tel:112"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-sm"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call India 112 Immediately</span>
                    </a>
                  </div>
                  <p className="text-xs sm:text-sm text-rose-900 leading-relaxed font-medium">
                    This symptom profile or high severity score indicates potential acute risk. Do not delay medical evaluation.
                  </p>
                  <button
                    onClick={onSelectEmergencyTab}
                    className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline"
                  >
                    View Comprehensive Emergency Care Guide &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Core Educational Guide Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Clinical Overview: {symptom}
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Severity Rating {severity}/10
              </span>
            </div>

            {/* Overview */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Physiological Mechanism & Overview
              </h4>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {response.overview}
              </p>
            </div>

            {/* Red Flag Signs to Watch For */}
            {response.emergencyFlags && response.emergencyFlags.length > 0 && (
              <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 sm:p-5">
                <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Red Flag Symptoms (Require Immediate Emergency Care / Dial 112)</span>
                </h4>
                <ul className="space-y-1.5">
                  {response.emergencyFlags.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-rose-950">
                      <span className="text-rose-600 font-bold shrink-0">&bull;</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What Doctors Evaluate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200/80">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                  What Clinicians Investigate
                </h4>
                <ul className="space-y-2">
                  {response.whatDoctorsEvaluate.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <ChevronRight className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Possible Contexts Considered (Non-Diagnostic) */}
              <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200/80">
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Categories Doctors Consider
                  </h4>
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                    Not a Diagnosis
                  </span>
                </div>
                <ul className="space-y-2">
                  {response.possibleEducationalContexts.map((ctx, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <span className="text-teal-600 font-bold shrink-0">&bull;</span>
                      <span>{ctx}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Supportive Comfort Measures (Non-medicinal) */}
            <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-4 sm:p-5">
              <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                <span>General Supportive Comfort Measures (At Home)</span>
              </h4>
              <ul className="space-y-1.5">
                {response.supportiveComfortMeasures.map((measure, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                    <span className="text-teal-600 font-bold shrink-0">&bull;</span>
                    <span>{measure}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 text-[11px] text-teal-800 italic">
                Note: Non-pharmacological comfort measures do not replace clinical care.
              </div>
            </div>

            {/* When to Seek Care */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                Medical Consultation Advice
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {response.whenToSeekUrgentCare}
              </p>
            </div>

            {/* Questions to Ask Doctor */}
            {response.doctorQuestions && response.doctorQuestions.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Recommended Questions to Ask Your Doctor
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {response.doctorQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                    >
                      &ldquo;{q}&rdquo;
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Send to Doctor Prep Button */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Planning to visit a clinic or hospital soon?
              </div>
              <button
                onClick={() =>
                  onSendToDoctorPrep({
                    chiefComplaint: symptom,
                    onsetDuration: duration,
                    severity: severity,
                    characteristics: `${bodySystem}. ${additionalNotes}`,
                  })
                }
                className="w-full sm:w-auto px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 min-h-[40px]"
              >
                <span>Create Doctor Visit Summary with this Symptom</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Disclaimer */}
            <div className="pt-3 text-[11px] text-slate-400">
              {response.disclaimer}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
