<template>
  <button 
    :class="[
      'base-btn rounded-full',
      `base-btn--${variant}`,
      `base-btn--${size}`,
      { 'base-btn--hover': isHovered },
      { 'base-btn--disabled': disabled }
    ]"
    :disabled="disabled"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @touchstart="isHovered = true"
    @touchend="isHovered = false"
    @click="handleClick"
  >
    {{ text }}
  </button>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: 'Button'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'ghost', 'danger-ghost', 'danger-outline'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'xsmall', 'medium'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const isHovered = ref(false)

const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-family: Georgia, 'Times New Roman', Times, serif;
}

/* === VARIANTES === */

/* Primary - botón principal naranja */
.base-btn--primary {
  background: var(--color-primary);
  color: white;
}

.base-btn--primary:hover,
.base-btn--primary.base-btn--hover {
  background: color-mix(in srgb, var(--color-primary) 85%, black);
  transform: translateY(-1px);
}

/* Ghost - borde con color primario, fondo transparente */
.base-btn--ghost {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid color-mix(in srgb, var(--color-primary) 40%, transparent);
}

.base-btn--ghost:hover,
.base-btn--ghost.base-btn--hover {
  background: var(--color-primary);
  color: white;
}

/* Danger Ghost - para acciones peligrosas (eliminar) */
.base-btn--danger-ghost {
  background: transparent;
  color: #9b1c1c;
  border: 1px solid rgba(155, 28, 28, 0.25);
}

.base-btn--danger-ghost:hover,
.base-btn--danger-ghost.base-btn--hover {
  background: #9b1c1c;
  color: white;
}

/* Danger Outline - para cerrar sesión */
.base-btn--danger-outline {
  background: transparent;
  color: #9b1c1c;
  border: 1px solid rgba(155, 28, 28, 0.3);
}

.base-btn--danger-outline:hover,
.base-btn--danger-outline.base-btn--hover {
  background: #9b1c1c;
  color: white;
}

/* === TAMAÑOS === */

/* Small */
.base-btn--small {
  padding: 0.45rem 0.9rem;
  font-size: 0.82rem;
}

/* XSmall (para acciones dentro de tarjetas) */
.base-btn--xsmall {
  padding: 0.35rem 0.7rem;
  font-size: 0.8rem;
}

/* Medium (default) */
.base-btn--medium {
  padding: 0.6rem 1.2rem;
  font-size: 0.88rem;
}

/* === DISABLED === */
.base-btn--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.base-btn--disabled:hover {
  transform: none;
}
</style>