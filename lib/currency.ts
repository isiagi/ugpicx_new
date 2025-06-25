// Exchange rates (in a real app, fetch from API)
const EXCHANGE_RATES = {
  USD_TO_UGX: 3750, // 1 USD = 3750 UGX (approximate)
}

export function convertPrice(amount: number, fromCurrency: "USD" | "UGX", toCurrency: "USD" | "UGX"): number {
  if (fromCurrency === toCurrency) return amount

  if (fromCurrency === "USD" && toCurrency === "UGX") {
    return Math.round(amount * EXCHANGE_RATES.USD_TO_UGX)
  }

  if (fromCurrency === "UGX" && toCurrency === "USD") {
    return Math.round((amount / EXCHANGE_RATES.USD_TO_UGX) * 100) / 100
  }

  return amount
}

export function formatPrice(amount: number, currency: "USD" | "UGX"): string {
  if (currency === "UGX") {
    return `UGX ${amount.toLocaleString()}`
  }
  return `$${amount.toFixed(2)}`
}

export function getCurrencySymbol(currency: "USD" | "UGX"): string {
  return currency === "UGX" ? "UGX" : "$"
}
