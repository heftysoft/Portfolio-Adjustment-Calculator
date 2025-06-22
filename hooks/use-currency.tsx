"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface CurrencyContextType {
  currency: string;
  setCurrency: (code: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [currency, setCurrencyState] = useState<string>(() => {
    // For initial render, use URL param or default. This is safe for SSR.
    return searchParams.get('currency') || 'BDT';
  });

  useEffect(() => {
    // This effect runs only on the client.
    const urlCurrency = searchParams.get('currency');
    if (urlCurrency) {
      // If URL has currency, it's the source of truth.
      // We also update localStorage to keep it in sync.
      if (currency !== urlCurrency) {
        setCurrencyState(urlCurrency);
        localStorage.setItem('currency', urlCurrency);
      }
    } else {
      // If no currency in URL, check localStorage.
      const storedCurrency = localStorage.getItem('currency');
      if (storedCurrency && storedCurrency !== currency) {
        setCurrencyState(storedCurrency);
      }
    }
    // We only want this to run when the URL search params change.
    // The `currency` state is managed by other effects.
  }, [searchParams]);

  useEffect(() => {
    // This effect syncs the `currency` state back to the URL and localStorage.
    if (!currency) return;
    
    // Update localStorage whenever currency state changes.
    localStorage.setItem('currency', currency);

    const params = new URLSearchParams(searchParams.toString());
    if (params.get('currency') !== currency) {
      params.set('currency', currency);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [currency, pathname, router, searchParams]);

  const setCurrency = (code: string) => {
    setCurrencyState(code);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
} 