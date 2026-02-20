/**
 * Abbreviates large numbers with M, B, T suffixes
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Abbreviated string (e.g., "1.5M", "2.3B")
 */
export function formatLargeNumber(value: number, decimals: number = 2): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1_000_000_000_000) {
    // Trillions
    return `${sign}${(absValue / 1_000_000_000_000).toFixed(decimals)}T`;
  } else if (absValue >= 1_000_000_000) {
    // Billions
    return `${sign}${(absValue / 1_000_000_000).toFixed(decimals)}B`;
  } else if (absValue >= 1_000_000) {
    // Millions
    return `${sign}${(absValue / 1_000_000).toFixed(decimals)}M`;
  }
  
  // Below 1 million, return with proper decimal formatting
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCurrency(value: number): string {
  const absValue = Math.abs(value);
  
  // Use abbreviation for large numbers
  if (absValue >= 1_000_000) {
    const abbreviated = formatLargeNumber(value, 2);
    return `$${abbreviated}`;
  }
  
  // Standard formatting for smaller numbers with exactly 2 decimal places
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Alias for backward compatibility
export function formatUSD(value: number): string {
  return formatCurrency(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export function formatToken(value: number): string {
  const absValue = Math.abs(value);
  
  // Use abbreviation for large token amounts
  if (absValue >= 1_000_000) {
    return formatLargeNumber(value, 2);
  }
  
  // Standard formatting for smaller amounts
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(value);
}

// Alias for backward compatibility
export function formatTokens(value: number): string {
  return formatToken(value);
}

export function formatNumber(value: number, decimals: number = 2): string {
  const absValue = Math.abs(value);
  
  // Use abbreviation for large numbers
  if (absValue >= 1_000_000) {
    return formatLargeNumber(value, decimals);
  }
  
  // Standard formatting for smaller numbers
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
