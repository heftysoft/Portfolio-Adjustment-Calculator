import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/use-language';

interface ResultsPanelProps {
  result: any;
  inputs: any;
  formatNumber: (num: number) => string;
  formatCurrency: (amount: number, currencyCode?: string) => string;
}

export function ResultsPanel({ result, inputs, formatNumber, formatCurrency }: ResultsPanelProps) {
  const { t } = useLanguage();

  if (!result || !result.isValid) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            {t('calculationResults')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            {result?.message ? t(result.message.key) : 'Enter values to see results'}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const getMessage = () => {
    if (!result || !result.message) return null;
    
    const messageTranslation = t(result.message.key);

    if (result.message.key === 'messages.investmentLimited' && result.message.values?.newAverage) {
      const newAverage = result.message.values.newAverage as number;
      return `${messageTranslation} ${formatCurrency(newAverage, inputs?.currency)}`;
    }
    
    return messageTranslation;
  };
  
  const finalMessage = getMessage();

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          {t('calculationResults')}
        </CardTitle>
      </CardHeader>
      <CardContent>
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

              {finalMessage && finalMessage !== t('messages.calculationSuccessful') && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{finalMessage}</AlertDescription>
                </Alert>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 