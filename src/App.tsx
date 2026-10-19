/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { EmergencyBanner } from './components/EmergencyBanner';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HealthQASection } from './components/HealthQASection';
import { SymptomGuideSection } from './components/SymptomGuideSection';
import { MedicineInfoSection } from './components/MedicineInfoSection';
import { DoctorPrepSection } from './components/DoctorPrepSection';
import { EmergencySection } from './components/EmergencySection';
import { DisclaimerModal } from './components/DisclaimerModal';
import { HeartPulse, ShieldCheck, PhoneCall, Lock } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('qa');
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [initialSymptomQuery, setInitialSymptomQuery] = useState<string>('');
  const [incomingSymptomForDoctor, setIncomingSymptomForDoctor] = useState<{
    chiefComplaint: string;
    onsetDuration: string;
    severity: number;
    characteristics: string;
  } | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEmergency = () => {
    handleTabChange('emergency');
  };

  const handleNavigateToSymptoms = (initialSymptom?: string) => {
    if (initialSymptom) {
      setInitialSymptomQuery(initialSymptom);
    }
    handleTabChange('symptoms');
  };

  const handleSendToDoctorPrep = (symptomData: {
    chiefComplaint: string;
    onsetDuration: string;
    severity: number;
    characteristics: string;
  }) => {
    setIncomingSymptomForDoctor(symptomData);
    handleTabChange('doctor-prep');
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Urgent Emergency Bar */}
      <EmergencyBanner onOpenEmergency={handleOpenEmergency} />

      {/* Main App Header */}
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onEmergencyClick={handleOpenEmergency}
        onDisclaimerClick={() => setIsDisclaimerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
        {activeTab === 'qa' && (
          <HealthQASection
            onSelectEmergencyTab={handleOpenEmergency}
            onNavigateToSymptoms={handleNavigateToSymptoms}
          />
        )}

        {activeTab === 'symptoms' && (
          <SymptomGuideSection
            initialSymptom={initialSymptomQuery}
            onSendToDoctorPrep={handleSendToDoctorPrep}
            onSelectEmergencyTab={handleOpenEmergency}
          />
        )}

        {activeTab === 'medicine' && <MedicineInfoSection />}

        {activeTab === 'doctor-prep' && (
          <DoctorPrepSection
            incomingSymptomData={incomingSymptomForDoctor}
            onClearIncomingData={() => setIncomingSymptomForDoctor(null)}
          />
        )}

        {activeTab === 'emergency' && <EmergencySection />}
      </main>

      {/* Mobile Fixed Bottom Navigation (thumb ergonomics) */}
      <MobileBottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Medical Safety & Privacy Disclaimer Modal */}
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />

      {/* Clean Structured Footer */}
      <footer className="border-t border-slate-200 bg-white text-xs text-slate-500 py-8 mb-16 md:mb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-teal-600 text-white flex items-center justify-center">
                <HeartPulse className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-900">MediGuide AI</span>
              <span aria-hidden="true">·</span>
              <span>General Healthcare Information & Education</span>
            </div>

            <div className="flex items-center gap-4 text-slate-600">
              <button
                onClick={() => setIsDisclaimerOpen(true)}
                className="hover:text-teal-700 transition-colors"
              >
                Safety Terms
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => setIsDisclaimerOpen(true)}
                className="hover:text-teal-700 transition-colors"
              >
                Zero-Data Privacy
              </button>
              <span aria-hidden="true">·</span>
              <a
                href="tel:112"
                className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
              >
                <PhoneCall className="w-3 h-3" />
                <span>India 112</span>
              </a>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p>
              MediGuide AI is an educational healthcare reference assistant powered by Google Gemini. It does not provide medical diagnoses, treatment advice, or drug prescriptions. For medical conditions or medication questions, always consult a licensed doctor or pharmacist. In life-threatening emergencies in India, dial 112 immediately.
            </p>
            <div className="flex items-center gap-1 shrink-0 text-slate-500">
              <Lock className="w-3 h-3 text-teal-600" />
              <span>Session-Only Memory</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
