export interface DCAEntry {
  id: string;
  buyPrice: number;
  amount: number;
}

export interface DCAOutputs {
  totalInvested: number;
  totalTokens: number;
  averageEntryPrice: number;
}

export function calculateDCA(entries: DCAEntry[]): DCAOutputs {
  const validEntries = entries.filter(e => e.buyPrice > 0 && e.amount > 0);

  if (validEntries.length === 0) {
    return {
      totalInvested: 0,
      totalTokens: 0,
      averageEntryPrice: 0,
    };
  }

  const totalInvested = validEntries.reduce((sum, e) => sum + e.amount, 0);
  const totalTokens = validEntries.reduce((sum, e) => sum + (e.amount / e.buyPrice), 0);
  const averageEntryPrice = totalInvested / totalTokens;

  return {
    totalInvested,
    totalTokens,
    averageEntryPrice,
  };
}
