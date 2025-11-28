import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { translations } from '../constants';

export const useTranslation = () => {
  const { language } = useContext(LanguageContext);

  const t = (key: keyof typeof translations): string => {
    return translations[key][language] || translations[key]['en'];
  };

  return { t, language };
};