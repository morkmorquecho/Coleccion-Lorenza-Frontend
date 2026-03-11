// src/stores/cart.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {

  // ── STATE ──────────────────────────────
  // El carrito no tiene endpoint GET en tu API
  // Vive en localStorage hasta que el usuario hace checkout
  const items = ref(JSON.parse(localStorage.getItem('cart') || '[]'))
  // Estructura de cada item:
  // { piece: { id, slug, title, thumbnail_path, final_price_base }, quantity: 2 }

  // ── GETTERS ────────────────────────────
  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) =>
      sum + (item.piece.final_price_base * item.quantity), 0
    )
  )

  const isEmpty = computed(() => items.value.length === 0)

  // ── HELPERS ────────────────────────────
  function saveToStorage() {
    // Se llama después de cada cambio para persistir el carrito
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  // ── ACTIONS ────────────────────────────
  function addItem(piece, quantity = 1) {
    const existing = items.value.find(i => i.piece.id === piece.id)

    if (existing) {
      // Si ya está en el carrito, solo suma la cantidad
      existing.quantity += quantity
    } else {
      items.value.push({ piece, quantity })
    }
    saveToStorage()
  }

  function removeItem(pieceId) {
    items.value = items.value.filter(i => i.piece.id !== pieceId)
    saveToStorage()
  }

  function updateQuantity(pieceId, quantity) {
    const item = items.value.find(i => i.piece.id === pieceId)
    if (!item) return

    if (quantity <= 0) {
      removeItem(pieceId)  // si baja a 0, elimina el item
    } else {
      item.quantity = quantity
    }
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
    return items.value.map(i => ({
      piece: i.piece.id,
      quantity: i.quantity
    }))
  }

  return {
    items,
    totalItems,
    totalPrice,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toCheckoutPayload,
  }
})