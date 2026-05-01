<template>
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
        v-model="localCouponCode"
        type="text"
        placeholder="CODIGO-AQUI"
        class="coupon-input"
        :disabled="couponApplied"
        @keyup.enter="handleApplyCoupon"
      />
      <button
        class="coupon-btn rounded-full"
        @click="couponApplied ? handleRemoveCoupon() : handleApplyCoupon()"
        :disabled="loading"
      >
        <span v-if="loading">...</span>
        <span v-else-if="couponApplied">Quitar</span>
        <span v-else>Aplicar</span>
      </button>
    </div>
    <p v-if="error" class="coupon-error">{{ error }}</p>
    <p v-if="couponApplied" class="coupon-success">
      ✓ Cupón aplicado — {{ discount }}% de descuento
    </p>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  couponApplied: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'apply', 'remove'])

const localCouponCode = ref(props.modelValue)

watch(localCouponCode, (newVal) => {
  emit('update:modelValue', newVal)
})

watch(() => props.modelValue, (newVal) => {
  localCouponCode.value = newVal
})

const handleApplyCoupon = () => {
  if (localCouponCode.value.trim()) {
    emit('apply')
  }
}

const handleRemoveCoupon = () => {
  emit('remove')
}
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
.coupon-btn:hover:not(:disabled) { background:#b3451a }
.coupon-btn:disabled { opacity: .5; cursor: not-allowed; }
.coupon-error  { margin-top: 8px; font-size: 0.8rem; color: #e53e3e; }
.coupon-success { margin-top: 8px; font-size: 0.8rem; color: #16a34a; font-weight: 500; }
</style>