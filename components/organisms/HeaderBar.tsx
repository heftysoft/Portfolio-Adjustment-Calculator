"use client";

import { Calculator, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { CURRENCIES } from '@/constants/currencies';
import { ThemeToggle } from '@/components/theme-toggle';
import { useCurrency } from '@/hooks/use-currency';
import { useLanguage } from '@/hooks/use-language';

interface HeaderBarProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
}

export function HeaderBar({ title, subtitle }: HeaderBarProps) {
  const { language, changeLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1"></div>
        <div className="flex items-center">
          <Calculator className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
        </div>
        <div className="flex-1 flex justify-end">
          <div className="flex items-center space-x-2">
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-16 min-w-[3.5rem] justify-center">
                {CURRENCIES.find(c => c.code === currency)?.symbol}
              </SelectTrigger>
              <SelectContent className="min-w-[10rem]">
                {CURRENCIES.map(cur => (
                  <SelectItem key={cur.code} value={cur.code}>
                    {cur.symbol} {t(`currencies.${cur.code}` as any)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={language} onValueChange={changeLanguage}>
              <SelectTrigger className="w-auto">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="bn">বাংলা</SelectItem>
              </SelectContent>
            </Select>
            <ThemeToggle />
          </div>
        </div>
      </div>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
} 