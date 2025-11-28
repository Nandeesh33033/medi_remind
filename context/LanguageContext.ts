import { createContext } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: Language.EN,
  setLanguage: () => {},
});

export const LanguageProvider = LanguageContext.Provider;