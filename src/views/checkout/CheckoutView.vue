<template>
  <div class="checkout-root">
    <!-- Top bar -->
    <nav class="topbar">
      <a href="/" class="back-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
        Volver
      </a>
      <span class="topbar-title">Checkout</span>
      <span >
      </span>
    </nav>

    <div class="checkout-layout">
      <!-- LEFT: formulario -->
      <main class="checkout-left">

        <!-- Envío -->
        <section class="block">
          <header class="block-header">
            <span class="step">1</span>
            <div>
              <h2>Dirección de envío</h2>
              <p>Donde recibirás tu pedido</p>
            </div>
          </header>

          <div class="address-card" v-if="defaultAddress">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <div class="address-text">
              <strong>{{ defaultAddress.recipient_name }}</strong>
              <span>{{ defaultAddress.street }}</span>
              <span>{{ defaultAddress.city }}, {{ defaultAddress.state }} {{ defaultAddress.postal_code }}</span>
              <span>{{ defaultAddress.phone_number }}</span>
            </div>
            <span class="badge">Predeterminada</span>
          </div>

          <div class="address-empty" v-else>
            <p>No tienes una dirección configurada.</p>
          </div>
          
          <RouterLink
            :to="{name:'Profile'}"
          >
          <a  class="link-btn" target="_blank">
            Administrar direcciones
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
          </a>
          </RouterLink>
        </section>

        <!-- Cupón -->
        <section class="block">
          <header class="block-header">
            <span class="step">2</span>
            <div>
              <h2>Cupón de descuento</h2>
              <p>¿Tienes un código?</p>
            </div>
          </header>

          <div class="coupon-row">
            <input
              v-model="couponCode"
              type="text"
              placeholder="CODIGO-AQUI"
              class="coupon-input"
              :disabled="couponApplied"
              @keyup.enter="applyCoupon"
            />
            <button
              class="coupon-btn rounded-full"
              @click="couponApplied ? removeCoupon() : applyCoupon()"
              :disabled="couponLoading"
            >
              <span v-if="couponLoading">...</span>
              <span v-else-if="couponApplied">Quitar</span>
              <span v-else>Aplicar</span>
            </button>
          </div>
          <p v-if="couponError" class="coupon-error">{{ couponError }}</p>
          <p v-if="couponApplied" class="coupon-success">
            ✓ Cupón aplicado — {{ couponDiscount }}% de descuento
          </p>
        </section>

        <!-- Pago -->
        <section class="block">
          <header class="block-header">
            <span class="step">3</span>
            <div>
              <h2>Datos de tarjeta</h2>
              <p>Procesado por Stripe · SSL · 3D Secure</p>
            </div>
          </header>

          <div class="stripe-wrapper">
            <!-- Stripe Elements se monta aquí -->
            <div id="stripe-card-element" class="stripe-element-container"></div>
            <p v-if="stripeError" class="stripe-error">{{ stripeError }}</p>
          </div>

          <!-- Modo prueba: aviso -->
          <div class="test-notice">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
            <span>
              <strong>Modo prueba activo.</strong>
              Usa <code>4242 4242 4242 4242</code>, cualquier fecha futura y CVC/ZIP de 3-5 dígitos.
              <a href="https://stripe.com/docs/testing#cards" target="_blank" rel="noopener">Ver más tarjetas →</a>
            </span>
          </div>
        </section>

      </main>

      <!-- RIGHT: resumen -->
      <aside class="checkout-right">
        <div class="summary">
          <h2 class="summary-title">Tu pedido</h2>

          <ul class="item-list font-prices">
            <li v-for="item in cart.items" :key="item.piece.id" class="item-row">
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
                <s v-if="item.piece.has_discount">${{ (item.piece.original_price_base * item.quantity ).toFixed(2) }}</s>
                <span class="font-prices">${{ (item.piece.final_price_base * item.quantity ).toFixed(2) }}</span>
              </div>
            </li>
          </ul>

          <div class="divider"></div>

          <div class="totals ">
            <div class="total-row">
              <span>Subtotal</span>
              <span class="font-prices" >${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="total-row" v-if="productDiscount > 0">
              <span>Desc. productos</span>
              <span class="green font-prices">-${{ productDiscount.toFixed(2) }}</span>
            </div>
            <div class="total-row" v-if="couponApplied">
              <span>Cupón ({{ couponDiscount }}%)</span>
              <span class="green">-${{ couponSavings.toFixed(2) }}</span>
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
              <small>MXN</small>
              <strong>${{ grandTotal.toFixed(2) }}</strong>
            </div>
          </div>

          <button
            class="pay-btn rounded-full"
            :disabled="!canCheckout || processing"
            @click="handleCheckout"
          >
            <span v-if="processing" class="spinner"></span>
            <template v-else>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Pagar ${{ grandTotal.toFixed(2) }} MXN
            </template>
          </button>


        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
/**
 * ─────────────────────────────────────────────────────
 *  STRIPE — CONFIGURACIÓN Y PRUEBAS
 * ─────────────────────────────────────────────────────
 *
 *  1. Instalar el SDK de Stripe:
 *       npm install @stripe/stripe-js
 *
 *  2. Obtener tu publishable key en https://dashboard.stripe.com/apikeys
 *     (en modo prueba empieza con pk_test_...)
 *
 *  3. Reemplaza 'pk_test_TU_CLAVE_AQUI' por tu clave real abajo.
 *
 *  4. TARJETAS DE PRUEBA (modo test):
 *     ┌──────────────────────────┬───────────────────────────────────┐
 *     │ Número                   │ Comportamiento                    │
 *     ├──────────────────────────┼───────────────────────────────────┤
 *     │ 4242 4242 4242 4242      │ Pago exitoso                      │
 *     │ 4000 0000 0000 0002      │ Tarjeta rechazada                 │
 *     │ 4000 0025 0000 3155      │ Requiere autenticación 3D Secure  │
 *     │ 4000 0000 0000 9995      │ Fondos insuficientes              │
 *     └──────────────────────────┴───────────────────────────────────┘
 *     Fecha: cualquiera futura (ej. 12/34)
 *     CVC: cualquier 3 dígitos (ej. 123)
 *     ZIP: cualquier 5 dígitos (ej. 12345)
 *
 *  5. Flujo de pago:
 *     - Tu backend crea un PaymentIntent y devuelve el client_secret
 *     - Este componente confirma el pago con stripe.confirmCardPayment()
 *     - Stripe maneja 3DS automáticamente
 *
 *  6. Webhook en tu backend para events:
 *       payment_intent.succeeded  → confirmar pedido
 *       payment_intent.failed     → notificar al usuario
 * ─────────────────────────────────────────────────────
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import userService from '@/services/userService'
import { useCartStore } from '@/stores/cart'
import ordersService from '@/services/ordersService'
import { useRouter } from 'vue-router'

const cart = useCartStore()
const router = useRouter()

// ── Props ─────────────────────────────────────────────
const props = defineProps({
  // Endpoint de tu backend que crea el PaymentIntent y retorna { clientSecret }
  paymentIntentUrl: { type: String, default: '/api/payments/create-intent' },
  // Endpoint de tu backend que valida cupones y retorna { valid, discount }
})

const emit = defineEmits(['success', 'error'])
const stripePublicKey = import.meta.env.VITE_STRIPE_KEY
// ── Stripe state ──────────────────────────────────────
let stripe     = null
let elements   = null
let cardElement = null

const stripeError = ref('')
const processing  = ref(false)

// ── Dirección ─────────────────────────────────────────
const defaultAddress = ref(null)


// ── Cupón ─────────────────────────────────────────────
const couponCode     = ref('')
const couponApplied  = ref(false)
const couponDiscount = ref(0)   // porcentaje, ej: 15
const couponLoading  = ref(false)
const couponError    = ref('')

const applyCoupon = async () => {
  if (!couponCode.value.trim()) return
  couponLoading.value = true
  couponError.value   = ''
  try {
    // Llamada real a tu backend:
    // const { valid, discount } = await res.json()
    const res = await ordersService.consultCoupon({ code: couponCode.value })

    couponDiscount.value = res.percentage
    couponApplied.value  = true
  } catch (err) {
    couponError.value = err.message || 'Error al validar el cupón.'
  } finally {
    couponLoading.value = false
  }
}

const removeCoupon = () => {
  couponCode.value     = ''
  couponApplied.value  = false
  couponDiscount.value = 0
  couponError.value    = ''
}

// ── Totales ───────────────────────────────────────────
const subtotal = computed(() => cart.totalPrice)

const productDiscount = computed(() =>
  cart.items.reduce((s, item) =>
    item.piece.has_discount
      ? s + (item.piece.original_price_base - item.piece.final_price_base) * item.quantity
      : s
  , 0)
)

const couponSavings = computed(() =>
  couponApplied.value ? +(subtotal.value * (couponDiscount.value / 100)).toFixed(2) : 0
)

const grandTotal = computed(() =>
  +(subtotal.value - couponSavings.value).toFixed(2)
)

const canCheckout = computed(() =>
  cart.items.length > 0 && !!defaultAddress.value
)

// ── Total de piezas ───────────────────────────────────
const totalItems = computed(() => 
  cart.items.reduce((total, item) => total + item.quantity, 0)
)

// ── Stripe init ───────────────────────────────────────
onMounted(async () => {

  const response = await userService.getAddresses({is_default: true})
  defaultAddress.value = response.results?.[0] ?? null
  
  stripe = await loadStripe(stripePublicKey)
  elements = stripe.elements()

  cardElement = elements.create('card', {
    style: {
      base: {
        fontFamily: '"DM Sans", system-ui, sans-serif',
        fontSize: '15px',
        color: '#1a1a1a',
        '::placeholder': { color: '#b0a99a' },
      },
      invalid: { color: '#e53e3e' },
    },
    hidePostalCode: false,
  })
  cardElement.mount('#stripe-card-element')
  cardElement.on('change', (e) => {
    stripeError.value = e.error ? e.error.message : ''
  })
})

onUnmounted(() => {
  cardElement?.destroy()
})

// ── Checkout ──────────────────────────────────────────
const handleCheckout = async () => {
  if (!canCheckout.value || processing.value) return

  // 1. Validar que la tarjeta sea correcta antes de cualquier petición al backend
  const { error: validationError, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
  })

  if (validationError) {
    stripeError.value = validationError.message
    return // Detenemos el proceso aquí si la tarjeta no es válida
  }

  // Si llegamos aquí, la tarjeta es válida, empezamos el loading
  processing.value = true
  stripeError.value = ''

  try {
    // 2. Crear la orden en tu backend
    const data = {
      address: defaultAddress.value.id,
      payment_method: "card",
      items: cart.items.map(item => ({
        piece: item.piece.id,
        quantity: item.quantity
      }))
    }

    const res = await ordersService.checkout(data)
    const clientSecret = res.client_secret 

    // 3. Confirmar el pago con Stripe
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: defaultAddress.value.recipient_name, // Asegúrate de usar el campo correcto
          phone: defaultAddress.value.phone_number,
        },
      },
    })

    if (error) throw new Error(error.message)

    // 4. Éxito: Llamamos al polling
    emit('success', { paymentIntent, orderId: res.order_id, total: grandTotal.value })

    // Await aquí es crucial para que el loading persista hasta que checkOrderStatus termine
    await checkOrderStatus(res.order_id)

  } catch (err) {
    stripeError.value = err.message || 'Error al procesar el pago.'
    processing.value = false // Solo desactivamos el loading si hubo un error
    emit('error', err)
  }
}

const checkOrderStatus = async (orderId, attempts = 0) => {
  const MAX_ATTEMPTS = 5;
  const DELAY = 2000;    

  try {
    const order_completed = await ordersService.getOrder(orderId);

    if (order_completed.status === "paid") {
      router.push({ name: 'CheckoutSuccess', params: { orderId } });
      cart.items = []
    } 
    else if (order_completed.status === "pending") {
      // Si sigue pendiente y no hemos agotado intentos, esperamos y reintentamos
      if (attempts < MAX_ATTEMPTS) {
        setTimeout(() => checkOrderStatus(orderId, attempts + 1), DELAY);
      } else {
        // Si después de los intentos sigue pendiente, lo mandamos a la vista de pendiente
        router.push({ name: 'CheckoutPending', params: { orderId } });
        cart.items = []
      }
    } 
  } catch (error) {
    console.error("Error en el polling:", error);
    // En caso de error de red, podrías decidir si reintentar o fallar
    router.push({ name: 'CheckoutPending', params: { orderId } });
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.checkout-root {
  min-height: 100vh;
  background: #f7f5f2;
  color: #1a1a1a;
}

/* ── Topbar ── */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 48px;
  background: #fff;
  border-bottom: 1px solid #ece8e1;
}
.back-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #666;
  text-decoration: none;
  transition: color .2s;
}
.back-link:hover { color: var(--color-primary); }
.topbar-title {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 1.25rem;
  font-weight: 400;
  letter-spacing: .01em;
}
.secure-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 500;
  color: #16a34a;
  background: #f0fdf4;
  padding: 6px 14px;
  border-radius: 999px;
}

