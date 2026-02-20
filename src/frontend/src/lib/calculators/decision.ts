export interface DecisionInputs {
  minROI?: number;
  maxRisk?: number;
  priceTarget?: number;
  currentPrice?: number;
  minMarketCap?: number;
  currentMarketCap?: number;
  priceChange24h?: number;
  minPriceChange?: number;
  maxPriceChange?: number;
}

export interface CriterionResult {
  name: string;
  passed: boolean;
  reason: string;
}

export type DecisionType = 'Buy' | 'Sell' | 'Hold' | 'Wait';

export interface DecisionOutputs {
  recommendation: DecisionType;
  score: number;
  criteria: CriterionResult[];
}

export function calculateDecision(inputs: DecisionInputs): DecisionOutputs {
  const criteria: CriterionResult[] = [];
  let passedCount = 0;
  let totalCriteria = 0;

  // ROI Criterion
  if (inputs.minROI !== undefined && inputs.currentPrice !== undefined && inputs.priceTarget !== undefined) {
    totalCriteria++;
    const potentialROI = ((inputs.priceTarget - inputs.currentPrice) / inputs.currentPrice) * 100;
    const passed = potentialROI >= inputs.minROI;
    if (passed) passedCount++;
    
    criteria.push({
      name: 'ROI Threshold',
      passed,
      reason: passed 
        ? `Potential ROI of ${potentialROI.toFixed(2)}% meets minimum ${inputs.minROI}%`
        : `Potential ROI of ${potentialROI.toFixed(2)}% below minimum ${inputs.minROI}%`,
    });
  }

  // Risk Criterion
  if (inputs.maxRisk !== undefined && inputs.currentPrice !== undefined && inputs.priceTarget !== undefined) {
    totalCriteria++;
    const potentialLoss = ((inputs.currentPrice - inputs.priceTarget) / inputs.currentPrice) * 100;
    const passed = Math.abs(potentialLoss) <= inputs.maxRisk;
    if (passed) passedCount++;
    
    criteria.push({
      name: 'Risk Tolerance',
      passed,
      reason: passed
        ? `Risk of ${Math.abs(potentialLoss).toFixed(2)}% within tolerance of ${inputs.maxRisk}%`
        : `Risk of ${Math.abs(potentialLoss).toFixed(2)}% exceeds tolerance of ${inputs.maxRisk}%`,
    });
  }

  // Price Target Criterion
  if (inputs.priceTarget !== undefined && inputs.currentPrice !== undefined) {
    totalCriteria++;
    const passed = inputs.currentPrice < inputs.priceTarget;
    if (passed) passedCount++;
    
    criteria.push({
      name: 'Price Target',
      passed,
      reason: passed
        ? `Current price $${inputs.currentPrice.toFixed(4)} below target $${inputs.priceTarget.toFixed(4)}`
        : `Current price $${inputs.currentPrice.toFixed(4)} at or above target $${inputs.priceTarget.toFixed(4)}`,
    });
  }

  // Market Cap Criterion
  if (inputs.minMarketCap !== undefined && inputs.currentMarketCap !== undefined) {
    totalCriteria++;
    const passed = inputs.currentMarketCap >= inputs.minMarketCap;
    if (passed) passedCount++;
    
    criteria.push({
      name: 'Market Cap',
      passed,
      reason: passed
        ? `Market cap $${(inputs.currentMarketCap / 1e9).toFixed(2)}B meets minimum $${(inputs.minMarketCap / 1e9).toFixed(2)}B`
        : `Market cap $${(inputs.currentMarketCap / 1e9).toFixed(2)}B below minimum $${(inputs.minMarketCap / 1e9).toFixed(2)}B`,
    });
  }

  // 24h Price Change Criterion
  if (inputs.priceChange24h !== undefined) {
    if (inputs.minPriceChange !== undefined) {
      totalCriteria++;
      const passed = inputs.priceChange24h >= inputs.minPriceChange;
      if (passed) passedCount++;
      
      criteria.push({
        name: 'Minimum Price Movement',
        passed,
        reason: passed
          ? `24h change of ${inputs.priceChange24h.toFixed(2)}% meets minimum ${inputs.minPriceChange}%`
          : `24h change of ${inputs.priceChange24h.toFixed(2)}% below minimum ${inputs.minPriceChange}%`,
      });
    }

    if (inputs.maxPriceChange !== undefined) {
      totalCriteria++;
      const passed = inputs.priceChange24h <= inputs.maxPriceChange;
      if (passed) passedCount++;
      
      criteria.push({
        name: 'Maximum Price Movement',
        passed,
        reason: passed
          ? `24h change of ${inputs.priceChange24h.toFixed(2)}% within maximum ${inputs.maxPriceChange}%`
          : `24h change of ${inputs.priceChange24h.toFixed(2)}% exceeds maximum ${inputs.maxPriceChange}%`,
      });
    }
  }

  // Calculate score and recommendation
  const score = totalCriteria > 0 ? (passedCount / totalCriteria) * 100 : 0;
  
  let recommendation: DecisionType;
  if (totalCriteria === 0) {
    recommendation = 'Wait';
  } else if (score >= 80) {
    recommendation = 'Buy';
  } else if (score >= 50) {
    recommendation = 'Hold';
  } else if (score >= 20) {
    recommendation = 'Wait';
  } else {
    recommendation = 'Sell';
  }

  return {
    recommendation,
    score,
    criteria,
  };
}
