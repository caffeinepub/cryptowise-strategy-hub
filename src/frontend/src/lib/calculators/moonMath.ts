export interface MoonMathInputs {
  coinAPrice: number;
  coinASupply: number;
  coinBMarketCap: number;
}

export interface MoonMathOutputs {
  impliedPrice: number;
  impliedMultiple: number;
}

export function calculateMoonMath(inputs: MoonMathInputs): MoonMathOutputs {
  const { coinAPrice, coinASupply, coinBMarketCap } = inputs;

  if (coinAPrice <= 0 || coinASupply <= 0 || coinBMarketCap <= 0) {
    return {
      impliedPrice: 0,
      impliedMultiple: 0,
    };
  }

  const impliedPrice = coinBMarketCap / coinASupply;
  const impliedMultiple = impliedPrice / coinAPrice;

  return {
    impliedPrice,
    impliedMultiple,
  };
}
