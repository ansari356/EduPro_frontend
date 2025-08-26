import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAutoTranslate } from '../../hooks/useAutoTranslate';

export default function TranslationTest() {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { translate, translateWithLibreTranslate } = useAutoTranslate();
  const [testResults, setTestResults] = useState([]);

  const runTests = () => {
    const results = [];
    
    // Test 1: Basic translation
    const test1 = translate("Published");
    results.push(`Test 1 - translate("Published"): "${test1}"`);
    
    // Test 2: Another basic translation
    const test2 = translate("Draft");
    results.push(`Test 2 - translate("Draft"): "${test2}"`);
    
    // Test 3: Test with fallback key
    const test3 = translate("students", "common.students");
    results.push(`Test 3 - translate("students", "common.students"): "${test3}"`);
    
    // Test 4: Test current language
    results.push(`Test 4 - Current language: "${currentLanguage}"`);
    
    // Test 5: Test i18n function
    const test5 = translate("test", "common.test");
    results.push(`Test 5 - translate with fallback: "${test5}"`);
    
    setTestResults(results);
  };

  const testLibreTranslate = async () => {
    try {
      const result = await translateWithLibreTranslate("Hello World");
      setTestResults(prev => [...prev, `LibreTranslate test: "Hello World" -> "${result}"`]);
    } catch (error) {
      setTestResults(prev => [...prev, `LibreTranslate error: ${error.message}`]);
    }
  };

  return (
    <div className="card p-4 m-3">
      <h4>Translation System Test</h4>
      
      <div className="mb-3">
        <p><strong>Current Language:</strong> {currentLanguage}</p>
        <button 
          className="btn btn-primary me-2" 
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
      
      <div className="mb-3">
        <button className="btn btn-success me-2" onClick={runTests}>
          Run Translation Tests
        </button>
        <button className="btn btn-info" onClick={testLibreTranslate}>
          Test LibreTranslate
        </button>
      </div>
      
      {testResults.length > 0 && (
        <div className="mb-3">
          <h6>Test Results:</h6>
          <div className="border rounded p-2 bg-light">
            {testResults.map((result, index) => (
              <div key={index} className="mb-1">
                <code>{result}</code>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="alert alert-info">
        <strong>What to check:</strong>
        <ul className="mb-0 mt-2">
          <li>Switch language to Arabic</li>
          <li>Run the translation tests</li>
          <li>Check console for debug logs</li>
          <li>Verify that "Published" becomes "منشور"</li>
          <li>Verify that "Draft" becomes "مسودة"</li>
        </ul>
      </div>
    </div>
  );
}
