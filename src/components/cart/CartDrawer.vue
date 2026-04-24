<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

const formattedTotal = computed(() => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(cart.totalPrice)
})


const closeCart = () => {
  cart.closeCart()
}


const formatPrice = (price) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(price)
}

const handleCheckout = () => {
  // Aquí iría la lógica de checkout
  console.log('Checkout payload:', cart.toCheckoutPayload())
}
</script>

<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div
      v-if="cart.isCartOpen"
      class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      @click="closeCart" 
    />
  </Transition>

  <!-- Cart Drawer -->
  <Transition name="slide">
    <div
      v-if="cart.isCartOpen"
      class="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
        <div class="flex items-center gap-3">
          <h2 class="header-title">Tu Carrito</h2>
          <span class="text-xs text-neutral-400 font-medium">
            ({{ cart.totalItems }} {{ cart.totalItems === 1 ? 'pieza' : 'piezas' }})
          </span>
        </div>
        <button
          @click="closeCart"
          class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-all duration-300"
          aria-label="Cerrar carrito"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Free Shipping Banner -->
      <div class="px-6 py-3 bg-[#dd4b24]/5 border-b border-[#dd4b24]/10">
        <div class="flex items-center gap-2 text-[#dd4b24]">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
          <span class="text-xs font-medium uppercase tracking-wider">Envío gratuito en todos los pedidos</span>
        </div>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto">
        <!-- Empty State -->
        <div v-if="cart.isEmpty" class="flex flex-col items-center justify-center h-full px-6 text-center">
          <div class="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <h3 class="text-empty-car">Tu carrito está vacío</h3>
          <p class="text-sm text-neutral-500 mb-6">Explora nuestra colección y encuentra piezas únicas</p>
          <button
            @click="closeCart"
            class="px-6 py-3 bg-[#dd4b24] text-white text-sm font-medium uppercase tracking-wider rounded-full hover:bg-[#c43d1a] transition-colors duration-300"
          >
            Explorar Colección
          </button>
        </div>

        <!-- Items List -->
        <ul v-else class="divide-y divide-neutral-100">
          <li
            v-for="item in cart.items"
            :key="item.piece.id"
            class="cart-item px-6 py-5 flex gap-4"
          >
            <!-- Thumbnail -->
            <div class="w-20 h-24 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
              <img
                :src="item.piece.thumbnail_path"
                :alt="item.piece.title"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Details -->
            <div class="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <h3 class="text-sm font-medium text-neutral-900 truncate">{{ item.piece.title }}</h3>
                <p class="text-sm text-neutral-500 mt-0.5">{{ formatPrice(item.piece.final_price_base) }}</p>
              </div>

              <!-- Quantity Controls -->
              <div class="flex items-center justify-between mt-3">
                <div class="flex items-center border border-neutral-200 rounded-full">
                  <button
                    @click="cart.updateQuantity(item.piece.id, item.quantity - 1)"
                    class="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors"
                    aria-label="Reducir cantidad"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
                    </svg>
                  </button>
                  <span class="w-8 text-center text-sm font-medium text-neutral-900">{{ item.quantity }}</span>
                  <button
                    @click="cart.updateQuantity(item.piece.id, item.quantity + 1)"
                    class="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>

                <!-- Remove Button -->
                <button
                  @click="cart.removeItem(item.piece.id)"
                  class="text-neutral-400 hover:text-red-500 transition-colors p-1"
                  aria-label="Eliminar del carrito"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Footer -->
      <div v-if="!cart.isEmpty" class="border-t border-neutral-100 px-6 py-1 bg-neutral-50/50">
        <!-- Summary -->
        <div class="space-y-3 mb-5">
          <div class="flex items-center justify-between text-sm">
            <span class="text-neutral-500">Subtotal</span>
            <span class="text-neutral-900">{{ formattedTotal }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-neutral-500">Envío</span>
            <span class="text-[#dd4b24] font-medium">Gratis</span>
          </div>
          <div class="h-px bg-neutral-200"></div>
          <div class="flex items-center justify-between">
            <span class="text-neutral-900 font-medium">Total</span>
            <span class="text-lg font-medium text-neutral-900">{{ formattedTotal }}</span>
          </div>
        </div>

        <!-- Checkout Button -->
        <button
          @click="handleCheckout"
          class="checkout-btn w-full py-4 bg-[#dd4b24] text-white text-sm font-medium uppercase tracking-wider rounded-full hover:bg-[#c43d1a] transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span>Proceder al pago</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>

        <!-- Continue Shopping -->
        <button
          @click="closeCart"
          class="w-full mt-3 py-3 text-sm text-neutral-500 hover:text-neutral-700 transition-colors text-center"
        >
          Continuar comprando
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>

.header-title {
  font-family: 'Cormorant Garamond', serif;
  font-size:x-large;
  font-weight: bold;
  color: var(--color-primary);
}

.text-empty-car{
  font-family: 'Cormorant Garamond', serif;
  font-weight:bolder

}

/* Overlay transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Drawer slide transition */
.slide-enter-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Cart item hover */
.cart-item {
  transition: background-color 0.2s ease;
}

.cart-item:hover {
  background-color: rgba(0, 0, 0, 0.01);
}

/* Checkout button */
.checkout-btn:active {
  transform: scale(0.98);
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}
</style>