import { createSlice } from "@reduxjs/toolkit";

export const CURRENCIES = {
  USD: { code: "USD", symbol: "$", rate: 1, label: "USD ($)" },
  LKR: { code: "LKR", symbol: "Rs. ", rate: 300, label: "LKR (Rs.)" },
  EUR: { code: "EUR", symbol: "€", rate: 0.92, label: "EUR (€)" },
  AUD: { code: "AUD", symbol: "A$", rate: 1.54, label: "AUD (A$)" },
  JPY: { code: "JPY", symbol: "¥", rate: 155, label: "JPY (¥)" },
};

const savedCurrency =
  typeof window !== "undefined"
    ? window.localStorage.getItem("staylux_currency")
    : null;

const initialState = {
  code: savedCurrency && CURRENCIES[savedCurrency] ? savedCurrency : "USD",
};

export const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      const next = action.payload;
      if (CURRENCIES[next]) {
        state.code = next;
        if (typeof window !== "undefined") {
          window.localStorage.setItem("staylux_currency", next);
        }
      }
    },
  },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;
