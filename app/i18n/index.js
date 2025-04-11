// i18n/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useLanguageStore } from '../store/languageStore';

// Initialize with Zustand integration
const initializeI18n = () => {
  const resources = {
    en: { translation: require('./locales/en.json') },
    es: { translation: require('./locales/es.json') },
    // Add more languages as needed
  };

  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3',
      lng: useLanguageStore.getState().language, // Get initial language from Zustand
      fallbackLng: 'es',
      resources,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });

  // Subscribe to language changes
  useLanguageStore.subscribe(
    (state) => state.language,
    (lang) => {
      i18n.changeLanguage(lang);
    }
  );

  return i18n;
};

export const getCurrentLanguage = () => { useLanguageStore.getState().language };
export default initializeI18n();