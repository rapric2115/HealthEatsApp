import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useLanguageStore } from '../store/languageStore';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, Check } from 'lucide-react-native';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const { language, availableLanguages, setLanguage } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  const currentLanguage = availableLanguages.find(lang => lang.code === language);

  return (
    <View className="relative z-50">
      <TouchableOpacity
        className="bg-blue-500 py-3 px-6 rounded-lg flex-row items-center justify-center"
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text className="text-white font-semibold mr-2">
          {currentLanguage?.name}
        </Text>
        {isOpen ? (
          <ChevronUp size={18} color="white" />
        ) : (
          <ChevronDown size={18} color="white" />
        )}
      </TouchableOpacity>

      {isOpen && (
        <View className="absolute top-12 right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
          {availableLanguages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              className={`flex-row items-center justify-between px-4 py-3 ${language === lang.code ? 'bg-blue-50' : ''}`}
              onPress={() => handleLanguageChange(lang.code)}
            >
              <Text className={`${language === lang.code ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                {lang.name}
              </Text>
              {language === lang.code && (
                <Check size={18} color="#3B82F6" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default LanguageSwitcher;