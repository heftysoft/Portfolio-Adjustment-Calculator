"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calculator, Share2, AlertCircle, DollarSign, Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface CalculatorInputs {
  currentHoldings: number;
  averageCost: number;
  marketPrice: number;
  maxInvestment: number;
  currency: string;
  targetAverage: number;
}

interface CalculationResult {
  sharesToBuy: number;
  totalInvestment: number;
  newAverageCost: number;
  newTotalShares: number;
  isValid: boolean;
  message: string;
}

const CURRENCIES = [
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', nameBn: 'বাংলাদেশী টাকা' },
  { code: 'USD', symbol: '$', name: 'US Dollar', nameBn: 'মার্কিন ডলার' },
  { code: 'EUR', symbol: '€', name: 'Euro', nameBn: 'ইউরো' },
  { code: 'GBP', symbol: '£', name: 'British Pound', nameBn: 'ব্রিটিশ পাউন্ড' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', nameBn: 'জাপানি ইয়েন' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', nameBn: 'কানাডিয়ান ডলার' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', nameBn: 'অস্ট্রেলিয়ান ডলার' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', nameBn: 'ভারতীয় রুপি' },
];

export default function PortfolioCalculator() {
  const { language, changeLanguage, t } = useLanguage();
  
  const [inputs, setInputs] = useState<CalculatorInputs>({
    currentHoldings: 100,
    averageCost: 150,
    marketPrice: 120,
    maxInvestment: 5000,
    currency: 'BDT',
    targetAverage: 135
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [sliderRange, setSliderRange] = useState([120, 150]);
  const [targetAverageInput, setTargetAverageInput] = useState('135');

  const PRESETS = [
    {
      name: t('presets.techStock'),
      data: { currentHoldings: 100, averageCost: 150, marketPrice: 120, maxInvestment: 5000, currency: 'BDT' }
    },
    {
      name: t('presets.valueInvestment'),
      data: { currentHoldings: 250, averageCost: 45, marketPrice: 38, maxInvestment: 3000, currency: 'BDT' }
    },
    {
      name: t('presets.growthStock'),
      data: { currentHoldings: 50, averageCost: 200, marketPrice: 180, maxInvestment: 8000, currency: 'BDT' }
    },
    {
      name: t('presets.dividendStock'),
      data: { currentHoldings: 300, averageCost: 75, marketPrice: 70, maxInvestment: 4000, currency: 'BDT' }
    }
  ];

  // Load from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlInputs = { ...inputs };
    
    Object.keys(inputs).forEach(key => {
      const value = params.get(key);
      if (value && key !== 'currency') {
        (urlInputs as any)[key] = parseFloat(value);
      } else if (value && key === 'currency') {
        (urlInputs as any)[key] = value;
      }
    });

    setInputs(urlInputs);
    setTargetAverageInput(urlInputs.targetAverage.toString());
  }, []);

  // Update slider range when market price or average cost changes
  useEffect(() => {
    const min = Math.min(inputs.marketPrice, inputs.averageCost);
    const max = Math.max(inputs.marketPrice, inputs.averageCost);
    setSliderRange([min, max]);
    
    // Set target average to middle of range if not set or out of range
    if (inputs.targetAverage < min || inputs.targetAverage > max) {
      const newTarget = (min + max) / 2;
      setInputs(prev => ({ ...prev, targetAverage: newTarget }));
      setTargetAverageInput(newTarget.toString());
    }
  }, [inputs.marketPrice, inputs.averageCost]);

  const calculateAdjustment = useCallback((calculatorInputs: CalculatorInputs): CalculationResult => {
    const { currentHoldings, averageCost, marketPrice, maxInvestment, targetAverage } = calculatorInputs;

    // Validation
    if (currentHoldings <= 0 || averageCost <= 0 || marketPrice <= 0 || maxInvestment <= 0) {
      return {
        sharesToBuy: 0,
        totalInvestment: 0,
        newAverageCost: averageCost,
        newTotalShares: currentHoldings,
        isValid: false,
        message: t('errors.allPositive')
      };
    }

    if (targetAverage < Math.min(marketPrice, averageCost) || targetAverage > Math.max(marketPrice, averageCost)) {
      return {
        sharesToBuy: 0,
        totalInvestment: 0,
        newAverageCost: averageCost,
        newTotalShares: currentHoldings,
        isValid: false,
        message: t('errors.targetRange')
      };
    }

    // If market price equals target average, can't adjust
    if (Math.abs(marketPrice - targetAverage) < 0.01) {
      return {
        sharesToBuy: 0,
        totalInvestment: 0,
        newAverageCost: averageCost,
        newTotalShares: currentHoldings,
        isValid: false,
        message: t('errors.noAdjustmentNeeded')
      };
    }

    // Calculate shares needed
    const numerator = currentHoldings * (targetAverage - averageCost);
    const denominator = marketPrice - targetAverage;
    
    if (Math.abs(denominator) < 0.01) {
      return {
        sharesToBuy: 0,
        totalInvestment: 0,
        newAverageCost: averageCost,
        newTotalShares: currentHoldings,
        isValid: false,
        message: t('errors.cannotCalculate')
      };
    }

    const sharesToBuy = numerator / denominator;

    if (sharesToBuy < 0) {
      return {
        sharesToBuy: 0,
        totalInvestment: 0,
        newAverageCost: averageCost,
        newTotalShares: currentHoldings,
        isValid: false,
        message: t('errors.cannotAchieveTarget')
      };
    }

    const totalInvestment = sharesToBuy * marketPrice;

    if (totalInvestment > maxInvestment) {
      const maxShares = Math.floor(maxInvestment / marketPrice);
      const actualInvestment = maxShares * marketPrice;
      const newTotal = currentHoldings * averageCost + actualInvestment;
      const newShares = currentHoldings + maxShares;
      const newAverage = newTotal / newShares;

      return {
        sharesToBuy: maxShares,
        totalInvestment: actualInvestment,
        newAverageCost: newAverage,
        newTotalShares: newShares,
        isValid: true,
        message: `${t('messages.investmentLimited')} ${formatCurrency(newAverage, calculatorInputs.currency)}`
      };
    }

    const newTotalShares = currentHoldings + sharesToBuy;
    const newAverageCost = (currentHoldings * averageCost + totalInvestment) / newTotalShares;

    return {
      sharesToBuy: Math.round(sharesToBuy * 100) / 100,
      totalInvestment,
      newAverageCost,
      newTotalShares,
      isValid: true,
      message: t('messages.calculationSuccessful')
    };
  }, [t]);

  useEffect(() => {
    const newResult = calculateAdjustment(inputs);
    setResult(newResult);
  }, [inputs, calculateAdjustment]);

  const formatCurrency = (amount: number, currencyCode: string): string => {
    const currency = CURRENCIES.find(c => c.code === currencyCode);
    const symbol = currency?.symbol || '৳';
    
    let formattedAmount: string;
    if (currencyCode === 'JPY') {
      formattedAmount = formatNumber(Math.round(amount));
    } else {
      formattedAmount = formatNumber(parseFloat(amount.toFixed(2)));
    }
    
    return `${symbol}${formattedAmount}`;
  };

  const formatNumber = (num: number): string => {
    if (language === 'bn') {
      return num.toLocaleString('bn-BD');
    }
    return num.toLocaleString('en-US');
  };

  const updateInput = (key: keyof CalculatorInputs, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleTargetAverageInputChange = (value: string) => {
    setTargetAverageInput(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateInput('targetAverage', numValue);
    }
  };

  const handleTargetAverageSliderChange = (value: number[]) => {
    const newValue = value[0];
    updateInput('targetAverage', newValue);
    setTargetAverageInput(newValue.toString());
  };

  const shareResults = () => {
    const params = new URLSearchParams();
    Object.entries(inputs).forEach(([key, value]) => {
      params.set(key, value.toString());
    });
    params.set('lang', language);
    
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url);
    
    alert(t('shareableUrlCopied'));
  };

  const loadPreset = (preset: typeof PRESETS[0]) => {
    const newInputs = { ...inputs, ...preset.data, targetAverage: (preset.data.averageCost + preset.data.marketPrice) / 2 };
    setInputs(newInputs);
    setTargetAverageInput(newInputs.targetAverage.toString());
  };

  const getChartData = () => {
    if (!result) return [];

    return [
      {
        name: t('current'),
        shares: Math.round(inputs.currentHoldings),
        averageCost: inputs.averageCost,
        totalValue: inputs.currentHoldings * inputs.marketPrice,
        totalCost: inputs.currentHoldings * inputs.averageCost
      },
      {
        name: t('afterAdjustment'),
        shares: Math.round(result.newTotalShares),
        averageCost: result.newAverageCost,
        totalValue: result.newTotalShares * inputs.marketPrice,
        totalCost: result.newTotalShares * result.newAverageCost
      }
    ];
  };

  const currentSymbol = CURRENCIES.find(c => c.code === inputs.currency)?.symbol || '৳';

  // Custom tooltip formatter for chart
  const customTooltipFormatter = (value: any, name: string) => {
    if (name === 'shares') {
      return [formatNumber(value), t('totalShares')];
    }
    return [formatCurrency(value, inputs.currency), name === 'averageCost' ? t('averageCost') : name];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with Language Selector */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <div className="flex items-center">
              <Calculator className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                {t('title')}
              </h1>
            </div>
            <div className="flex-1 flex justify-end">
              <Select value={language} onValueChange={changeLanguage}>
                <SelectTrigger className="w-32">
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bn">বাংলা</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Presets */}
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
                  <span className="font-semibold text-sm">{preset.name}</span>
                  <span className="text-xs text-gray-500 mt-1">
                    {formatNumber(preset.data.currentHoldings)} {t('totalShares')} @ ৳{formatNumber(preset.data.averageCost)}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                {t('portfolioDetails')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Currency Selection */}
              <div>
                <Label htmlFor="currency" className="text-sm font-medium">{t('currency')}</Label>
                <Select value={inputs.currency} onValueChange={(value) => updateInput('currency', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map(currency => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} {language === 'bn' ? currency.nameBn : currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Current Holdings */}
              <div>
                <Label htmlFor="holdings" className="text-sm font-medium">{t('currentHoldings')}</Label>
                <Input
                  id="holdings"
                  type="number"
                  value={inputs.currentHoldings}
                  onChange={(e) => updateInput('currentHoldings', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                  min="0"
                  step="1"
                />
              </div>

              {/* Average Cost */}
              <div>
                <Label htmlFor="avgCost" className="text-sm font-medium">
                  {t('currentAverageCost')} ({currentSymbol})
                </Label>
                <Input
                  id="avgCost"
                  type="number"
                  value={inputs.averageCost}
                  onChange={(e) => updateInput('averageCost', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Market Price */}
              <div>
                <Label htmlFor="marketPrice" className="text-sm font-medium">
                  {t('currentMarketPrice')} ({currentSymbol})
                </Label>
                <Input
                  id="marketPrice"
                  type="number"
                  value={inputs.marketPrice}
                  onChange={(e) => updateInput('marketPrice', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Maximum Investment */}
              <div>
                <Label htmlFor="maxInvestment" className="text-sm font-medium">
                  {t('maximumInvestment')} ({currentSymbol})
                </Label>
                <Input
                  id="maxInvestment"
                  type="number"
                  value={inputs.maxInvestment}
                  onChange={(e) => updateInput('maxInvestment', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                  min="0"
                  step="100"
                />
              </div>

              {/* Target Average - Input and Slider */}
              <div>
                <Label className="text-sm font-medium">
                  {t('targetAverageCost')} ({currentSymbol})
                </Label>
                <Input
                  type="number"
                  value={targetAverageInput}
                  onChange={(e) => handleTargetAverageInputChange(e.target.value)}
                  className="mt-1 mb-3"
                  min={sliderRange[0]}
                  max={sliderRange[1]}
                  step="0.01"
                />
                <div className="px-2">
                  <Slider
                    value={[inputs.targetAverage]}
                    onValueChange={handleTargetAverageSliderChange}
                    max={sliderRange[1]}
                    min={sliderRange[0]}
                    step={0.01}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Min: {formatCurrency(sliderRange[0], inputs.currency)}</span>
                    <span>Max: {formatCurrency(sliderRange[1], inputs.currency)}</span>
                  </div>
                </div>
              </div>

              {/* Share Button */}
              <Button onClick={shareResults} variant="outline" className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                {t('shareResults')}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {/* Calculation Results */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  {t('calculationResults')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result && (
                  <div className="space-y-4">
                    {!result.isValid ? (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{result.message}</AlertDescription>
                      </Alert>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {formatNumber(Math.round(result.sharesToBuy))}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">{t('sharesToBuy')}</div>
                          </div>
                          <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                            <div className="text-2xl font-bold text-emerald-600">
                              {formatCurrency(result.totalInvestment, inputs.currency)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">{t('totalInvestment')}</div>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">{t('newTotalShares')}:</span>
                            <span className="font-semibold">{formatNumber(Math.round(result.newTotalShares))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">{t('newAverageCost')}:</span>
                            <span className="font-semibold">
                              {formatCurrency(result.newAverageCost, inputs.currency)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">{t('averageReduction')}:</span>
                            <Badge variant={inputs.averageCost > result.newAverageCost ? "default" : "secondary"}>
                              {formatCurrency(inputs.averageCost - result.newAverageCost, inputs.currency)}
                            </Badge>
                          </div>
                        </div>

                        {result.message !== t('messages.calculationSuccessful') && (
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{result.message}</AlertDescription>
                          </Alert>
                        )}
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chart */}
            {result && result.isValid && (
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    {t('portfolioComparison')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={customTooltipFormatter} />
                        <Bar dataKey="shares" fill="#3B82F6" name={t('totalShares')} />
                        <Bar dataKey="averageCost" fill="#10B981" name={t('averageCost')} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}