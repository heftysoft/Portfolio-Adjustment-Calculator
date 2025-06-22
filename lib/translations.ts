export const translations = {
  en: {
    title: 'Portfolio Adjustment Calculator',
    subtitle: 'Calculate how many shares to buy to reach your target average cost and optimize your investment strategy',
    quickPresets: 'Quick Presets',
    portfolioDetails: 'Portfolio Details',
    currency: 'Currency',
    currentHoldings: 'Current Holdings (shares)',
    currentAverageCost: 'Current Average Cost',
    currentMarketPrice: 'Current Market Price',
    maximumInvestment: 'Maximum Investment',
    targetAverageCost: 'Target Average Cost',
    shareResults: 'Share Results',
    calculationResults: 'Calculation Results',
    sharesToBuy: 'Shares to Buy',
    totalInvestment: 'Total Investment',
    newTotalShares: 'New Total Shares',
    newAverageCost: 'New Average Cost',
    averageReduction: 'Average Reduction',
    portfolioComparison: 'Portfolio Comparison',
    current: 'Current',
    afterAdjustment: 'After Adjustment',
    totalShares: 'Total Shares',
    averageCost: 'Average Cost',
    totalValue: 'Total Value',
    totalCost: 'Total Cost',
    shareableUrlCopied: 'Shareable URL copied to clipboard!',
    presets: {
      techStock: 'Tech Stock Scenario',
      valueInvestment: 'Value Investment',
      growthStock: 'Growth Stock',
      dividendStock: 'Dividend Stock'
    },
    errors: {
      allPositive: 'All values must be positive numbers',
      targetRange: 'Target average must be between market price and current average cost',
      noAdjustmentNeeded: 'Market price equals target average - no adjustment needed',
      cannotCalculate: 'Cannot calculate adjustment - denominator too small',
      cannotAchieveTarget: 'Cannot achieve target average by buying shares at current market price'
    },
    messages: {
      investmentLimited: 'Investment limited by maximum budget. Achievable average:',
      calculationSuccessful: 'Adjustment calculation successful'
    },
    currencies: {
      BDT: 'Bangladeshi Taka',
      USD: 'US Dollar',
      EUR: 'Euro',
      GBP: 'British Pound',
      JPY: 'Japanese Yen',
      CAD: 'Canadian Dollar',
      AUD: 'Australian Dollar',
      INR: 'Indian Rupee',
    }
  },
  bn: {
    title: 'পোর্টফোলিও সমন্বয় ক্যালকুলেটর',
    subtitle: 'আপনার লক্ষ্য গড় খরচে পৌঁছানোর জন্য কতটি শেয়ার কিনতে হবে তা গণনা করুন এবং আপনার বিনিয়োগ কৌশল অপ্টিমাইজ করুন',
    quickPresets: 'দ্রুত প্রিসেট',
    portfolioDetails: 'পোর্টফোলিও বিবরণ',
    currency: 'মুদ্রা',
    currentHoldings: 'বর্তমান হোল্ডিং (শেয়ার)',
    currentAverageCost: 'বর্তমান গড় খরচ',
    currentMarketPrice: 'বর্তমান বাজার মূল্য',
    maximumInvestment: 'সর্বোচ্চ বিনিয়োগ',
    targetAverageCost: 'লক্ষ্য গড় খরচ',
    shareResults: 'ফলাফল শেয়ার করুন',
    calculationResults: 'গণনার ফলাফল',
    sharesToBuy: 'কিনতে হবে শেয়ার',
    totalInvestment: 'মোট বিনিয়োগ',
    newTotalShares: 'নতুন মোট শেয়ার',
    newAverageCost: 'নতুন গড় খরচ',
    averageReduction: 'গড় হ্রাস',
    portfolioComparison: 'পোর্টফোলিও তুলনা',
    current: 'বর্তমান',
    afterAdjustment: 'সমন্বয়ের পর',
    totalShares: 'মোট শেয়ার',
    averageCost: 'গড় খরচ',
    totalValue: 'মোট মূল্য',
    totalCost: 'মোট খরচ',
    shareableUrlCopied: 'শেয়ারযোগ্য URL ক্লিপবোর্ডে কপি হয়েছে!',
    presets: {
      techStock: 'টেক স্টক পরিস্থিতি',
      valueInvestment: 'ভ্যালু ইনভেস্টমেন্ট',
      growthStock: 'গ্রোথ স্টক',
      dividendStock: 'ডিভিডেন্ড স্টক'
    },
    errors: {
      allPositive: 'সব মান অবশ্যই ধনাত্মক সংখ্যা হতে হবে',
      targetRange: 'লক্ষ্য গড় অবশ্যই বাজার মূল্য এবং বর্তমান গড় খরচের মধ্যে হতে হবে',
      noAdjustmentNeeded: 'বাজার মূল্য লক্ষ্য গড়ের সমান - কোন সমন্বয়ের প্রয়োজন নেই',
      cannotCalculate: 'সমন্বয় গণনা করা যাচ্ছে না - হর খুব ছোট',
      cannotAchieveTarget: 'বর্তমান বাজার মূল্যে শেয়ার কিনে লক্ষ্য গড় অর্জন করা যাবে না'
    },
    messages: {
      investmentLimited: 'সর্বোচ্চ বাজেট দ্বারা বিনিয়োগ সীমিত। অর্জনযোগ্য গড়:',
      calculationSuccessful: 'সমন্বয় গণনা সফল হয়েছে'
    },
    currencies: {
      BDT: 'বাংলাদেশী টাকা',
      USD: 'মার্কিন ডলার',
      EUR: 'ইউরো',
      GBP: 'ব্রিটিশ পাউন্ড',
      JPY: 'জাপানি ইয়েন',
      CAD: 'কানাডিয়ান ডলার',
      AUD: 'অস্ট্রেলিয়ান ডলার',
      INR: 'ভারতীয় রুপি' ,
    }
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;