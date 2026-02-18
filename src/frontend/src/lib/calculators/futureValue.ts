export interface FutureValueInputs {
  initialAmount: number;
  monthlyContribution: number;
  years: number;
  annualRate: number;
}

export interface FutureValueOutputs {
  futureValue: number;
  totalContributed: number;
}

export function calculateFutureValue(inputs: FutureValueInputs): FutureValueOutputs {
  const { initialAmount, monthlyContribution, years, annualRate } = inputs;

  if (years <= 0) {
    return {
      futureValue: initialAmount,
      totalContributed: initialAmount,
    };
  }

  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;

  // Future value of initial amount
  let futureValue = initialAmount * Math.pow(1 + monthlyRate, months);

  // Future value of monthly contributions (annuity)
  if (monthlyContribution > 0 && monthlyRate > 0) {
    const annuityFV = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    futureValue += annuityFV;
  } else if (monthlyContribution > 0) {
    futureValue += monthlyContribution * months;
  }

  const totalContributed = initialAmount + (monthlyContribution * months);

  return {
    futureValue,
    totalContributed,
  };
}
