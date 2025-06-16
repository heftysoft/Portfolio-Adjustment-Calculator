import { Language, translations } from '@/lib/translations';
import { useEffect, useState } from 'react';

type Join<K, P> = K extends string | number ?
  P extends string | number ?
    `${K}${'' extends P ? '' : '.'}${P}`
    : never : never;

type Paths<T, D extends number = 3> = [D] extends [never] ? never : T extends object ?
  { [K in keyof T]-?: K extends string | number ?
    `${K}` | Join<K, Paths<T[K], Prev[D]>>
    : never
  }[keyof T] : '';

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('bn'); // Default to Bangla

  useEffect(() => {
    // Check URL parameters for language
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang') as Language;
    
    if (urlLang && translations[urlLang]) {
      setLanguage(urlLang);
    } else {
      // Check localStorage
      const savedLang = localStorage.getItem('portfolio-calculator-lang') as Language;
      if (savedLang && translations[savedLang]) {
        setLanguage(savedLang);
      }
    }
  }, []);

  const changeLanguage = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('portfolio-calculator-lang', newLang);
    
    // Update URL parameter
    const params = new URLSearchParams(window.location.search);
    params.set('lang', newLang);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  const t = (key: Paths<typeof translations.en>): string => {
    const keys = key.split('.') as string[];
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || translations.en[key as keyof typeof translations.en] || key;
  };

  return { language, changeLanguage, t };
}