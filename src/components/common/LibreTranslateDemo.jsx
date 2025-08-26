import React, { useState } from 'react';
import { useAutoTranslate } from '../../hooks/useAutoTranslate';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * Demo component showing how to use LibreTranslate for real-time translation
 */
export default function LibreTranslateDemo() {
  const { translateWithLibreTranslate } = useAutoTranslate();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    try {
      const result = await translateWithLibreTranslate(inputText, 'ar');
      setTranslatedText(result);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="card p-4">
      <h4>LibreTranslate Demo</h4>
      <p>Current Language: {currentLanguage}</p>
      
      <div className="mb-3">
        <label className="form-label">Enter English text to translate:</label>
        <textarea
          className="form-control"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text in English..."
          rows="3"
        />
      </div>
      
      <div className="mb-3">
        <button
          className="btn btn-primary"
          onClick={handleTranslate}
          disabled={isTranslating || !inputText.trim()}
        >
          {isTranslating ? 'Translating...' : 'Translate to Arabic'}
        </button>
      </div>
      
      {translatedText && (
        <div className="mb-3">
          <label className="form-label">Translation:</label>
          <div className="form-control-plaintext border rounded p-2 bg-light">
            {translatedText}
          </div>
        </div>
      )}
      
      <div className="mb-3">
        <button
          className="btn btn-secondary me-2"
          onClick={() => changeLanguage('en')}
          disabled={currentLanguage === 'en'}
        >
          Switch to English
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => changeLanguage('ar')}
          disabled={currentLanguage === 'ar'}
        >
          Switch to Arabic
        </button>
      </div>
      
      <div className="alert alert-info">
        <strong>How it works:</strong>
        <ul className="mb-0 mt-2">
          <li>Enter English text in the textarea</li>
          <li>Click "Translate to Arabic" to use LibreTranslate API</li>
          <li>The API will translate the text in real-time</li>
          <li>Switch languages to see how the UI changes</li>
        </ul>
      </div>
    </div>
  );
}
