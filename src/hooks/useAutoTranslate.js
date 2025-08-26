import { useLanguage } from '../contexts/LanguageContext';

/**
 * Custom hook for automatic translation of API data
 * @param {string} text - The text to translate
 * @param {string} fallbackKey - Optional fallback translation key
 * @returns {string} - Translated text or original text if no translation found
 */
export const useAutoTranslate = () => {
  const { translateText, translateWithLibreTranslate } = useLanguage();
  
  return {
    translate: translateText,
    translateWithLibreTranslate, // LibreTranslate API function
    // Convenience methods for common translations
    translateStatus: (status) => translateText(status, `common.${status?.toLowerCase()}`),
    translateType: (type) => translateText(type, `common.${type?.toLowerCase()}`),
    translateAction: (action) => translateText(action, `common.${action?.toLowerCase()}`)
  };
};
