import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react';
import './index.css';

// === GOOGLE FORMS CONFIGURATION ===
// Replace this with the Action URL from your Google Form
const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeveQ8I8G4Gija5LZu6S5Z7pLmcGoC3caSnE-DdhIX713qnMA/formResponse";

// Mapping of step index to the exact Google Form entry ID
const FORM_ENTRIES = {
  1: "entry.606382618", // Q1: Biggest frustration
  2: "entry.545797915", // Q2: Tailoring handling
  3: "entry.395819988", // Q3: Try the website
  4: "entry.361439997", // Q4: Custom COD
  5: "entry.434998424"  // Q5: Beta User WhatsApp
};

const QUESTIONS = [
  {
    type: 'intro',
    title: 'Welcome to Noolu',
    subtitle: 'We are building a custom-fit clothing experience just for you. Help us understand your needs better.',
    buttonText: 'Start Survey',
  },
  {
    type: 'choice',
    title: 'What is your biggest frustration with buying clothes online?',
    malayalam: 'ഓൺലൈനായി വസ്ത്രങ്ങൾ വാങ്ങുമ്പോൾ നിങ്ങൾ നേരിടുന്ന പ്രധാന പ്രശ്നം എന്താണ്?',
    options: [
      { id: 'A', value: 'Option 1', text: 'Size/Fitting issues', malayalam: 'സൈസ്/ഫിറ്റിംഗ് ശരിയല്ല' },
      { id: 'B', value: 'Option 2', text: 'Low fabric quality', malayalam: 'തുണിയുടെ ഗുണമേന്മ കുറവ്' },
      { id: 'C', value: 'Option 3', text: "Designs don't match the photos", malayalam: 'ഡിസൈൻ ഫോട്ടോയിലേതുപോലെ അല്ല' },
      { id: 'D', value: 'Option 4', text: 'Delivery takes too long', malayalam: 'ഡെലിവറി വൈകുന്നു' }
    ]
  },
  {
    type: 'choice',
    title: 'How do you usually handle tailoring?',
    malayalam: 'നിങ്ങൾ സാധാരണയായി വസ്ത്രങ്ങൾ തയ്പ്പിക്കുന്നത് എങ്ങനെയാണ്?',
    options: [
      { id: 'A', value: 'Option 1', text: 'I visit a local tailor', malayalam: 'അടുത്തുള്ള ടെയ്‌ലറെ പോയി കാണുന്നു' },
      { id: 'B', value: 'Option 2', text: 'I buy readymade and alter them', malayalam: 'റെഡിമെയ്ഡ് വാങ്ങി പിന്നീട് ആൾട്ടർ ചെയ്യുന്നു' },
      { id: 'C', value: 'Option 3', text: 'I buy from online and hope they fit', malayalam: 'ഞാൻ ഓൺലൈനിൽ നിന്ന് വാങ്ങാറാണ് പതിവ്' },
      { id: 'D', value: 'Option 4', text: "I don't tailor clothes often", malayalam: 'സാധാരണയായി തയ്പ്പിക്കാറില്ല' }
    ]
  },
  {
    type: 'choice',
    title: 'If you could design your own neckline and sleeves on a website and give measurements via a simple video guide, would you try it?',
    malayalam: 'ഒരു വെബ്സൈറ്റ് വഴി നിങ്ങൾക്ക് ഇഷ്ടമുള്ള നെക്ക് ഡിസൈനും കൈകളും തിരഞ്ഞെടുക്കാനും വീഡിയോ കണ്ട് അളവുകൾ നൽകാനും സാധിച്ചാൽ നിങ്ങൾ അത് പരീക്ഷിക്കുമോ?',
    options: [
      { id: 'A', value: 'Option 1', text: 'Yes, definitely!', malayalam: 'തീർച്ചയായും!' },
      { id: 'B', value: 'Option 2', text: 'Maybe, depends on the price', malayalam: 'വില നോക്കി തീരുമാനിക്കും' },
      { id: 'C', value: 'Option 3', text: 'No, I prefer visiting a tailor in person', malayalam: 'നേരിട്ട് പോകുന്നതാണ് താല്പര്യം' }
    ]
  },
  {
    type: 'choice',
    title: 'For a custom-made garment, would you be comfortable paying a small advance and the rest via COD?',
    malayalam: 'നിങ്ങൾക്കായി മാത്രം തയ്ക്കുന്ന വസ്ത്രമായതിനാൽ, കുറച്ചു തുക മുൻകൂറായും ബാക്കി സാധനം കിട്ടുമ്പോൾ COD ആയും നൽകാൻ നിങ്ങൾക്ക് സമ്മതമാണോ?',
    options: [
      { id: 'A', value: 'Option 1', text: 'Yes, that sounds fair', malayalam: 'അതെ, അത് ശരിയാണ്' },
      { id: 'B', value: 'Option 2', text: 'I prefer 100% COD', malayalam: 'മുഴുവൻ തുകയും സാധനം കിട്ടുമ്പോൾ നൽകാനാണ് താല്പര്യം' },
      { id: 'C', value: 'Option 3', text: 'I prefer 100% Pre-payment', malayalam: 'മുഴുവൻ തുകയും മുൻകൂറായി നൽകാം' }
    ]
  },
  {
    type: 'text',
    title: 'Would you like to be a "Beta User" and get 20% off your first order?',
    malayalam: 'ഞങ്ങളുടെ ആദ്യത്തെ ഉപഭോക്താവാകാനും 20% ഡിസ്കൗണ്ട് നേടാനും നിങ്ങൾക്ക് താല്പര്യമുണ്ടോ? ഉണ്ടെങ്കിൽ വാട്സാപ്പ് നമ്പർ നൽകുക',
    placeholder: 'Enter your WhatsApp number'
  }
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [textInput, setTextInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const q = QUESTIONS[currentStep];
      if (q.type === 'choice') {
        const index = e.key.toLowerCase().charCodeAt(0) - 97; // a=0, b=1, etc.
        if (index >= 0 && index < q.options.length) {
          handleOptionSelect(q.options[index].value);
        }
      }
      if (e.key === 'Enter') {
        if (q.type === 'intro') nextStep();
        if (q.type === 'text' && textInput) submitForm();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        prevStep();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        nextStep();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, textInput]);

  const handleOptionSelect = (value) => {
    setAnswers({ ...answers, [currentStep]: value });
    setTimeout(nextStep, 400); // Small delay for UX
  };

  const nextStep = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    const finalAnswers = { ...answers, [currentStep]: textInput };
    
    // Build FormData for Google Forms
    const formData = new FormData();
    Object.keys(FORM_ENTRIES).forEach(stepIndex => {
      if (finalAnswers[stepIndex]) {
        formData.append(FORM_ENTRIES[stepIndex], finalAnswers[stepIndex]);
      }
    });

    try {
      if (GOOGLE_FORM_ACTION_URL !== "YOUR_GOOGLE_FORM_ACTION_URL_HERE") {
        await fetch(GOOGLE_FORM_ACTION_URL, {
          method: 'POST',
          mode: 'no-cors', // Essential for Google Forms
          body: formData
        });
      } else {
        console.warn("Please replace GOOGLE_FORM_ACTION_URL with your actual Google Form URL");
      }
    } catch (err) {
      console.error("Form submission error", err);
    }

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const progress = (currentStep / (QUESTIONS.length - 1)) * 100;

  if (isSubmitted) {
    return (
      <div className="survey-container completion-screen">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
        >
          <CheckCircle2 size={80} color="var(--text-color)" />
        </motion.div>
        <h1 className="question-text" style={{ fontSize: '2.5rem' }}>Thank You!</h1>
        <p className="malayalam-text">We'll be in touch soon.</p>
      </div>
    );
  }

  const q = QUESTIONS[currentStep];

  return (
    <>
      <div className="progress-bar" style={{ width: `${progress}%` }} />
      <div className="logo-container">
        {/* Simple text logo, can replace with actual SVG */}
        <div style={{ width: 24, height: 24, background: 'var(--text-color)', borderRadius: '50%' }} />
        Noolu
      </div>

      <div className="survey-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="question-block"
          >
            <div>
              {q.type !== 'intro' && (
                <div style={{ color: 'var(--text-color)', opacity: 0.6, marginBottom: '1rem', fontWeight: 600 }}>
                  {currentStep} →
                </div>
              )}
              <h1 className="question-text">{q.title}</h1>
              {q.malayalam && <p className="malayalam-text">{q.malayalam}</p>}
              {q.subtitle && <p className="malayalam-text" style={{ marginTop: '1rem' }}>{q.subtitle}</p>}
            </div>

            {q.type === 'intro' && (
              <button className="primary-button" onClick={nextStep}>
                {q.buttonText} <ArrowRight size={20} />
              </button>
            )}

            {q.type === 'choice' && (
              <div className="options-container">
                {q.options.map((opt, i) => {
                  const isSelected = answers[currentStep] === opt.value;
                  const keyChar = String.fromCharCode(65 + i); // A, B, C, D
                  return (
                    <button
                      key={i}
                      className={`option-button ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect(opt.value)}
                    >
                      <span className="key-hint">{keyChar}</span>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span>{opt.text}</span>
                        {opt.malayalam && <span style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '2px' }}>{opt.malayalam}</span>}
                      </div>
                      {isSelected && <Check size={20} style={{ marginLeft: 'auto' }} />}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === 'text' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <input
                  type="text"
                  className="text-input"
                  placeholder={q.placeholder}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  autoFocus
                />
                <button
                  className="primary-button"
                  onClick={submitForm}
                  disabled={!textInput.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'} <Check size={20} />
                </button>
              </div>
            )}
            
            {q.type !== 'intro' && q.type !== 'text' && (
              <div className="nav-hint">
                Press a key to select or click an option.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {!isSubmitted && (
        <div className="bottom-nav">
          <div className="nav-arrows">
            <button className="nav-arrow" onClick={prevStep} disabled={currentStep === 0} aria-label="Previous question">
              <ChevronUp size={24} />
            </button>
            <button className="nav-arrow" onClick={nextStep} disabled={currentStep === QUESTIONS.length - 1} aria-label="Next question">
              <ChevronDown size={24} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
