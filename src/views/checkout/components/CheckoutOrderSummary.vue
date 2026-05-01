<template>
  <aside class="checkout-right">
    <div class="summary">
      <h2 class="summary-title">Tu pedido</h2>

      <ul class="item-list font-prices">
        <li v-for="item in cartItems" :key="item.piece.id" class="item-row">
          <div class="item-img-wrap">
            <img :src="item.piece.thumbnail_path" :alt="item.piece.title" />
          </div>
          <div class="item-meta">
            <span class="item-name">{{ item.piece.title }}</span>
            <span class="item-tag">{{ item.piece.type }}</span>
            <div class="item-quantity-info">
              <span class="quantity-value">{{ item.quantity }}</span>
              <span class="quantity-unit">{{ item.quantity === 1 ? 'pieza' : 'piezas' }}</span>
            </div>
          </div>
          <div class="item-prices">
            <s v-if="item.piece.has_discount">{{ formatPrice((item.piece.original_price_base * item.quantity).toFixed(2)) }}</s>
            <span class="font-prices">{{ formatPrice((item.piece.final_price_base * item.quantity).toFixed(2) )}}</span>
          </div>
        </li>
      </ul>

      <div class="divider"></div>

      <div class="totals">
        <div class="total-row">
          <span>Subtotal</span>
          <span class="font-prices">{{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="total-row" v-if="productDiscount > 0">
          <span>Desc. productos</span>
          <span class="green font-prices">-{{ productDiscount.toFixed(2) }}</span>
        </div>
        <div class="total-row" v-if="couponApplied">
          <span>Cupón ({{ couponDiscount }}%)</span>
          <span class="green">-{{ couponSavings.toFixed(2) }}</span>
        </div>
        <div class="total-row">
          <span>Envío</span>
          <span class="muted">Gratis</span>
        </div>
        <div class="total-row total-items">
          <span>Total de piezas</span>
          <span class="font-prices">{{ totalItems }} {{ totalItems === 1 ? 'pieza' : 'piezas' }}</span>
        </div>
      </div>

      <div class="divider"></div>

      <div class="grand-row">
        <span>Total</span>
        <div class="grand-amount">
          <small>{{ currencyStore.currency }}</small>
          <strong>{{ grandTotal.toFixed(2) }}</strong>
        </div>
      </div>

      <button
        class="pay-btn rounded-full"
        :disabled="!canCheckout || processing"
        @click="emit('checkout')"
      >
        <span v-if="processing" class="spinner"></span>
        <template v-else>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect width="18" height="11" x="3" y="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Pagar {{ grandTotal.toFixed(2) }} {{ currencyStore.currency }}
        </template>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useCurrencyStore } from '@/stores/currency'
import { useCurrency } from '@/composables/useCurrency'

const { formatPrice } = useCurrency()
const currencyStore = useCurrencyStore()

const props = defineProps({
  cartItems: {
    type: Array,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  productDiscount: {
    type: Number,
    default: 0
  },
  couponApplied: {
    type: Boolean,
    default: false
  },
  couponDiscount: {
    type: Number,
    default: 0
  },
  couponSavings: {
    type: Number,
    default: 0
  },
  grandTotal: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  canCheckout: {
    type: Boolean,
    default: false
  },
  processing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['checkout'])
</script>

<style scoped>
.checkout-right { position: sticky; top: 24px; height: fit-content; }
.summary {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  border: 1px solid #ece8e1;
}
.summary-title {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 1.3rem;
  font-weight: 400;
  margin-bottom: 20px;
}
.item-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 260px;
  overflow-y: auto;
  padding-right: 4px;
}
.item-list::-webkit-scrollbar { width: 3px; }
.item-list::-webkit-scrollbar-track { background: transparent; }
.item-list::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
.item-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.item-img-wrap {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f5f5f5;
}
.item-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
.item-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}
.item-name {
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-tag {
  font-size: 0.72rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: .06em;
}
.item-quantity-info {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  font-size: 0.75rem;
}
.quantity-value {
  font-weight: 600;
  color: var(--color-primary);
  background: #fff5f0;
  padding: 2px 8px;
  border-radius: 20px;
  min-width: 32px;
  text-align: center;
}
.quantity-unit {
  color: #888;
  font-size: 0.7rem;
}
.item-prices {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}
.item-prices s { font-size: 0.75rem; color: #aaa; }
.item-prices span { font-size: 0.875rem; font-weight: 600; }
.divider { height: 1px; background: #ece8e1; margin: 18px 0; }
.totals { display: flex; flex-direction: column; gap: 10px; }
.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #666;
}
.total-items {
  margin-top: 5px;
  padding-top: 5px;
  border-top: 1px dashed #ece8e1;
  font-weight: 500;
  color: #1a1a1a;
}
.green { color: #16a34a; font-weight: 500; }
.muted { font-size: .9rem; color: #16a34a;}
.grand-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.grand-row > span {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 1.05rem;
}
.grand-amount {
  display: flex;
  align-items: baseline;
  gap: 5px;
}
.grand-amount small { font-size: 0.72rem; color: #888; }
.grand-amount strong { font-size: 1.75rem; font-weight: 400; font-family: 'DM Serif Display', serif; }
.pay-btn {
  width: 100%;
  margin-top: 20px;
  padding: 16px;
  border: none;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all .25s;
  box-shadow: 0 4px 16px rgba(196, 80, 26, .3);
}
.pay-btn:hover:not(:disabled) {
  background: #b3451a;
  box-shadow: 0 6px 24px rgba(196, 80, 26, .4);
  transform: translateY(-1px);
}
.pay-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; box-shadow: none; }
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>