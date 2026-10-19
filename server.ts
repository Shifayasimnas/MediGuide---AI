import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI on the server side
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const STANDARD_DISCLAIMER =
  'MediGuide AI provides general health educational information only. It is NOT medical advice, a diagnostic tool, or a prescribing service. Always consult a qualified healthcare professional for medical evaluation and personalized treatment. In emergencies in India, dial 112 immediately.';

// Emergency Keywords Quick Triage Check
const EMERGENCY_KEYWORDS = [
  'crushing chest pain',
  'chest pain radiating',
  'difficulty breathing',
  'cannot breathe',
  'struggling to breathe',
  'choking',
  'face drooping',
  'slurred speech',
  'paralysis',
  'sudden weakness one side',
  'anaphylaxis',
  'swelling of lips and throat',
  'sudden loss of vision',
  'coughing blood',
  'vomiting blood',
  'unconscious',
  'seizure lasting',
  'poisoning',
  'overdose',
  'severe burn',
  'profuse bleeding',
  'severe head trauma',
  'suicide',
];

function checkKeywordEmergency(text: string): boolean {
  const lower = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some((kw) => lower.includes(kw));
}

// 1. Health Q&A Endpoint
app.post('/api/health-qa', async (req: Request, res: Response) => {
  try {
    const { question, context } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    const keywordEmergency = checkKeywordEmergency(question + (context || ''));

    const systemInstruction = `You are MediGuide AI, an empathetic, highly knowledgeable, and strictly ethical healthcare information assistant.
CRITICAL SAFETY DIRECTIVES:
1. NEVER diagnose a medical condition or state that the user has a specific illness. Always frame as general educational possibilities that a physician evaluates.
2. NEVER prescribe medication, recommend specific therapeutic dosages, or advise altering prescription regimens.
3. If the user describes emergency symptoms (e.g., severe chest pain, stroke signs like FAST, severe breathing difficulty, anaphylaxis, severe bleeding, sudden confusion/unresponsiveness), set isEmergency to true, prioritize emergency advice, and highlight calling India's emergency helpline 112 (or their local emergency number).
4. Emphasize evidence-based health education, lifestyle prevention, clear anatomical/physiological facts, and guidance on how to speak productively with a doctor.
5. MediGuide AI never stores personal health data; do not ask the user for identifying personal medical records.`;

    const prompt = `User Health Question: "${question}"
${context ? `Additional Context: "${context}"` : ''}

Provide a well-structured educational response following the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: {
              type: Type.STRING,
              description: 'Clear, readable, empathetic educational answer (approx 2-4 paragraphs).',
            },
            isEmergency: {
              type: Type.BOOLEAN,
              description: 'True if symptoms could represent an acute medical emergency.',
            },
            emergencyAdvice: {
              type: Type.STRING,
              description: 'Urgent immediate action guidance if an emergency is suspected, including calling 112.',
            },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-4 concise educational summary bullets.',
            },
            whenToSeeDoctor: {
              type: Type.STRING,
              description: 'Clear guidance on clinical signs or durations that warrant scheduling a medical visit.',
            },
            suggestedFollowUps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 related health education questions the user might want to explore.',
            },
          },
          required: ['answer', 'isEmergency', 'keyTakeaways', 'whenToSeeDoctor', 'suggestedFollowUps'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (keywordEmergency) {
      parsed.isEmergency = true;
      if (!parsed.emergencyAdvice) {
        parsed.emergencyAdvice =
          'Potential acute emergency warning detected. Please seek immediate emergency medical care or call 112 (India) / your local emergency services without delay.';
      }
    }
    parsed.disclaimer = STANDARD_DISCLAIMER;

    res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/health-qa:', err);
    res.status(500).json({
      error: 'Failed to process health education request',
      details: err?.message || 'Server error',
    });
  }
});

// 2. Symptom Information Guide Endpoint
app.post('/api/symptom-guide', async (req: Request, res: Response) => {
  try {
    const { symptom, duration, severity, bodySystem, additionalNotes } = req.body;
    if (!symptom) {
      return res.status(400).json({ error: 'Symptom description is required' });
    }

    const keywordEmergency =
      checkKeywordEmergency(`${symptom} ${additionalNotes || ''}`) || Number(severity) >= 9;

    const systemInstruction = `You are the Symptom Information Guide engine of MediGuide AI.
CRITICAL SAFETY DIRECTIVES:
1. STRICTLY NO DIAGNOSIS: Do NOT say "You have X". Instead, state "When patients present with these symptoms, healthcare providers typically investigate several possibilities such as...".
2. NO PRESCRIPTIONS: Do not tell the user to take specific medications or dosages.
3. EMERGENCY FIRST: If symptoms involve severe warning signs (e.g. chest pain, breathing distress, stroke symptoms, high fever with stiff neck, severe abdominal rigidity), set isEmergency: true and provide urgent emergency instructions prominently featuring calling 112 in India.
4. Explain what a doctor looks for during physical examination and diagnostic evaluation.
5. Provide safe, non-medicinal comfort measures (e.g., hydration, rest, ice/warm compress where appropriate).`;

    const prompt = `Patient Symptom Profile:
- Chief Symptom: ${symptom}
- Duration: ${duration || 'Not specified'}
- Severity Scale (1-10): ${severity || '5'}
- Suspected Body System / Area: ${bodySystem || 'General'}
- Additional Notes / Associated Signs: ${additionalNotes || 'None provided'}

Generate a structured clinical education guide.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: {
              type: Type.STRING,
              description: 'Empathetic educational overview of how the body manifests this symptom.',
            },
            isEmergency: {
              type: Type.BOOLEAN,
              description: 'Whether immediate emergency medical attention is warranted.',
            },
            emergencyFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Specific red flag warning signs that require calling 112 / going to the nearest Emergency Room.',
            },
            whatDoctorsEvaluate: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Key clinical factors a doctor evaluates (e.g. onset, triggers, localization, lab work).',
            },
            possibleEducationalContexts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Broad medical categories doctors consider for differential diagnosis (explicitly framed as non-diagnostic).',
            },
            supportiveComfortMeasures: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Safe, general non-medicinal comfort and monitoring practices at home.',
            },
            whenToSeekUrgentCare: {
              type: Type.STRING,
              description: 'Explicit timeline or escalating symptoms that require prompt doctor evaluation.',
            },
            doctorQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-4 practical questions to ask the doctor during the visit.',
            },
          },
          required: [
            'overview',
            'isEmergency',
            'emergencyFlags',
            'whatDoctorsEvaluate',
            'possibleEducationalContexts',
            'supportiveComfortMeasures',
            'whenToSeekUrgentCare',
            'doctorQuestions',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (keywordEmergency) {
      parsed.isEmergency = true;
    }
    parsed.disclaimer = STANDARD_DISCLAIMER;

    res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/symptom-guide:', err);
    res.status(500).json({
      error: 'Failed to generate symptom guide',
      details: err?.message || 'Server error',
    });
  }
});

