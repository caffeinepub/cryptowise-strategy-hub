export interface SEOMetadata {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export const SEO_CONFIG: Record<string, SEOMetadata> = {
  pnl: {
    title: 'P&L Calculator - CryptoWise Strategy Hub',
    description: 'Calculate crypto profit and loss with trading fees. Smart entry and exit planning for informed trading decisions.',
    ogTitle: 'Crypto P&L Calculator with Trading Fees',
    ogDescription: 'Calculate your crypto profit/loss including trading fees. Make data-driven trading decisions.',
    ogImage: '/assets/generated/cryptowise-logo.dim_512x512.png',
  },
  risk: {
    title: 'Risk Management Calculator - CryptoWise',
    description: 'Calculate optimal position sizing and risk-reward ratios. Professional risk management for crypto trading.',
    ogTitle: 'Crypto Risk Management & Position Sizing',
    ogDescription: 'Calculate position size based on risk tolerance. Manage your crypto portfolio like a pro.',
    ogImage: '/assets/generated/cryptowise-logo.dim_512x512.png',
  },
  dca: {
    title: 'DCA Planner - CryptoWise Strategy Hub',
    description: 'Plan your dollar-cost averaging strategy. Calculate average entry price across multiple crypto purchases.',
    ogTitle: 'Advanced DCA Calculator for Crypto',
    ogDescription: 'Calculate your average entry price with multiple buy-ins. Perfect your DCA strategy.',
    ogImage: '/assets/generated/cryptowise-logo.dim_512x512.png',
  },
  moonMath: {
    title: 'Moon Math Calculator - CryptoWise',
    description: 'Compare crypto market caps to estimate price targets. Reality check your moon math predictions.',
    ogTitle: 'Crypto Market Cap Comparison Tool',
    ogDescription: 'Calculate implied price if your coin reaches another coin\'s market cap. Data-driven moon math.',
    ogImage: '/assets/generated/cryptowise-logo.dim_512x512.png',
  },
  futureValue: {
    title: 'Future Value Calculator - CryptoWise',
    description: 'Project long-term crypto portfolio growth with compound interest. Plan your financial future.',
    ogTitle: 'Crypto Future Value & Compound Interest Calculator',
    ogDescription: 'Calculate future portfolio value with compound interest and monthly contributions.',
    ogImage: '/assets/generated/cryptowise-logo.dim_512x512.png',
  },
  decision: {
    title: 'Crypto Decision Engine - Trading Decision Calculator',
    description: 'Make informed trading decisions based on configurable criteria and thresholds. Evaluate ROI, risk, price targets, and market conditions.',
    ogTitle: 'Crypto Trading Decision Engine',
    ogDescription: 'Automated decision-making tool for crypto trading. Set your criteria and get clear buy/sell/hold recommendations.',
    ogImage: '/assets/generated/cryptowise-logo.dim_512x512.png',
  },
};
