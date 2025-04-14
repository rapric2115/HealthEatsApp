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

  // Get initial language from Zustand with fallback
  const initialLanguage = useLanguageStore.getState().language || 'es';

  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3',
      lng: initialLanguage,
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

// Fixed getCurrentLanguage function
export const getCurrentLanguage = () => {
  try {
    // Get current language from Zustand with fallback
    return useLanguageStore.getState().language || 'es';
  } catch (error) {
    console.error('Error getting language:', error);
    return 'es'; // Fallback to Spanish if there's an error
  }
};

export default initializeI18n();