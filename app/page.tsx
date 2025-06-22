"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { ChartPanel } from '@/components/organisms/ChartPanel';
import { DollarSign } from 'lucide-react';
import { HeaderBar } from '@/components/organisms/HeaderBar';
import { PortfolioForm } from '@/components/organisms/PortfolioForm';
import { PortfolioPresetsPanel } from '@/components/organisms/PortfolioPresetsPanel';
import React from 'react';
import { ResultsPanel } from '@/components/organisms/ResultsPanel';
import { Suspense } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { usePortfolioCalculator } from '@/hooks/use-portfolio-calculator';

export default function PortfolioCalculator() {
  const {
    result,
    inputs,
    chartData,
    formKey,
    presetValues,
    formatCurrency,
    formatNumber,
    handleResultChange,
    loadPreset,
  } = usePortfolioCalculator();
  const { t } = useLanguage();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <HeaderBar title={t('title')} subtitle={t('subtitle')} />

          {/* Presets */}
          <PortfolioPresetsPanel
            loadPreset={loadPreset}
            formatNumber={formatNumber}
          />

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
                <PortfolioForm
                  key={formKey}
                  onResultChange={handleResultChange}
                  initialValues={presetValues}
                />
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              <ResultsPanel
                result={result}
                inputs={inputs}
                formatNumber={formatNumber}
                formatCurrency={formatCurrency}
              />

              {/* Chart */}
              {result && result.isValid && (
                <ChartPanel
                  chartData={chartData}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
