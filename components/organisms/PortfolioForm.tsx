import { CalculatorInputs, calculateAdjustment, usePortfolioForm } from '@/hooks/use-portfolio-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { CURRENCIES } from '@/constants/currencies';
import { Input } from '@/components/ui/input';
import { Share2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useCurrency } from '@/hooks/use-currency';
import { useForm } from 'react-hook-form';
import { useLanguage } from '@/hooks/use-language';

interface PortfolioFormProps {
  onResultChange?: (result: any, values: any) => void;
  onShareResults?: (url: string) => void;
  initialValues?: CalculatorInputs;
}

const DEFAULT_VALUES: CalculatorInputs = {
  currentHoldings: 100,
  averageCost: 150,
  marketPrice: 120,
  maxInvestment: 5000,
  targetAverage: 135,
};

export function PortfolioForm({ onResultChange, onShareResults, initialValues }: PortfolioFormProps) {
  const { getSliderRange } = usePortfolioForm();
  const { t, language } = useLanguage();
  const { currency } = useCurrency();
  const form = useForm<CalculatorInputs>({
    defaultValues: initialValues || DEFAULT_VALUES,
    mode: 'onChange',
  });

  // Load from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentValues = form.getValues();
    let hasChanges = false;
    Object.keys(currentValues).forEach(key => {
      const value = params.get(key);
      if (value && key !== 'currency') {
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue !== Number(currentValues[key as keyof CalculatorInputs])) {
          form.setValue(key as keyof CalculatorInputs, numValue, { shouldValidate: true, shouldDirty: true });
          hasChanges = true;
        }
      } else if (value && key === 'currency') {
        if (value !== String(currentValues[key as keyof CalculatorInputs])) {
          form.setValue(key as keyof CalculatorInputs, value as any, { shouldValidate: true, shouldDirty: true });
          hasChanges = true;
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset form when initialValues changes
  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialValues)]);

  // Watch all form values
  const values = form.watch();
  const sliderRange = getSliderRange(values.marketPrice, values.averageCost);
  const result = calculateAdjustment(values, t);

  // Emit result to parent on change
  useEffect(() => {
    if (onResultChange) {
      onResultChange(result, values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values)]);

  // Share logic
  const handleShare = () => {
    const params = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => {
      params.set(key, value.toString());
    });
    params.set('lang', language as string);
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url);
    if (onShareResults) onShareResults(url);
    alert(t('shareableUrlCopied'));
  };

  const currentSymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '৳';


  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(() => {})}>
        {/* Current Holdings */}
        <FormField
          control={form.control}
          name="currentHoldings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('currentHoldings')}</FormLabel>
              <FormControl>
                <Input type="number" min={0} step={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Average Cost */}
        <FormField
          control={form.control}
          name="averageCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('currentAverageCost')} ({currentSymbol})</FormLabel>
              <FormControl>
                <Input type="number" min={0} step={0.01} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Market Price */}
        <FormField
          control={form.control}
          name="marketPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('currentMarketPrice')} ({currentSymbol})</FormLabel>
              <FormControl>
                <Input type="number" min={0} step={0.01} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Maximum Investment */}
        <FormField
          control={form.control}
          name="maxInvestment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('maximumInvestment')} ({currentSymbol})</FormLabel>
              <FormControl>
                <Input type="number" min={0} step={100} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Target Average - Input and Slider */}
        <FormItem>
          <FormLabel>{t('targetAverageCost')} ({currentSymbol})</FormLabel>
          <FormControl>
            <Input
              type="number"
              value={values.targetAverage}
              onChange={e => {
                const value = parseFloat(e.target.value) || 0;
                form.setValue('targetAverage', value, { shouldValidate: true, shouldDirty: true });
              }}
              min={sliderRange[0]}
              max={sliderRange[1]}
              step="0.01"
              className="mt-1 mb-3"
            />
          </FormControl>
          <div className="px-2">
            <Slider
              value={[values.targetAverage]}
              onValueChange={value => {
                form.setValue('targetAverage', value[0], { shouldValidate: true, shouldDirty: true });
              }}
              max={sliderRange[1]}
              min={sliderRange[0]}
              step={0.01}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Min: {currentSymbol}{sliderRange[0]}</span>
              <span>Max: {currentSymbol}{sliderRange[1]}</span>
            </div>
          </div>
        </FormItem>
        {/* Share Button */}
        <Button type="button" onClick={handleShare} variant="outline" className="w-full">
          <Share2 className="h-4 w-4 mr-2" />
          {t('shareResults')}
        </Button>
      </form>
    </Form>
  );
} 