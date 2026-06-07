// Language Context - RTL/LTR and translation support
import { createContext, useContext, useState, useEffect } from 'react';
import translations from '../lib/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('ar'); // Default Arabic

  useEffect(() => {
    // Load saved language preference
    const saved = localStorage.getItem('khareef_lang');
    if (saved) setLang(saved);
  }, []);

  useEffect(() => {
    // Apply RTL/LTR to document
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('khareef_lang', lang);
  }, [lang]);

  const t = (key) => translations[lang]?.[key] || translations['en']?.[key] || key;
  const isRTL = lang === 'ar';

  const toggleLanguage = () => setLang(prev => prev === 'ar' ? 'en' : 'ar');

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
};

export default LanguageContext;
