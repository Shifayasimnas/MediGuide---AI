import React, { useState, useEffect } from 'react';
import { ClipboardList, Copy, Check, Printer, HelpCircle, Loader2, RefreshCw, FileText, Stethoscope, ArrowRight, Sparkles, CheckSquare, Square, Trash2 } from 'lucide-react';
import { DoctorQuestionsResponse, SymptomSummaryResponse } from '../types';

interface DoctorPrepProps {
  incomingSymptomData?: {
    chiefComplaint: string;
    onsetDuration: string;
    severity: number;
    characteristics: string;
  } | null;
  onClearIncomingData?: () => void;
}

export const DoctorPrepSection: React.FC<DoctorPrepProps> = ({
  incomingSymptomData,
  onClearIncomingData,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'summary' | 'questions'>('summary');

  // Question Generator State
  const [visitReason, setVisitReason] = useState('Persistent health symptom review');
  const [ageGroup, setAgeGroup] = useState('Adult (18-64)');
  const [conditions, setConditions] = useState('');
  const [symptomContext, setSymptomContext] = useState('');
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsResponse, setQuestionsResponse] = useState<DoctorQuestionsResponse | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  // Summary Note State
  const [patientAge, setPatientAge] = useState('32');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [onsetDuration, setOnsetDuration] = useState('');
  const [severity, setSeverity] = useState(5);
  const [characteristics, setCharacteristics] = useState('');
  const [aggravatingFactors, setAggravatingFactors] = useState('');
  const [relievingFactors, setRelievingFactors] = useState('');
  const [existingConditions, setExistingConditions] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [allergies, setAllergies] = useState('No known drug allergies (NKDA)');
  
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryResponse, setSummaryResponse] = useState<SymptomSummaryResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // Load incoming symptom data if transferred from Symptom Guide
  useEffect(() => {
    if (incomingSymptomData) {
      setChiefComplaint(incomingSymptomData.chiefComplaint);
      setOnsetDuration(incomingSymptomData.onsetDuration);
      setSeverity(incomingSymptomData.severity);
      setCharacteristics(incomingSymptomData.characteristics);
      setSymptomContext(incomingSymptomData.chiefComplaint);
      setVisitReason(`Evaluation for ${incomingSymptomData.chiefComplaint}`);
      setActiveSubTab('summary');
    }
  }, [incomingSymptomData]);

  // Handle Question Generation
  const handleGenerateQuestions = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!visitReason.trim()) return;

    setQuestionsLoading(true);
    try {
      const res = await fetch('/api/doctor-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reasonForVisit: visitReason,
          patientAgeGroup: ageGroup,
          symptoms: symptomContext || chiefComplaint,
          knownConditions: conditions || existingConditions,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate questions');
      const data: DoctorQuestionsResponse = await res.json();
      setQuestionsResponse(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const toggleQuestionSelection = (q: string) => {
    if (selectedQuestions.includes(q)) {
      setSelectedQuestions(selectedQuestions.filter((item) => item !== q));
    } else {
      setSelectedQuestions([...selectedQuestions, q]);
    }
  };

  // Handle Symptom Summary Note Generation
  const handleGenerateSummary = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chiefComplaint.trim()) return;

    setSummaryLoading(true);
    try {
      const res = await fetch('/api/symptom-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientAge,
          chiefComplaint,
          onsetDuration,
          severity,
          characteristics,
          aggravatingFactors,
          relievingFactors,
          existingConditions,
          currentMedications,
          allergies,
          questionsToAsk: selectedQuestions,
        }),
      });

      if (!res.ok) throw new Error('Failed to compile summary');
      const data: SymptomSummaryResponse = await res.json();
      setSummaryResponse(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSummaryLoading(false);
    }
  };

  // Copy plain text to clipboard
  const handleCopyClipboard = async () => {
    if (!summaryResponse?.plainTextSummary) return;
    try {
      await navigator.clipboard.writeText(summaryResponse.plainTextSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  // Clear all patient session data (privacy guarantee)
  const handleClearAllData = () => {
    setChiefComplaint('');
    setOnsetDuration('');
    setSeverity(5);
    setCharacteristics('');
    setAggravatingFactors('');
    setRelievingFactors('');
    setExistingConditions('');
    setCurrentMedications('');
    setAllergies('No known drug allergies (NKDA)');
    setVisitReason('Doctor consultation review');
    setConditions('');
    setSymptomContext('');
    setSelectedQuestions([]);
    setSummaryResponse(null);
    setQuestionsResponse(null);
    if (onClearIncomingData) onClearIncomingData();
  };

  return (
    <div className="space-y-8">
      {/* Top Introduction Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 mb-1">
              <span>Appointment Preparation</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-normal">Patient Advocacy & HPI Note</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Doctor Consultation Prep & Symptom Summary Note
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Medical appointments are brief. Prepare targeted questions to ask your physician and compile a structured, copyable clinical summary (History of Present Illness) so your doctor understands your timeline in seconds.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <span className="text-teal-700 font-medium">Session-only memory:</span> No personal health data is saved to any external database.
            </div>
          </div>

          <div className="md:col-span-4 h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src="/src/assets/images/mediguide_doctor_consultation_1792394303417.jpg"
              alt="Clinical consultation preparation desk"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>

      {/* Sub Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveSubTab('summary')}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              activeSubTab === 'summary'
                ? 'text-teal-700 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Copyable Doctor Visit Summary</span>
            </div>
          </button>

          <button
            onClick={() => setActiveSubTab('questions')}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              activeSubTab === 'questions'
                ? 'text-teal-700 border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              <span>Questions to Ask Your Doctor</span>
              {selectedQuestions.length > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-teal-100 text-teal-800 rounded-full font-bold">
                  {selectedQuestions.length}
                </span>
              )}
            </div>
          </button>
        </div>

        <button
          onClick={handleClearAllData}
          className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1.5 pb-2 transition-colors"
          title="Clear all entered data from memory"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Session Data</span>
        </button>
      </div>

      {/* SUB-TAB 1: COPYABLE DOCTOR VISIT SUMMARY */}
      {activeSubTab === 'summary' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Patient Consultation Questionnaire
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in your timeline and symptoms to generate an organized clinical briefing note.
                </p>
              </div>
            </div>

            <form onSubmit={handleGenerateSummary} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Age */}
                <div>
                  <label htmlFor="patient-age" className="block text-xs font-semibold text-slate-700 mb-1">
                    Approximate Age / Category
                  </label>
                  <input
                    id="patient-age"
                    type="text"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    placeholder="e.g., 34 years, Senior (68), Teen"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-200 text-slate-900"
                  />
                </div>

                {/* Chief Complaint */}
                <div className="sm:col-span-2">
                  <label htmlFor="chief-complaint" className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Concern / Chief Complaint <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="chief-complaint"
                    type="text"
                    required
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    placeholder="e.g., Constant throbbing headache behind left eye with mild nausea"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-200 text-slate-900"
                  />
                </div>

                {/* Onset / Timeline */}
                <div>
                  <label htmlFor="onset-duration" className="block text-xs font-semibold text-slate-700 mb-1">
                    Onset & Timeline <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="onset-duration"
                    type="text"
                    required
                    value={onsetDuration}
                    onChange={(e) => setOnsetDuration(e.target.value)}
                    placeholder="e.g., Started 4 days ago, constant; worse in mornings"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-200 text-slate-900"
                  />
                </div>

                {/* Severity */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="summary-severity" className="text-xs font-semibold text-slate-700">
                      Severity (1-10)
                    </label>
                    <span className="text-xs font-bold text-teal-800">
                      {severity}/10
                    </span>
                  </div>
                  <input
                    id="summary-severity"
                    type="range"
                    min="1"
                    max="10"
                    value={severity}
                    onChange={(e) => setSeverity(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600 mt-2"
                  />
                </div>

                {/* Sensation / Quality */}
                <div>
                  <label htmlFor="characteristics" className="block text-xs font-semibold text-slate-700 mb-1">
                    Pain / Symptom Quality
                  </label>
                  <input
                    id="characteristics"
                    type="text"
                    value={characteristics}
                    onChange={(e) => setCharacteristics(e.target.value)}
                    placeholder="e.g., Sharp, throbbing, dull ache, burning, pressure"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-200 text-slate-900"
                  />
                </div>

                {/* Aggravating Factors */}
                <div>
                  <label htmlFor="aggravating" className="block text-xs font-semibold text-slate-700 mb-1">
                    What Makes It Worse?
                  </label>
                  <input
                    id="aggravating"
                    type="text"
                    value={aggravatingFactors}
                    onChange={(e) => setAggravatingFactors(e.target.value)}
                    placeholder="e.g., Bright lights, bending forward, climbing stairs"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-200 text-slate-900"
                  />
                </div>

                {/* Relieving Factors */}
                <div>
                  <label htmlFor="relieving" className="block text-xs font-semibold text-slate-700 mb-1">
                    What Makes It Better?
                  </label>
                  <input
                    id="relieving"
                    type="text"
                    value={relievingFactors}
                    onChange={(e) => setRelievingFactors(e.target.value)}
                    placeholder="e.g., Resting in dark room, cold compress, drinking water"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-200 text-slate-900"
                  />
                </div>

                {/* Existing Conditions */}
                <div>
                  <label htmlFor="conditions" className="block text-xs font-semibold text-slate-700 mb-1">
                    Known Medical Conditions
                  </label>
                  <input
                    id="conditions"
                    type="text"
                    value={existingConditions}
                    onChange={(e) => setExistingConditions(e.target.value)}
                    placeholder="e.g., Hypertension, Asthma, Type 2 Diabetes, None"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-200 text-slate-900"
                  />
                </div>

                {/* Current Medications */}
                <div>
                  <label htmlFor="medications" className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Medications & Supplements
                  </label>
                  <input
                    id="medications"
                    type="text"
                    value={currentMedications}
                    onChange={(e) => setCurrentMedications(e.target.value)}
                    placeholder="e.g., Amlodipine 5mg, Multivitamin, None"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-200 text-slate-900"
                  />
                </div>

                {/* Allergies */}
                <div className="sm:col-span-2">
                  <label htmlFor="allergies" className="block text-xs font-semibold text-slate-700 mb-1">
                    Known Drug or Food Allergies
                  </label>
                  <input
                    id="allergies"
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="e.g., Penicillin, Sulfa drugs, Peanuts, or NKDA"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-200 text-slate-900"
                  />
                </div>
              </div>

              {/* Selected Questions for Doctor */}
              {selectedQuestions.length > 0 && (
                <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-teal-900 uppercase tracking-wide">
                      Selected Questions to Include ({selectedQuestions.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveSubTab('questions')}
                      className="text-xs text-teal-700 hover:underline"
                    >
                      Manage Questions
                    </button>
                  </div>
                  <ul className="space-y-1">
                    {selectedQuestions.map((q, idx) => (
                      <li key={idx} className="text-xs text-slate-800 flex items-start gap-1.5">
                        <span className="text-teal-600 font-bold">&bull;</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setActiveSubTab('questions')}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Need question ideas? Generate doctor questions &rarr;</span>
                </button>

                <button
                  type="submit"
                  disabled={summaryLoading || !chiefComplaint.trim()}
                  className="w-full sm:w-auto px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 min-h-[44px]"
                >
                  {summaryLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Compiling Summary Note...</span>
                    </>
                  ) : (
                    <>
                      <ClipboardList className="w-4 h-4" />
                      <span>Compile Doctor Visit Note</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Generated Note View with 1-Click Copy */}
          {summaryResponse && (
            <div className="bg-white rounded-2xl border-2 border-teal-500/40 p-6 sm:p-8 shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                      HPI
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Doctor Consultation Summary Note
                    </h3>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Structured Clinical Format · Ready to print, copy, or show to your doctor
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyClipboard}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm min-h-[40px] ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-teal-600 hover:bg-teal-700 text-white active:scale-95'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Summary Text</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors min-h-[40px]"
                    title="Print note or save as PDF"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Formatted Plain Text Note in Clean Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap select-all overflow-x-auto">
                {summaryResponse.plainTextSummary}
              </div>

              {/* Structured Visual Cards for scanning */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Chief Complaint & Timeline
                  </div>
                  <div className="text-xs font-semibold text-slate-900">
                    {summaryResponse.structuredHPI.chiefConcern}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Duration: {summaryResponse.structuredHPI.timeline} · Severity: {summaryResponse.structuredHPI.severityScore}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Reported Medical Context
                  </div>
                  <div className="text-xs text-slate-700">
                    {summaryResponse.structuredHPI.background}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
                {summaryResponse.disclaimer}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: QUESTIONS TO ASK A DOCTOR */}
      {activeSubTab === 'questions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Generate Smart Questions for Your Doctor
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Patients who ask prepared questions experience better medical understanding and outcomes.
              </p>
            </div>

            <form onSubmit={handleGenerateQuestions} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="visit-reason" className="block text-xs font-semibold text-slate-700 mb-1">
                    Reason for Medical Appointment
                  </label>
                  <input
                    id="visit-reason"
                    type="text"
                    value={visitReason}
                    onChange={(e) => setVisitReason(e.target.value)}
                    placeholder="e.g., Persistent joint pain, Routine diabetes checkup, Frequent headaches"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-200 text-slate-900"
                  />
                </div>

                <div>
                  <label htmlFor="age-group" className="block text-xs font-semibold text-slate-700 mb-1">
                    Age Group
                  </label>
                  <select
                    id="age-group"
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-200 text-slate-900"
                  >
                    <option value="Adult (18-64)">Adult (18-64)</option>
                    <option value="Senior (65+)">Senior (65+)</option>
                    <option value="Young Adult (18-25)">Young Adult (18-25)</option>
                    <option value="Pediatric / Child">Pediatric / Child</option>
                    <option value="Pregnant Patient">Pregnant Patient</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="symptom-context" className="block text-xs font-semibold text-slate-700 mb-1">
                    Specific Symptoms or Concerns
                  </label>
                  <input
                    id="symptom-context"
                    type="text"
                    value={symptomContext}
                    onChange={(e) => setSymptomContext(e.target.value)}
                    placeholder="e.g., Stiffness in knees when waking up, feeling fatigued after meals"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-200 text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={questionsLoading || !visitReason.trim()}
                  className="w-full sm:w-auto px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 min-h-[44px]"
                >
                  {questionsLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Questions...</span>
                    </>
                  ) : (
                    <>
                      <HelpCircle className="w-4 h-4" />
                      <span>Generate Doctor Questions</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Generated Questions View */}
          {questionsResponse && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Personalized Questions Checklist
                    </h3>
                    <p className="text-xs text-slate-500">
                      Click the checkbox next to any question to attach it to your Doctor Visit Note.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md">
                    {selectedQuestions.length} Selected
                  </span>
                </div>

                {/* Section 1: Diagnosis & Cause */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                    <span>Understanding the Condition & Root Cause</span>
                  </h4>
                  <div className="space-y-2">
                    {questionsResponse.diagnosisQuestions.map((q, idx) => {
                      const isChecked = selectedQuestions.includes(q);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleQuestionSelection(q)}
                          className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-colors ${
                            isChecked
                              ? 'bg-teal-50 border-teal-300 text-teal-950 font-medium'
                              : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          <span className="mt-0.5 text-teal-600">
                            {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                          </span>
                          <span className="flex-1">&ldquo;{q}&rdquo;</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2: Tests & Diagnostics */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                    Diagnostic Tests & Investigations
                  </h4>
                  <div className="space-y-2">
                    {questionsResponse.testingQuestions.map((q, idx) => {
                      const isChecked = selectedQuestions.includes(q);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleQuestionSelection(q)}
                          className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-colors ${
                            isChecked
                              ? 'bg-teal-50 border-teal-300 text-teal-950 font-medium'
                              : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          <span className="mt-0.5 text-teal-600">
                            {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                          </span>
                          <span className="flex-1">&ldquo;{q}&rdquo;</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 3: Treatment Options & Risks */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                    Treatment Options & Side Effects
                  </h4>
                  <div className="space-y-2">
                    {questionsResponse.treatmentQuestions.map((q, idx) => {
                      const isChecked = selectedQuestions.includes(q);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleQuestionSelection(q)}
                          className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-colors ${
                            isChecked
                              ? 'bg-teal-50 border-teal-300 text-teal-950 font-medium'
                              : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          <span className="mt-0.5 text-teal-600">
                            {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                          </span>
                          <span className="flex-1">&ldquo;{q}&rdquo;</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 4: Home Management & Red Flags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Home Management & Lifestyle
                    </h5>
                    <ul className="space-y-2">
                      {questionsResponse.lifestyleQuestions.map((q, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">&bull;</span>
                          <span>&ldquo;{q}&rdquo;</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200">
                    <h5 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-2">
                      Red Flags & When to Call Back
                    </h5>
                    <ul className="space-y-2">
                      {questionsResponse.redFlagFollowUpQuestions.map((q, idx) => (
                        <li key={idx} className="text-xs text-rose-950 font-medium flex items-start gap-1.5">
                          <span className="text-rose-600 font-bold">&bull;</span>
                          <span>&ldquo;{q}&rdquo;</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action button to return to summary */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Ready to attach these questions to your note?
                  </div>
                  <button
                    onClick={() => setActiveSubTab('summary')}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
                  >
                    <span>Attach & View Doctor Note</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
