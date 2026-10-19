import React, { useState } from 'react';
import { Pill, Search, Loader2, AlertTriangle, ShieldAlert, CheckCircle, HelpCircle, Shield, Info, ArrowRight } from 'lucide-react';
import { MedicineInfoResponse } from '../types';

const COMMON_MEDICINES = [
  'Paracetamol (Acetaminophen)',
  'Metformin',
  'Amoxicillin',
  'Omeprazole',
  'Cetirizine',
  'Ibuprofen',
  'Atorvastatin',
  'Azithromycin',
  'Pantoprazole',
];

export const MedicineInfoSection: React.FC = () => {
  const [medicineQuery, setMedicineQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<MedicineInfoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (name: string) => {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    setMedicineQuery(name);

    try {
      const res = await fetch('/api/medicine-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicineName: name }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to fetch medication information');
      }

      const data: MedicineInfoResponse = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err?.message || 'Network error looking up medication.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup(medicineQuery);
  };

  return (
    <div className="space-y-8">
      {/* Header Notice */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <Pill className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 mb-1">
              <span>Pharmacological Education Only</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-normal">Strictly Non-Prescriptive</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              General Medicine Information Guide
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Look up how medications work, standard therapeutic indications, general administration best practices, and important precautions. 
              <strong className="text-slate-800"> MediGuide AI does not prescribe medicines or calculate personalized dosages.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="medicine-search" className="block text-sm font-semibold text-slate-900">
            Search Any Medication (Generic or Brand Name)
          </label>
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              id="medicine-search"
              type="text"
              value={medicineQuery}
              onChange={(e) => setMedicineQuery(e.target.value)}
              placeholder="e.g., Paracetamol, Metformin, Amoxicillin, Omeprazole, Cetirizine..."
              className="w-full pl-12 pr-28 py-3.5 text-sm sm:text-base bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 rounded-xl transition-all text-slate-900"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !medicineQuery.trim()}
              className="absolute right-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 min-h-[38px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Looking up</span>
                </>
              ) : (
                <>
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Common Medicines */}
        <div>
          <div className="text-xs font-semibold text-slate-500 mb-2">
            Frequently Researched Medications:
          </div>
          <div className="flex flex-wrap gap-2">
            {COMMON_MEDICINES.map((med, idx) => (
              <button
                key={idx}
                onClick={() => handleLookup(med)}
                disabled={loading}
                className="text-xs text-slate-700 hover:text-teal-900 bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-lg px-3 py-1.5 transition-colors"
              >
                {med}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">Medication lookup failed</div>
            <div className="text-xs text-rose-800">{error}</div>
          </div>
        </div>
      )}

      {/* Medicine Info View */}
      {response && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Header Block */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">
                  {response.medicineName}
                </h3>
                <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {response.pharmacologicalClass}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Approved Category: {response.pharmacologicalClass}
              </div>
            </div>
            <div className="text-[11px] text-amber-800 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 self-start sm:self-auto">
              Prescription & Pharmacist Verification Required
            </div>
          </div>

          {/* General Purpose & Mechanism */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200/80">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-teal-600" />
                <span>Primary Medical Purpose</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {response.generalPurpose}
              </p>
            </div>

            <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200/80">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-teal-600" />
                <span>How It Works in the Body</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {response.howItWorks}
              </p>
            </div>
          </div>

          {/* General Administration Guidelines (No Dosages) */}
          <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-teal-700" />
                <span>General Administration Guidelines</span>
              </h4>
              <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                No Individual Dosages
              </span>
            </div>
            <ul className="space-y-1.5 pt-1">
              {response.generalAdministrationFacts.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <span className="text-teal-600 font-bold shrink-0">&bull;</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
            <div className="text-[11px] text-teal-900 font-medium pt-1">
              Always verify your exact dosage and timing on your physician's prescription or pharmacy label. Never share prescribed medicines.
            </div>
          </div>

          {/* Precautions & Warnings */}
          <div className="border border-amber-200 bg-amber-50/40 rounded-xl p-4 sm:p-5 space-y-2">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Critical Health Precautions & Contraindications</span>
            </h4>
            <ul className="space-y-1.5 pt-1">
              {response.criticalPrecautions.map((prec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800">
                  <span className="text-amber-700 font-bold shrink-0">&bull;</span>
                  <span>{prec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Side Effects Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Common side effects */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Common Reported Side Effects (Mild)
              </h4>
              <ul className="space-y-1.5">
                {response.commonSideEffects.map((effect, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                    <span className="text-slate-400 font-bold">&bull;</span>
                    <span>{effect}</span>
                  </li>
                ))}
              </ul>
              <div className="text-[11px] text-slate-500 mt-2">
                Discuss persistent mild side effects with your prescribing doctor.
              </div>
            </div>

            {/* Serious side effects */}
            <div className="bg-rose-50/70 p-4 sm:p-5 rounded-xl border border-rose-200">
              <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Serious Signs: Seek Immediate Medical Care</span>
              </h4>
              <ul className="space-y-1.5">
                {response.seriousSignsToSeekHelp.map((sign, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-rose-950 font-medium">
                    <span className="text-rose-600 font-bold">&bull;</span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Storage & Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="border border-slate-200 p-4 rounded-xl">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Storage Recommendations
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                {response.storageGuidelines}
              </p>
            </div>

            <div className="border border-slate-200 p-4 rounded-xl">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Questions to Ask Your Pharmacist
              </div>
              <ul className="space-y-1">
                {response.questionsForPharmacist.map((q, idx) => (
                  <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                    <span className="text-teal-600">&rarr;</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mandatory Disclaimer */}
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            {response.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
};
