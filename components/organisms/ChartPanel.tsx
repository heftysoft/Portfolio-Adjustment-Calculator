import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import PortfolioChart from '@/components/portfolio-chart';
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface ChartPanelProps {
  chartData: any[];
}

export function ChartPanel({ chartData }: ChartPanelProps) {
  const { t, language } = useLanguage();
  if (!chartData || chartData.length === 0) return null;
  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          {t('portfolioComparison')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PortfolioChart key={language} data={chartData} />
      </CardContent>
    </Card>
  );
} 