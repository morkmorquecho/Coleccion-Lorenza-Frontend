import { defineStore } from 'pinia'

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    currency: 'MXN',
    usdRate: null  // se llena cuando el backend responde
  }),
  actions: {
    setCurrency(value) {
      this.currency = value
    },
    setRate(rate) {
      this.usdRate = rate
    },
    convert(amountMXN) {
      if (this.currency === 'USD' && this.usdRate) {
        return amountMXN / this.usdRate
      }
      return amountMXN
    }
  },
  persist: true
})