/* ── Layout ── */
.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 32px;
}

/* ── LEFT ── */
.checkout-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.block {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  border: 1px solid #ece8e1;
}

.block-header {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  margin-bottom: 20px;
}
.step {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}
.block-header h2 {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 1.15rem;
  font-weight: 400;
  line-height: 1.2;
}
.block-header p {
  font-size: 0.8rem;
  color: #888;
  margin-top: 3px;
}

/* Address */
.address-card {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 16px;
  background: #faf8f5;
  border: 1px solid #ece8e1;
  border-radius: 12px;
  margin-bottom: 14px;
  position: relative;
}
.address-card svg { color: var(--color-primary); flex-shrink: 0; margin-top: 2px; }
.address-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.875rem;
  color: #555;
  line-height: 1.5;
}
.address-text strong { color: #1a1a1a; font-size: 0.95rem; }
.badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: .07em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 999px;
}
.address-empty {
  padding: 24px;
  border: 2px dashed #ddd;
  border-radius: 12px;
  text-align: center;
  font-size: 0.875rem;
  color: #888;
  margin-bottom: 14px;
}
.link-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.83rem;
  color: #555;
  text-decoration: none;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 14px;
  transition: all .2s;
}
.link-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }

/* Cupón */
.coupon-row {
  display: flex;
  gap: 10px;
}
.coupon-input {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 11px 14px;
  font-size: 0.9rem;
  font-family: 'DM Sans', sans-serif;
  background: #faf8f5;
  transition: border-color .2s;
  letter-spacing: .05em;
  text-transform: uppercase;
}
.coupon-input:focus {
  outline: none;
  border-color: #1a1a1a;
}
.coupon-input:disabled { opacity: .6; cursor: not-allowed; }
.coupon-btn {
  padding: 11px 20px;
  border: 1px solid var(--color-primary);
  background: var(--color-primary);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all .2s;
  white-space: nowrap;
}
.coupon-btn:hover:not(:disabled) {   background:#b3451a }
.coupon-btn:disabled { opacity: .5; cursor: not-allowed; }
.coupon-error  { margin-top: 8px; font-size: 0.8rem; color: #e53e3e; }
.coupon-success { margin-top: 8px; font-size: 0.8rem; color: #16a34a; font-weight: 500; }

/* Stripe */
.stripe-wrapper {
  background: #faf8f5;
  border: 1px solid #ece8e1;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 14px;
}
.stripe-element-container { min-height: 24px; }
.stripe-error { margin-top: 10px; font-size: 0.8rem; color: #e53e3e; }

.test-notice {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 0.8rem;
  color: #78350f;
  line-height: 1.6;
}
.test-notice svg { color: #d97706; flex-shrink: 0; margin-top: 2px; }
.test-notice code {
  background: rgba(0,0,0,.07);
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 0.78rem;
  letter-spacing: .03em;
}
.test-notice a { color: var(--color-primary); text-underline-offset: 2px; }

/* ── RIGHT ── */
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
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f5f5f5;
}
.item-img-wrap img { width: 100%; height: 100%; object-fit: cover; }

/* Badge de cantidad en la imagen */
.quantity-badge {
  position: absolute;
  bottom: -5px;
  right: -5px;
  background: var(--color-primary);
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

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

/* Información de cantidad */
.item-quantity-info {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  font-size: 0.75rem;
}
.quantity-label {
  color: #888;
  font-weight: 400;
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

/* Desglose de precio por unidad */
.price-breakdown {
  margin-top: 2px;
  text-align: right;
}
.breakdown-text {
  font-size: 0.7rem;
  color: #888;
  font-weight: 400;
}

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
.muted { font-size: .9rem; color: #aaa; color: #16a34a;}

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

.pay-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
  font-size: 0.75rem;
  color: #999;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .checkout-layout {
    grid-template-columns: 1fr;
    padding: 24px 20px;
  }
  .checkout-right { position: static; }
  .topbar { padding: 16px 20px; }
}
@media (max-width: 480px) {
  .topbar-title { display: none; }
  .block { padding: 20px; }
  .summary { padding: 20px; }
  .coupon-row { flex-direction: column; }
}
</style>