# Specification

## Summary
**Goal:** Build the CryptoWise Strategy Hub MVP as a mobile-first, single-page set of crypto calculators with CoinGecko live pricing, dark glass UI, local persistence, and shareable trade card export.

**Planned changes:**
- Create a responsive single-page layout with navigation to: Smart Entry & Exit (P&L), Risk Management, DCA Planner, Moon Math (Market Cap), and Future Value Projection.
- Implement P&L calculator with live-updating outputs (token quantity, net profit after fees, ROI %) and graceful validation.
- Add CoinGecko coin search/select to fetch current USD price and auto-fill at least the P&L Buy Price, including clear “live data” indication and error handling with manual override.
- Implement Risk Management & Position Sizing calculator (entry, stop-loss, total capital, risk %) with explainable breakdown and optional target price R:R ratio (text + simple visual indicator), including validation for nonsensical cases.
- Implement Advanced DCA Planner with 5+ add/remove entry lines (buy price + USD amount) and live-updating totals (invested, tokens, average entry), with handling for empty/invalid rows.
- Implement Moon Math module using CoinGecko data to compare Coin A vs Coin B market cap and compute implied Coin A price and implied multiple vs current price, with fallbacks for missing data.
- Implement Future Value Projection calculator (initial amount, optional monthly buy, years, APR %) with projected ending value and total contributions; handle edge cases.
- Add no-login local storage persistence for all module inputs and latest results, plus a one-click “clear saved data” reset.
- Add one-click Share/Export to generate a downloadable PNG “Trade Plan” image for the active module (at minimum P&L) containing key inputs/outputs in readable English.
- Apply a consistent dark-mode-by-default glassmorphism theme using Tailwind + Shadcn components.
- Add and use generated static assets (logo + background) from `frontend/public/assets/generated`.

**User-visible outcome:** Users can switch between five calculators in a dark glass UI, optionally pull live coin prices from CoinGecko, have inputs/results remembered locally without login, clear saved data, and export a readable PNG trade summary (at least for the P&L module).
