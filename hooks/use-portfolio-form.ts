import { usePortfolioCalculator } from "./use-portfolio-calculator";

export interface CalculatorInputs {
  currentHoldings: number;
  averageCost: number;
  marketPrice: number;
  maxInvestment: number;
  targetAverage: number;
}

export interface CalculationResult {
  sharesToBuy: number;
  totalInvestment: number;
  newAverageCost: number;
  newTotalShares: number;
  isValid: boolean;
  message: {
    key: string;
    values?: { [key: string]: string | number };
  };
}

export function calculateAdjustment(
  calculatorInputs: CalculatorInputs,
  t: (key: any) => string
): CalculationResult {
  const { currentHoldings, averageCost, marketPrice, maxInvestment, targetAverage } = calculatorInputs;
  const { formatCurrency } = usePortfolioCalculator();
  if (currentHoldings <= 0 || averageCost <= 0 || marketPrice <= 0 || maxInvestment <= 0) {
    return {
      sharesToBuy: 0,
      totalInvestment: 0,
      newAverageCost: averageCost,
      newTotalShares: currentHoldings,
      isValid: false,
      message: { key: 'errors.allPositive' }
    };
  }
  if (targetAverage < Math.min(marketPrice, averageCost) || targetAverage > Math.max(marketPrice, averageCost)) {
    return {
      sharesToBuy: 0,
      totalInvestment: 0,
      newAverageCost: averageCost,
      newTotalShares: currentHoldings,
      isValid: false,
      message: { key: 'errors.targetRange' }
    };
  }
  if (Math.abs(marketPrice - targetAverage) < 0.01) {
    return {
      sharesToBuy: 0,
      totalInvestment: 0,
      newAverageCost: averageCost,
      newTotalShares: currentHoldings,
      isValid: false,
      message: { key: 'errors.noAdjustmentNeeded' }
    };
  }
  const numerator = currentHoldings * (targetAverage - averageCost);
  const denominator = marketPrice - targetAverage;
  if (Math.abs(denominator) < 0.01) {
    return {
      sharesToBuy: 0,
      totalInvestment: 0,
      newAverageCost: averageCost,
      newTotalShares: currentHoldings,
      isValid: false,
      message: { key: 'errors.cannotCalculate' }
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
      message: { key: 'errors.cannotAchieveTarget' }
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
      message: { 
        key: 'messages.investmentLimited',
        values: { newAverage: newAverage }
      }
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
    message: { key: 'messages.calculationSuccessful' }
  };
}

export function usePortfolioForm() {
  // Helper to calculate slider range
  const getSliderRange = (marketPrice: number, averageCost: number) => {
    const min = Math.min(marketPrice, averageCost);
    const max = Math.max(marketPrice, averageCost);
    return [min, max];
  };
  return {
    getSliderRange,
  };
} 