// 3. General Medicine Information Endpoint
app.post('/api/medicine-info', async (req: Request, res: Response) => {
  try {
    const { medicineName } = req.body;
    if (!medicineName || typeof medicineName !== 'string') {
      return res.status(400).json({ error: 'Medicine name is required' });
    }

    const systemInstruction = `You are MediGuide AI's Medicine Information module.
CRITICAL SAFETY DIRECTIVES:
1. STRICTLY NO PRESCRIBING & NO INDIVIDUAL DOSAGE: Never calculate, recommend, or prescribe a dose for the user (e.g. do not say "Take 500mg twice a day"). State clearly: "Dosing must be determined exclusively by a licensed prescribing doctor or pharmacist based on your specific health profile."
2. Provide general pharmacological education: drug classification, standard therapeutic purpose, general administration practices (e.g., take with food/water, don't crush modified-release pills), important safety precautions, and interactions.
3. Highlight potential adverse reactions and contrast mild common effects with serious red flags requiring immediate medical review.
4. Reinforce that prescription medications require valid medical prescription and supervision.`;

    const prompt = `Provide general educational reference for the medication: "${medicineName}".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            medicineName: { type: Type.STRING },
            pharmacologicalClass: {
              type: Type.STRING,
              description: 'Drug category or chemical class (e.g., Non-steroidal anti-inflammatory drug, Beta-blocker, etc.).',
            },
            generalPurpose: {
              type: Type.STRING,
              description: 'General medical indications approved for this medication.',
            },
            howItWorks: {
              type: Type.STRING,
              description: 'Plain-language explanation of physiological mechanism.',
            },
            generalAdministrationFacts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'General standard practices (e.g., with full glass of water, with/without meals, consistent timing). Strictly NO dosage numbers.',
            },
            criticalPrecautions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Key contraindications (pregnancy, renal/hepatic warnings, alcohol interaction).',
            },
            commonSideEffects: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Commonly reported mild side effects to discuss with pharmacist.',
            },
            seriousSignsToSeekHelp: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Severe symptoms (e.g., severe rash, breathing trouble, jaundice) requiring immediate medical attention.',
            },
            storageGuidelines: {
              type: Type.STRING,
              description: 'Standard medication storage conditions (temperature, moisture, light).',
            },
            questionsForPharmacist: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Helpful questions to ask the dispensing pharmacist.',
            },
          },
          required: [
            'medicineName',
            'pharmacologicalClass',
            'generalPurpose',
            'howItWorks',
            'generalAdministrationFacts',
            'criticalPrecautions',
            'commonSideEffects',
            'seriousSignsToSeekHelp',
            'storageGuidelines',
            'questionsForPharmacist',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    parsed.disclaimer =
      'Educational reference only. Do not start, discontinue, or alter any medication or dosage without direct consultation with a qualified doctor or licensed pharmacist. MediGuide AI never prescribes medications.';

    res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/medicine-info:', err);
    res.status(500).json({
      error: 'Failed to fetch medicine information',
      details: err?.message || 'Server error',
    });
  }
});

// 4. Generate Doctor Questions Endpoint
app.post('/api/doctor-questions', async (req: Request, res: Response) => {
  try {
    const { reasonForVisit, patientAgeGroup, symptoms, knownConditions } = req.body;
    if (!reasonForVisit) {
      return res.status(400).json({ error: 'Reason for visit is required' });
    }

    const systemInstruction = `You are MediGuide AI's Doctor Consultation Preparation Assistant.
Help patients advocate for their health by generating smart, thoughtful, prioritized questions for their upcoming medical appointment.
Categories:
1. Diagnosis & Understanding (What could be causing this?)
2. Tests & Evaluation (What diagnostic tests are recommended and why?)
3. Treatment Options & Safety (What are the benefits, risks, and alternatives?)
4. Home Management & Prevention (What should I do at home?)
5. Red Flags & Follow-up (When should I return or seek emergency care?)
Keep questions concise, direct, and respectful of clinical time.`;

    const prompt = `Appointment Details:
- Reason for Visit: ${reasonForVisit}
- Patient Age Group: ${patientAgeGroup || 'Adult'}
- Current Symptoms: ${symptoms || 'None specified'}
- Existing Health Conditions: ${knownConditions || 'None specified'}

Generate prioritized questions for the doctor.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            consultationSummary: {
              type: Type.STRING,
              description: 'Brief summary of the focus of this appointment.',
            },
            diagnosisQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Questions regarding what might be causing the symptoms.',
            },
            testingQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Questions regarding recommended diagnostic tests, blood work, or scans.',
            },
            treatmentQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Questions regarding treatments, side effects, and options.',
            },
            lifestyleQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Questions regarding diet, activity, and self-care.',
            },
            redFlagFollowUpQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Questions on when to schedule follow-up or seek emergency care.',
            },
          },
          required: [
            'consultationSummary',
            'diagnosisQuestions',
            'testingQuestions',
            'treatmentQuestions',
            'lifestyleQuestions',
            'redFlagFollowUpQuestions',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    parsed.disclaimer = STANDARD_DISCLAIMER;
    res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/doctor-questions:', err);
    res.status(500).json({
      error: 'Failed to generate doctor questions',
      details: err?.message || 'Server error',
    });
  }
});

