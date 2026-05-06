// composables/useCurrency.js
import { useCurrencyStore } from '@/stores/currency'

export function useCurrency() {
  const currencyStore = useCurrencyStore()

  const formatPrice = (priceObj, quantity = 1) => {
    const value = priceObj[currencyStore.currency] * quantity
    const rounded = Math.ceil(value)
    const locale = currencyStore.currency === 'USD' ? 'en-US' : 'es-MX'

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyStore.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(rounded)
  }

  return { formatPrice, currencyStore }
}