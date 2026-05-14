<template>
  <button
    class="pill-btn"
    :class="[`pill-btn--${size}`]"
    :style="cssVars"
    :disabled="disabled"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <slot name="icon" />
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /**
   * Color de acento del botón (hover fill + border).
   * Acepta cualquier valor CSS válido: hex, rgb, hsl, variable CSS, etc.
   * @default 'var(--color-primary)'
   */
  color: {
    type: String,
    default: 'var(--color-primary)',
  },
  textColor: {
    type: String,
    default: '#1c1a17',
  },

  /**
   * Tamaño del botón.
   * @values 'sm' | 'md' | 'lg'
   * @default 'md'
   */
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },

  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])

const cssVars = computed(() => ({
  '--btn-color': props.color,
  '--btn-text-color': props.textColor,
}))
</script>

<style scoped>
/* ── Base ─────────────────────────────────────────── */
.pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  border: 1.5px solid #c5bfb6;
  background: transparent;
  color: var(--btn-text-color);

  font-weight: 600;
  font-family: Georgia, 'Times New Roman', Times, serif !important;
  white-space: nowrap;

  border-radius: 999px;
  cursor: pointer;
  flex-shrink: 0;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}
/* ── Tamaños ──────────────────────────────────────── */
.pill-btn--sm {
  font-size: 12px;
  padding: 5px 10px;
  gap: 4px;
}

.pill-btn--md {
  font-size: 14px;
  padding: 8px 14px;
  gap: 6px;
}

.pill-btn--lg {
  font-size: 16px;
  padding: 11px 20px;
  gap: 8px;
}

/* ── Hover ────────────────────────────────────────── */
.pill-btn:hover:not(:disabled) {
  background: var(--btn-color);
  border-color: var(--btn-color);
  color: #fff;
  transform: scale(1.05);
}

/* ── Disabled ─────────────────────────────────────── */
.pill-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>