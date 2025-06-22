"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import React from 'react';
import { useLanguage } from '@/hooks/use-language';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { usePortfolioCalculator } from '@/hooks/use-portfolio-calculator';
import { ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface ChartData {
  name: string;
  shares: number;
  averageCost: number;
}

interface PortfolioChartProps {
  data: ChartData[];
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function PortfolioChart({ data }: PortfolioChartProps) {
  const { t } = useLanguage();
  const { formatNumber, formatCurrency} = usePortfolioCalculator();

  const valueFormatter = (value: ValueType, dataKey?: any) => {
    if (typeof value === 'number') {
      if (dataKey === t('averageCost')) {
        return formatCurrency(value);
      }
      return formatNumber(value);
    }
    return value as string;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => t(value)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent 
                  indicator="dashed"
                  labelFormatter={(value) => t(value)}
                  valueFormatter={valueFormatter}
                />}
              />
              <Bar dataKey="shares" fill="var(--color-chart-3)" radius={4} name={t('totalShares')} />
              <Bar dataKey="averageCost" fill="var(--color-chart-2)" radius={4} name={t('averageCost')} />
            </BarChart>
          </ChartContainer>
        </ResponsiveContainer>
    </div>
  );
} 