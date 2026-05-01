<template>
  <section class="block">
    <header class="block-header">
      <span class="step">3</span>
      <div>
        <h2>Datos de tarjeta</h2>
        <p>Procesado por Stripe · SSL · 3D Secure</p>
      </div>
    </header>

    <div class="stripe-wrapper">
      <div id="stripe-card-element" class="stripe-element-container"></div>
      <p v-if="error" class="stripe-error">{{ error }}</p>
    </div>

    <div class="test-notice">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4m0 4h.01"/>
      </svg>
      <span>
        <strong>Modo prueba activo.</strong>
        Usa <code>4242 4242 4242 4242</code>, cualquier fecha futura y CVC/ZIP de 3-5 dígitos.
        <a href="https://stripe.com/docs/testing#cards" target="_blank" rel="noopener">Ver más tarjetas →</a>
      </span>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { loadStripe } from '@stripe/stripe-js'

const props = defineProps({
  stripePublicKey: {
    type: String,
    required: true
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['card-ready', 'card-error'])

let stripe = null
let elements = null
let cardElement = null

onMounted(async () => {
  stripe = await loadStripe(props.stripePublicKey)
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
    if (e.error) {
      emit('card-error', e.error.message)
    } else {
      emit('card-error', '')
    }
  })

  emit('card-ready', { stripe, cardElement })
})

onUnmounted(() => {
  cardElement?.destroy()
})

defineExpose({
  getStripeInstance: () => ({ stripe, cardElement })
})
</script>

<style scoped>
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
</style>