// 5. Generate Copyable Symptom Summary for Doctor Endpoint
app.post('/api/symptom-summary', async (req: Request, res: Response) => {
  try {
    const {
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
      questionsToAsk,
    } = req.body;

    if (!chiefComplaint) {
      return res.status(400).json({ error: 'Chief complaint is required' });
    }

    const systemInstruction = `You are MediGuide AI's Clinical Visit Summary Formatter.
Convert patient-provided symptom information into a concise, professional, standard clinical format (HPI - History of Present Illness structure) that a physician can scan in under 30 seconds.
Format clearly with:
1. PATIENT VISIT BRIEF (Age group, Date prepared)
2. CHIEF COMPLAINT (Primary issue in patient's words)
3. HISTORY OF PRESENT ILLNESS (Onset, Duration, Severity [1-10], Nature/Quality of symptoms, Triggers/Relieving factors)
4. BACKGROUND CONTEXT (Reported conditions, Current medications, Known allergies)
5. PATIENT QUESTIONS FOR THE DOCTOR
Ensure the output is clean plain text, perfect for copying to clipboard or printing.`;

    const prompt = `Patient Input Data:
- Age Group / Age: ${patientAge || 'Adult'}
- Chief Complaint: ${chiefComplaint}
- Onset & Timeline: ${onsetDuration || 'Not specified'}
- Severity (1-10): ${severity || '5'}
- Symptom Characteristics: ${characteristics || 'Not specified'}
- Aggravating Factors (What makes it worse): ${aggravatingFactors || 'None noted'}
- Relieving Factors (What makes it better): ${relievingFactors || 'None noted'}
- Existing Medical Conditions: ${existingConditions || 'None reported'}
- Current Medications / Supplements: ${currentMedications || 'None reported'}
- Known Drug / Food Allergies: ${allergies || 'No known allergies reported'}
- Patient Questions: ${(questionsToAsk || []).join('; ') || 'General consultation questions'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plainTextSummary: {
              type: Type.STRING,
              description: 'Complete, structured, formatted plain text note ready to copy or print.',
            },
            structuredHPI: {
              type: Type.OBJECT,
              properties: {
                chiefConcern: { type: Type.STRING },
                timeline: { type: Type.STRING },
                severityScore: { type: Type.STRING },
                symptomDetails: { type: Type.STRING },
                modulatingFactors: { type: Type.STRING },
                background: { type: Type.STRING },
                keyQuestionsList: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                'chiefConcern',
                'timeline',
                'severityScore',
                'symptomDetails',
                'modulatingFactors',
                'background',
                'keyQuestionsList',
              ],
            },
          },
          required: ['plainTextSummary', 'structuredHPI'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    parsed.disclaimer = STANDARD_DISCLAIMER;
    res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/symptom-summary:', err);
    res.status(500).json({
      error: 'Failed to generate symptom summary',
      details: err?.message || 'Server error',
    });
  }
});

// Setup Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`MediGuide AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start MediGuide AI server:', err);
  process.exit(1);
});
