import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { CURRENCIES } from '@/constants/currencies';
import { PRESETS } from '@/constants/preset';
import React from 'react';
import { TranslationKey } from '@/lib/translations';
import { TrendingUp } from 'lucide-react';
import { useCurrency } from '@/hooks/use-currency';
import { useLanguage } from '@/hooks/use-language';

interface Preset {
  name: string;
  data: {
    currentHoldings: number;
    averageCost: number;
    marketPrice: number;
    maxInvestment: number;
    currency: string;
  };
}

interface PortfolioPresetsPanelProps {
  loadPreset: (preset: Preset) => void;
  formatNumber: (num: number) => string;
}

export function PortfolioPresetsPanel({ loadPreset, formatNumber }: PortfolioPresetsPanelProps) {
  const { t } = useLanguage();
  const { currency } = useCurrency();
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          {t('quickPresets')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESETS.map((preset, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => loadPreset(preset)}
              className="h-auto p-4 text-left flex flex-col items-start hover:shadow-md transition-shadow"
            >
              <span className="font-semibold text-sm">{t(`presets.${preset.name}`as TranslationKey)}</span>
              <span className="text-xs text-gray-500 mt-1">
                {formatNumber(preset.data.currentHoldings)} {t('totalShares')} @ {CURRENCIES.find(c => c.code === currency)?.symbol || '৳'} {formatNumber(preset.data.averageCost)}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 