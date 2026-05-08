<template>
  <div class="checkout-root">
    <CheckoutTopBar />

    <div class="checkout-layout">
      <main class="checkout-left">
        <CheckoutAddressSection :address="defaultAddress" />
        
        <CheckoutCouponSection
          v-model="couponCode"
          :coupon-applied="couponApplied"
          :discount="couponDiscount"
          :loading="couponLoading"
          :error="couponError"
          @apply="applyCoupon"
          @remove="removeCoupon"
        />
        
        <CheckoutPaymentSection
          ref="paymentSectionRef"
          :stripe-public-key="stripePublicKey"
          :error="stripeError"
          @card-error="stripeError = $event"
          @card-ready="handleCardReady"
        />
      </main>

      <CheckoutOrderSummary
        :cart-items="cart.items"
        :subtotal="subtotal"
        :product-discount="productDiscount"
        :coupon-applied="couponApplied"
        :coupon-discount="couponDiscount"
        :coupon-savings="couponSavings"
        :grand-total="grandTotal"
        :total-items="totalItems"
        :can-checkout="canCheckout"
        :processing="processing"
        @checkout="handleCheckout"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import userService from '@/services/userService'
import ordersService from '@/services/ordersService'

import CheckoutTopBar from './components/CheckoutTopBar.vue'
import CheckoutAddressSection from './components/CheckoutAddressSection.vue'
import CheckoutCouponSection from './components/CheckoutCouponSection.vue'
import CheckoutPaymentSection from './components/CheckoutPaymentSection.vue'
import CheckoutOrderSummary from './components/CheckoutOrderSummary.vue'

const cart = useCartStore()
const router = useRouter()

// Stripe
const stripePublicKey = import.meta.env.VITE_STRIPE_KEY
let stripeInstance = null
let cardElement = null
const stripeError = ref('')
const processing = ref(false)

// Dirección
const defaultAddress = ref(null)

// Cupón
const couponCode = ref('')
const couponApplied = ref(false)
const couponDiscount = ref(0)
const couponLoading = ref(false)
const couponError = ref('')

// Referencias
const paymentSectionRef = ref(null)

// Computed properties para totales
const subtotal = computed(() => cart.totalPrice)
const productDiscount = computed(() =>
  cart.items.reduce((s, item) =>
    item.piece.has_discount
      ? s + (item.piece.original_price_base.MXN - item.piece.final_price_base.MXN) * item.quantity
      : s, 0
  )
)
const couponSavings = computed(() =>
  couponApplied.value ? +(subtotal.value * (couponDiscount.value / 100)).toFixed(2) : 0
)
const grandTotal = computed(() => +(subtotal.value - couponSavings.value).toFixed(2))
const totalItems = computed(() => cart.items.reduce((total, item) => total + item.quantity, 0))
const canCheckout = computed(() => cart.items.length > 0 && !!defaultAddress.value)

// Métodos
const applyCoupon = async () => {
  if (!couponCode.value.trim()) return
  couponLoading.value = true
  couponError.value = ''
  try {
    const res = await ordersService.consultCoupon({ code: couponCode.value })
    couponDiscount.value = res.percentage
    couponApplied.value = true
  } catch (err) {
    couponError.value = err.message || 'Error al validar el cupón.'
  } finally {
    couponLoading.value = false
  }
}

const removeCoupon = () => {
  couponCode.value = ''
  couponApplied.value = false
  couponDiscount.value = 0
  couponError.value = ''
}

const handleCardReady = ({ stripe, cardElement: card }) => {
  stripeInstance = stripe
  cardElement = card
}

const handleCheckout = async () => {
  if (!canCheckout.value || processing.value) return

  // Validar tarjeta
  const { error: validationError, paymentMethod } = await stripeInstance.createPaymentMethod({
    type: 'card',
    card: cardElement,
  })

  if (validationError) {
    stripeError.value = validationError.message
    return
  }

  processing.value = true
  stripeError.value = ''

  try {
    const data = {
      address: defaultAddress.value.id,
      payment_method: "card",
      items: cart.items.map(item => ({
        piece: item.piece.id,
        quantity: item.quantity
      })),
      coupon_code:couponCode.value
    }

    const res = await ordersService.checkout(data)
    const clientSecret = res.client_secret
    cart.clearCart()
    
    const { error, paymentIntent } = await stripeInstance.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: defaultAddress.value.recipient_name,
          phone: defaultAddress.value.phone_number,
        },
      },
    })

    if (error) throw new Error(error.message)

    await checkOrderStatus(res.order_id)

  } catch (err) {
    stripeError.value = err.message || 'Error al procesar el pago.'
    processing.value = false
  }
}

const checkOrderStatus = async (orderId, attempts = 0) => {
  const MAX_ATTEMPTS = 5
  const DELAY = 2000

  try {
    const order_completed = await ordersService.getOrder(orderId)

    if (order_completed.status === "paid") {
      router.push({ name: 'CheckoutSuccess', params: { orderId } })
    } else if (order_completed.status === "pending") {
      if (attempts < MAX_ATTEMPTS) {
        setTimeout(() => checkOrderStatus(orderId, attempts + 1), DELAY)
      } else {
        router.push({ name: 'CheckoutPending', params: { orderId } })
      }
    }
  } catch (error) {
    console.error("Error en el polling:", error)
    router.push({ name: 'CheckoutPending', params: { orderId } })
  }
}

onMounted(async () => {
  const response = await userService.getAddresses({ is_default: true })
  defaultAddress.value = response.results?.[0] ?? null
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.checkout-root {
  min-height: 100vh;
  background: #f7f5f2;
  color: #1a1a1a;
}

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 32px;
}

.checkout-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 900px) {
  .checkout-layout {
    grid-template-columns: 1fr;
    padding: 24px 20px;
  }
}
</style>