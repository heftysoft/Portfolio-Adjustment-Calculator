import { useEffect, useState } from 'react';

import { CURRENCIES } from '@/constants/currencies';
import { useCurrency } from '@/hooks/use-currency';
import { useLanguage } from '@/hooks/use-language';

export function usePortfolioCalculator() {
  const { language, t } = useLanguage();
  const { currency } = useCurrency();

  // State for result and chart
  const [result, setResult] = useState<any>(null);
  const [inputs, setInputs] = useState<any>(null);
  const [chartData, setChartData] = useState<{
    name: string;
    shares: number;
    averageCost: number;
    totalValue: number;
    totalCost: number;
  }[]>([]);
  const [formKey, setFormKey] = useState(0); // for resetting form on preset
  const [presetValues, setPresetValues] = useState<any>(undefined);

  // Formatting helpers
  const formatCurrency = (amount: number, currencyCode?: string) => {
    const code = currencyCode || currency;
    const cur = CURRENCIES.find(c => c.code === code);
    const symbol = cur?.symbol || '৳';
    let formattedAmount;
    if (code === 'JPY') {
      formattedAmount = formatNumber(Math.round(amount));
    } else {
      formattedAmount = formatNumber(parseFloat(amount.toFixed(2)));
    }
    return `${symbol}${formattedAmount}`;
  };

  const formatNumber = (num: number) => {
    if (language === 'bn') {
      return num.toLocaleString('bn-BD');
    }
    return num.toLocaleString('en-US');
  };

  // Listen for result changes from PortfolioForm
  const handleResultChange = (newResult: any, values: any) => {
    setResult(newResult);
    setInputs(values);
    if (!newResult) return;
    setChartData([
      {
        name: 'current',
        shares: Math.round(values.currentHoldings),
        averageCost: values.averageCost,
        totalValue: values.currentHoldings * values.marketPrice,
        totalCost: values.currentHoldings * values.averageCost
      },
      {
        name: 'afterAdjustment',
        shares: Math.round(newResult.newTotalShares),
        averageCost: newResult.newAverageCost,
        totalValue: newResult.newTotalShares * values.marketPrice,
        totalCost: newResult.newTotalShares * newResult.newAverageCost
      }
    ]);
  };

  // Handle preset load by resetting form
  const loadPreset = (preset: { name: string; data: any }) => {
    setPresetValues({
      ...preset.data,
      targetAverage: (preset.data.averageCost + preset.data.marketPrice) / 2,
    });
    setFormKey(prev => prev + 1);
  };

  // Custom tooltip formatter for chart
  const customTooltipFormatter = (value: any, name: string) => {
    if (name === 'shares' || name === 'মোট শেয়ার' || name === 'Total Shares') {
      return [formatNumber(value), t('totalShares')];
    }
    return [formatCurrency(value, inputs?.currency), name === 'averageCost' ? t('averageCost') : name];
  };

  // Recreate chart data when language changes
  useEffect(() => {
    if (result && inputs) {
      setChartData([
        {
          name: 'current',
          shares: Math.round(inputs.currentHoldings),
          averageCost: inputs.averageCost,
          totalValue: inputs.currentHoldings * inputs.marketPrice,
          totalCost: inputs.currentHoldings * inputs.averageCost
        },
        {
          name: 'afterAdjustment',
          shares: Math.round(result.newTotalShares),
          averageCost: result.newAverageCost,
          totalValue: result.newTotalShares * inputs.marketPrice,
          totalCost: result.newTotalShares * result.newAverageCost
        }
      ]);
    }
  }, [language, result, inputs]);

  return {
    result,
    setResult,
    inputs,
    setInputs,
    chartData,
    setChartData,
    formKey,
    setFormKey,
    presetValues,
    setPresetValues,
    formatCurrency,
    formatNumber,
    handleResultChange,
    loadPreset,
    customTooltipFormatter,
  };
} 