// src/stores/cart.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUIStore } from './ui'

export const useCartStore = defineStore('cart', () => {
  const isCartOpen = ref(false)
  const lottie = '/animations/quetzal.json'

  const openCart = () => {
    isCartOpen.value = true
  }

  const closeCart = () => {
    isCartOpen.value = false
  }

  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value
  }

  // ── STATE ──────────────────────────────
  // El carrito no tiene endpoint GET en tu API
  // Vive en localStorage hasta que el usuario hace checkout
  const items = ref(JSON.parse(localStorage.getItem('cart') || '[]'))
  // Estructura de cada item:
  // { piece: { id, slug, title, thumbnail_path, final_price_base }, quantity: 2 }

  // ── GETTERS ────────────────────────────
  const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.piece.final_price_base.MXN * item.quantity, 0),
  )

  const isEmpty = computed(() => items.value.length === 0)

  // ── HELPERS ────────────────────────────
  function saveToStorage() {
    // Se llama después de cada cambio para persistir el carrito
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  // ── ACTIONS ────────────────────────────
  function addItem(piece, quantity = 1) {
    const existing = items.value.find((i) => i.piece.id === piece.id)
    const currentQty = existing ? existing.quantity : 0
    const stock = piece.quantity ?? Infinity

    if (currentQty + quantity > stock) {
      const uiStore = useUIStore()
      uiStore.showModal(
        `Solo hay ${stock} pieza${stock === 1 ? '' : 's'} disponible${stock === 1 ? '' : 's'} de "${piece.title}".`,
        'Stock insuficiente',
        lottie,
      )
      return false // ← útil cuando conviertas esto en modal
    }

    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({ piece, quantity })
    }
    saveToStorage()
    return true
  }

  function updateQuantity(pieceId, quantity) {
    const item = items.value.find((i) => i.piece.id === pieceId)
    if (!item) return

    if (quantity <= 0) {
      removeItem(pieceId)
      return
    }

    const stock = item.piece.quantity ?? Infinity
    if (quantity > stock) {
      const uiStore = useUIStore()
      uiStore.showModal(
        `Solo hay ${stock} pieza${stock === 1 ? '' : 's'} disponible${stock === 1 ? '' : 's'} de "${item.piece.title}".`,
        'Stock insuficiente',
        lottie,
      )
      return
    }

    item.quantity = quantity
    saveToStorage()
  }

  function removeItem(pieceId) {
    items.value = items.value.filter((i) => i.piece.id !== pieceId)
    saveToStorage()
  }

  function clearCart() {
    // Se llama después de un checkout exitoso
    items.value = []
    localStorage.removeItem('cart')
  }

  // Convierte el carrito al formato que espera tu API en /orders/checkout/
  // { piece: id, quantity: n }
  function toCheckoutPayload() {
    return items.value.map((i) => ({
      piece: i.piece.id,
      quantity: i.quantity,
    }))
  }

  return {
    items,
    totalItems,
    totalPrice,
    isEmpty,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toCheckoutPayload,
  }
})
