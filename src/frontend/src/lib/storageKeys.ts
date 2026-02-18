export const STORAGE_KEYS = {
  PNL: 'cryptowise_pnl_v1',
  RISK: 'cryptowise_risk_v1',
  DCA: 'cryptowise_dca_v1',
  MOONMATH: 'cryptowise_moonmath_v1',
  FUTURE_VALUE: 'cryptowise_future_value_v1',
} as const;

export function clearAllStorageKeys() {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}
