export interface RiskInputs {
  entryPrice: number;
  stopLoss: number;
  totalCapital: number;
  riskPercent: number;
  targetPrice?: number;
}

export interface RiskOutputs {
  positionSize: number;
  riskPerUnit: number;
  stopDistancePercent: number;
  riskRewardRatio: number | null;
  potentialProfit: number | null;
}

export function calculateRisk(inputs: RiskInputs): RiskOutputs {
  const { entryPrice, stopLoss, totalCapital, riskPercent, targetPrice } = inputs;

  if (entryPrice <= 0 || stopLoss <= 0 || totalCapital <= 0 || riskPercent <= 0) {
    return {
      positionSize: 0,
      riskPerUnit: 0,
      stopDistancePercent: 0,
      riskRewardRatio: null,
      potentialProfit: null,
    };
  }

  // Validate stop-loss for long position
  if (stopLoss >= entryPrice) {
    return {
      positionSize: 0,
      riskPerUnit: 0,
      stopDistancePercent: 0,
      riskRewardRatio: null,
      potentialProfit: null,
    };
  }

  const riskPerUnit = entryPrice - stopLoss;
  const stopDistancePercent = (riskPerUnit / entryPrice) * 100;
  const maxRiskAmount = totalCapital * (riskPercent / 100);
  const positionSize = maxRiskAmount / riskPerUnit;
  const positionSizeUSD = positionSize * entryPrice;

  let riskRewardRatio: number | null = null;
  let potentialProfit: number | null = null;

  if (targetPrice && targetPrice > entryPrice) {
    const rewardPerUnit = targetPrice - entryPrice;
    riskRewardRatio = rewardPerUnit / riskPerUnit;
    potentialProfit = positionSize * rewardPerUnit;
  }

  return {
    positionSize: positionSizeUSD,
    riskPerUnit,
    stopDistancePercent,
    riskRewardRatio,
    potentialProfit,
  };
}
