export interface PnLInputs {
  investmentAmount: number;
  buyPrice: number;
  sellPrice: number;
  tradingFees: number;
}

export interface PnLOutputs {
  tokenQuantity: number;
  netProfit: number;
  roi: number;
}

export function calculatePnL(inputs: PnLInputs): PnLOutputs {
  const { investmentAmount, buyPrice, sellPrice, tradingFees } = inputs;

  if (investmentAmount <= 0 || buyPrice <= 0 || sellPrice <= 0) {
    return { tokenQuantity: 0, netProfit: 0, roi: 0 };
  }

  // Calculate token quantity after buy fees
  const buyFeeAmount = investmentAmount * (tradingFees / 100);
  const amountAfterBuyFee = investmentAmount - buyFeeAmount;
  const tokenQuantity = amountAfterBuyFee / buyPrice;

  // Calculate sell value
  const grossSellValue = tokenQuantity * sellPrice;
  const sellFeeAmount = grossSellValue * (tradingFees / 100);
  const netSellValue = grossSellValue - sellFeeAmount;

  // Calculate profit and ROI
  const netProfit = netSellValue - investmentAmount;
  const roi = (netProfit / investmentAmount) * 100;

  return {
    tokenQuantity,
    netProfit,
    roi,
  };
}
