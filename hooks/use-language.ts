import { Language, translations } from '@/lib/translations';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [language, setLanguage] = useState<Language>(() => {
    // For initial render, use URL param or default. This is safe for SSR.
    const urlLang = searchParams.get('lang') as Language;
    return (urlLang && translations[urlLang]) ? urlLang : 'bn';
  });

  useEffect(() => {
    // This effect runs only on the client.
    const urlLang = searchParams.get('lang') as Language;
    if (urlLang && translations[urlLang]) {
      // If URL has lang, it's the source of truth.
      if (language !== urlLang) {
        setLanguage(urlLang);
        localStorage.setItem('portfolio-calculator-lang', urlLang);
      }
    } else {
      // If no lang in URL, check localStorage.
      const savedLang = localStorage.getItem('portfolio-calculator-lang') as Language;
      if (savedLang && translations[savedLang] && savedLang !== language) {
        setLanguage(savedLang);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    // This effect syncs the `language` state back to the URL and localStorage.
    if (!language) return;
    
    localStorage.setItem('portfolio-calculator-lang', language);

    const params = new URLSearchParams(searchParams.toString());
    if (params.get('lang') !== language) {
      params.set('lang', language);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [language]);

  const changeLanguage = (newLang: Language) => {
    setLanguage(newLang);
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