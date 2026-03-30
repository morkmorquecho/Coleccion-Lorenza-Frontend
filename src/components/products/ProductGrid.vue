<template>
  <!--
    ProductGrid — grid adaptable de cards.

    Props:
      products  → array de objetos producto
      cols      → columnas en desktop (default 2)
      badge     → texto del badge para todas las cards (default null)
      gap       → separación entre cards en px (default 16)

    Uso:
      <ProductGrid :products="items" :cols="3" />
      <ProductGrid :products="items" :cols="2" />

    Mobile: siempre 2 columnas (grid 2×N), sin carousel.
  -->
  <div class="pg-wrapper">
    <div
      class="pg-track"
      :style="trackStyle"
    >
      <ProductCard
        v-for="(product, i) in safeProducts"
        :key="i"
        :product="product"
        :badge="badge"
        :disable-hover="isMobile"
        class="pg-item"
        @add="$emit('add', $event)"
        @wishlist="$emit('wishlist', $event)"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import ProductCard from '../products/ProductCard.vue'

export default {
  name: 'ProductGrid',
  components: { ProductCard },

  props: {
    products: {
      type: Array,
      default: () => [],
    },
    /** Número de columnas en desktop. En móvil siempre serán 2. */
    cols: {
      type: Number,
      default: 2,
    },
    badge: {
      type: String,
      default: null,
    },
    gap: {
      type: Number,
      default: 16,
    },
  },

  emits: ['add', 'wishlist'],

  setup(props) {
    const isMobile = ref(false)

    // Filtra entradas null/undefined para evitar crashes en ProductCard
    const safeProducts = computed(() =>
      (props.products || []).filter(Boolean)
    )

    // Pasa --pg-cols y --pg-gap al track; el media query de CSS se encarga del móvil
    const trackStyle = computed(() => ({
      '--pg-cols': props.cols,
      '--pg-gap': `${props.gap}px`,
    }))

    // Solo necesitamos saber si es móvil para pasarle disableHover a las cards
    let ro = null

    onMounted(() => {
      const check = () => {
        isMobile.value = window.innerWidth < 768
      }
      check()
      ro = new ResizeObserver(check)
      ro.observe(document.body)
    })

    onBeforeUnmount(() => ro?.disconnect())

    return {
      isMobile,
      safeProducts,
      trackStyle,
    }
  },
}
</script>

<style scoped>
/* ── Wrapper ──────────────────────────────────────────────────────────────── */
.pg-wrapper {
  width: 100%;
}

/* ── Track: grid adaptable con --pg-cols ──────────────────────────────────── */
.pg-track {
  display: grid;
  grid-template-columns: repeat(var(--pg-cols, 2), 1fr);
  gap: var(--pg-gap, 16px);
}

/* ── Mobile: 2 columnas fijas ─────────────────────────────────────────────── */
@media (max-width: 767px) {
  .pg-track {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}
</style>