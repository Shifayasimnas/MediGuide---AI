export interface HealthQAResponse {
  answer: string;
  isEmergency: boolean;
  emergencyAdvice?: string;
  keyTakeaways: string[];
  whenToSeeDoctor: string;
  suggestedFollowUps: string[];
  disclaimer: string;
}

export interface SymptomGuideResponse {
  overview: string;
  isEmergency: boolean;
  emergencyFlags: string[];
  whatDoctorsEvaluate: string[];
  possibleEducationalContexts: string[];
  supportiveComfortMeasures: string[];
  whenToSeekUrgentCare: string;
  doctorQuestions: string[];
  disclaimer: string;
}

export interface MedicineInfoResponse {
  medicineName: string;
  pharmacologicalClass: string;
  generalPurpose: string;
  howItWorks: string;
  generalAdministrationFacts: string[];
  criticalPrecautions: string[];
  commonSideEffects: string[];
  seriousSignsToSeekHelp: string[];
  storageGuidelines: string;
  questionsForPharmacist: string[];
  disclaimer: string;
}

export interface DoctorQuestionsResponse {
  consultationSummary: string;
  diagnosisQuestions: string[];
  testingQuestions: string[];
  treatmentQuestions: string[];
  lifestyleQuestions: string[];
  redFlagFollowUpQuestions: string[];
  disclaimer: string;
}

export interface SymptomSummaryResponse {
  plainTextSummary: string;
  structuredHPI: {
    chiefConcern: string;
    timeline: string;
    severityScore: string;
    symptomDetails: string;
    modulatingFactors: string;
    background: string;
    keyQuestionsList: string[];
  };
  disclaimer: string;
}

export interface EmergencyService {
  name: string;
  number: string;
  purpose: string;
  isPrimary?: boolean;
}

export const INDIAN_EMERGENCY_SERVICES: EmergencyService[] = [
  {
    name: 'National Emergency Response (All-in-One)',
    number: '112',
    purpose: 'Unified emergency number for Medical Ambulance, Police, and Fire services across India.',
    isPrimary: true,
  },
  {
    name: 'Ambulance & Emergency Medical Service',
    number: '108',
    purpose: 'Toll-free emergency response service for accidents, cardiac events, trauma, and acute illness.',
    isPrimary: false,
  },
  {
    name: 'Janani Shishu Suraksha / Maternity Ambulance',
    number: '102',
    purpose: 'Dedicated ambulance service for pregnant mothers and newborns.',
    isPrimary: false,
  },
  {
    name: 'National Health Helpline (Govt. of India)',
    number: '1075',
    purpose: 'Central health information, disease outbreaks, and public health advisories.',
    isPrimary: false,
  },
  {
    name: 'State Health Information & Doctor Advice',
    number: '104',
    purpose: '24x7 medical counseling, symptom guidance, and directory of blood banks and public hospitals.',
    isPrimary: false,
  },
  {
    name: 'Tele-MANAS (Mental Health Helpline)',
    number: '14416',
    purpose: 'Free 24x7 government psychological counseling and mental health crisis support in multiple Indian languages.',
    isPrimary: false,
  },
];

export interface RedFlagCategory {
  title: string;
  symptoms: string[];
  action: string;
}

export const RED_FLAG_SIGNS: RedFlagCategory[] = [
  {
    title: 'Cardiac & Chest Emergencies',
    symptoms: [
      'Crushing chest pressure, tightness, or squeezing pain',
      'Pain radiating to left arm, neck, jaw, back, or stomach',
      'Chest pain accompanied by cold sweats, dizziness, or vomiting',
      'Sudden rapid, pounding, or irregular heartbeat with lightheadedness',
    ],
    action: 'Immediately sit down, stay calm, and call 112 for an emergency ambulance.',
  },
  {
    title: 'Stroke & Neurological Emergencies (FAST Protocol)',
    symptoms: [
      'Face drooping: One side of the face sags or smile is uneven',
      'Arm weakness: Inability to raise both arms equally',
      'Speech difficulty: Slurred, strange words, or inability to speak',
      'Time to call 112: Immediate medical intervention preserves brain tissue',
      'Sudden severe "thunderclap" headache unlike anything felt before',
      'Sudden loss of vision, balance, or coordination',
    ],
    action: 'Note the exact time symptoms started and call 112 immediately.',
  },
  {
    title: 'Severe Respiratory Distress',
    symptoms: [
      'Gasping for breath or inability to speak full sentences',
      'Bluish discoloration on lips, face, or fingernails (cyanosis)',
      'Severe wheezing, stridor (high-pitched breathing sound), or chest retractions',
      'Sudden choking or foreign object obstruction in airway',
    ],
    action: 'Keep upright, administer prescribed emergency inhaler if available, and call 112.',
  },
  {
    title: 'Severe Allergic Reactions (Anaphylaxis)',
    symptoms: [
      'Swelling of the lips, tongue, throat, or uvula',
      'Sudden widespread hives, intense itching, and dizziness',
      'Difficulty swallowing or sensation of throat closing',
      'Sudden drop in blood pressure with faintness',
    ],
    action: 'Use EpiPen/epinephrine auto-injector immediately if prescribed and call 112.',
  },
  {
    title: 'Severe Trauma, Bleeding & Poisoning',
    symptoms: [
      'Spurting or uncontrollable bleeding from wounds',
      'Deep head injury with loss of consciousness, confusion, or vomiting',
      'Ingestion of chemical poisons, pesticides, or medication overdose',
      'Continuous generalized convulsions or seizures lasting > 3 minutes',
    ],
    action: 'Apply firm direct pressure to bleeding; keep airway clear; call 112 immediately.',
  },
];
