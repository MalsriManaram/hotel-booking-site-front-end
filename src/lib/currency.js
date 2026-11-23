import { useSelector, useDispatch } from "react-redux";
import { CURRENCIES, setCurrency } from "./features/currencySlice";

export function formatCurrencyAmount(usdAmount, currencyCode = "USD") {
  const numeric = Number(usdAmount) || 0;
  const cfg = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const converted = numeric * cfg.rate;

  if (cfg.code === "LKR" || cfg.code === "JPY") {
    return `${cfg.symbol}${Math.round(converted).toLocaleString()}`;
  }
  const hasDecimals = Math.abs(converted % 1) > 0.01;
  return `${cfg.symbol}${converted.toLocaleString(undefined, {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

export function useCurrency() {
  const dispatch = useDispatch();
  const code = useSelector((state) => state.currency?.code || "USD");
  const info = CURRENCIES[code] || CURRENCIES.USD;

  return {
    code,
    symbol: info.symbol,
    rate: info.rate,
    currencies: Object.values(CURRENCIES),
    changeCurrency: (nextCode) => dispatch(setCurrency(nextCode)),
    formatPrice: (usdAmount) => formatCurrencyAmount(usdAmount, code),
  };
}
