<template>
  <article
    v-if="product"
    class="card"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <span v-if="badge" class="badge">{{ badge }}</span>

    <!-- Wishlist button -->
    <button
      class="wishlist"
      :class="{ liked: isWishlisted }"
      @click.stop="toggleWishlist"
      aria-label="Agregar a favoritos"
    >
      <svg viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>

    <!-- Media: imagen + video en hover -->
    <div class="card-media">
      <img
        :src="activeImage"
        :alt="product.title"
        class="card-img"
        :class="{ 'img-hidden': hovered && product.intro_video }"
      />
      <video
        v-if="product.intro_video"
        ref="videoEl"
        :src="product.intro_video"
        class="card-video"
        :class="{ 'video-visible': hovered }"
        muted
        loop
        playsinline
        preload="none"
      />
      <div class="card-overlay" />

      <!-- Color swatches (ocultos en móvil vía CSS) -->
      <div v-if="product.swatches?.length" class="swatches">
        <button
          v-for="(s, i) in product.swatches"
          :key="i"
          class="swatch"
          :class="{ active: activeSwatchIndex === i }"
          :style="{ background: s.color }"
          :title="s.label"
          @click.stop="activateSwatch(i)"
        />
      </div>
    </div>

    <div class="card-info">
      <div class="card-prices">
        <span v-if="product.original_price_base" class="price-old">${{ product.original_price_base }}</span>
        <span class="price-new">${{ product.final_price_base }}</span>
      </div>

      <div class="card-bottom">
        <div class="card-texts">
          <p class="card-name">{{ product.title }}</p>
          <p class="card-stock" :class="stockClass">
            <span class="stock-dot" />{{ stockLabel }}
          </p>
        </div>

        <button
          class="btn-add"
          :disabled="product.quantity === 0"
          @click.stop="handleAdd"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          ADD
        </button>
      </div>
    </div>
  </article>
</template>

<script>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'

export default {
  name: 'ProductCard',

  props: {
    /**
     * Objeto del producto:
     * {
     *   id, title, thumbnail_path, final_price_base, original_price_base,
     *   intro_video, stock, swatches: [{ color: '#hex', label: 'string', thumbnail_path?: 'url' }]
     * }
     */
    product: {
      type: Object,
      required: true,
    },
    badge: {
      type: String,
      default: null,
    },
    /** Desactiva hover-video e interacciones (ProductGrid lo activa en móvil) */
    disableHover: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['wishlist'],

  setup(props, { emit }) {
    const cartStore = useCartStore()
    
    const videoEl           = ref(null)
    const hovered           = ref(false)
    const isWishlisted      = ref(false)
    const activeSwatchIndex = ref(0)

    /* ── Imagen activa según swatch seleccionado ────────────────────────── */
    const activeImage = computed(() => {
      const s = props.product.swatches?.[activeSwatchIndex.value]
      return s?.thumbnail_path ?? props.product.thumbnail_path
    })

    /* ── Stock ──────────────────────────────────────────────────────────── */
    const stockLabel = computed(() =>
      props.product.quantity === 0 ? 'Sold out' : 'In stock'
    )
    const stockClass = computed(() => ({
      'stock-out': props.product.quantity === 0,
    }))

    /* ── Hover (video) ──────────────────────────────────────────────────── */
    function onEnter() {
      if (props.disableHover) return
      hovered.value = true
      const vid = videoEl.value
      if (vid?.src) {
        vid.currentTime = 0
        vid.play().catch(() => {})
      }
    }

    function onLeave() {
      if (props.disableHover) return
      hovered.value = false
      const vid = videoEl.value
      if (vid) { vid.pause(); vid.currentTime = 0 }
    }

    /* ── Actions ────────────────────────────────────────────────────────── */
    function toggleWishlist() {
      isWishlisted.value = !isWishlisted.value
      emit('wishlist', { product: props.product, wishlisted: isWishlisted.value })
    }

    function activateSwatch(i) {
      activeSwatchIndex.value = i
    }

    function handleAdd() {
      if (props.product.quantity === 0) return
      
      // Usar el store para agregar al carrito
      // La estructura esperada por el store es { piece: { id, slug, title, thumbnail_path, final_price_base }, quantity }
      cartStore.addItem({
        id: props.product.id,
        slug: props.product.slug,
        title: props.product.title,
        thumbnail_path: props.product.thumbnail_path,
        final_price_base: props.product.final_price_base
      }, 1)
      
      // Opcional: emitir un evento para notificar al padre (ej. para mostrar toast)
      // emit('added-to-cart', props.product)
    }

    return {
      videoEl, hovered, isWishlisted, activeSwatchIndex,
      activeImage, stockLabel, stockClass,
      onEnter, onLeave, toggleWishlist, activateSwatch, handleAdd,
    }
  },
}
</script>

<style scoped>
/* ... mantén todos los estilos exactamente como estaban ... */
@font-face {
  font-family: 'COM4DL';
  src: url('/fonts/COM4DL__.TTF') format('truetype');
  font-weight: normal;
  font-style: normal;
}

/* ── Card base ───────────────────────────────────────────────────────────── */
.card {
  background: #ffffff;
  border-radius: 20px;
  padding: 16px 16px 14px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
  transition:
    transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.12);
}

/* ── Badge ───────────────────────────────────────────────────────────────── */
.badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: #fde8d8;
  color: #c94f2c;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.1em;
  padding: 4px 10px;
  border-radius: 999px;
  z-index: 3;
  font-family: 'COM4DL', serif;
}

/* ── Wishlist ────────────────────────────────────────────────────────────── */
.wishlist {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 3;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.88);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, transform 0.2s ease;
  backdrop-filter: blur(4px);
}

.wishlist:hover {
  background: #fff;
  transform: scale(1.1);
}

.wishlist svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: #666;
  stroke-width: 1.8;
  transition: fill 0.2s ease, stroke 0.2s ease;
}

.wishlist.liked svg {
  fill: #c94f2c;
  stroke: #c94f2c;
}

/* ── Media ───────────────────────────────────────────────────────────────── */
.card-media {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 12px;
  background: #ede9e2;
}

.card-img,
.card-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.card-img {
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.4s ease, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.card:hover .card-img { transform: scale(1.04); }
.card-img.img-hidden  { opacity: 0; }

.card-video {
  opacity: 0;
  transition: opacity 0.4s ease;
}

.card-video.video-visible { opacity: 1; }

/* Gradient overlay al hover */
.card-overlay {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: linear-gradient(to top, rgba(28, 26, 23, 0.28) 0%, transparent 52%);
  opacity: 0;
  transition: opacity 0.35s ease;
  z-index: 1;
  pointer-events: none;
}

.card:hover .card-overlay { opacity: 1; }

/* ── Swatches ────────────────────────────────────────────────────────────── */
.swatches {
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 2;
  display: flex;
  gap: 5px;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.card:hover .swatches {
  opacity: 1;
  transform: translateY(0);
}

.swatch {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
  padding: 0;
  outline: none;
}

.swatch:hover,
.swatch.active {
  transform: scale(1.25);
  border-color: #fff;
}

/* ── Info ────────────────────────────────────────────────────────────────── */
.card-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-prices {
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  gap: 6px;
}

.price-old {
  font-size: 11px;
  color: #ccc;
  text-decoration: line-through;
  font-family: 'COM4DL', serif;
}

.price-new {
  font-size: 14px;
  color: #c94f2c;
  font-weight: 600;
  font-family: 'COM4DL', serif;
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 8px;
}

.card-texts {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.card-name {
  font-size: 13px;
  font-weight: 600;
  color: #1c1a17;
  letter-spacing: 0.04em;
  margin: 0;
  font-family:'Cormorant Garamond';
}

/* ── Stock ───────────────────────────────────────────────────────────────── */
.card-stock {
  font-size: 11px;
  color: #3db87a;
  margin: 0;
  font-family: 'COM4DL', serif;
  letter-spacing: 0.04em;
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-stock.stock-out { color: #d95a5a; }

.stock-dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

/* ── Add button ──────────────────────────────────────────────────────────── */
.btn-add {
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1.5px solid #c5bfb6;
  background: transparent;
  color: #1c1a17;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  padding: 7px 12px;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
  font-family: serif;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
  flex-shrink: 0;
}

.btn-add svg {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}

.btn-add:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.btn-add:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  pointer-events: none;
}

/* ── Mobile ──────────────────────────────────────────────────────────────── */
@media (max-width: 767px) {
  .card {
    padding: 10px;
    border-radius: 14px;
    gap: 8px;
  }

  .card-media { border-radius: 8px; }

  /* Sin hover en touch */
  .card:hover               { transform: none; box-shadow: none; }
  .card:hover .card-overlay { opacity: 0; }
  .swatches                 { display: none; }

  .card-name  { font-size: 11px; }
  .price-new  { font-size: 12px; }
  .price-old  { font-size: 10px; }
  .card-stock { font-size: 10px; }

  .btn-add {
    font-size: 10px;
    padding: 6px 10px;
    gap: 4px;
  }

  .btn-add svg { width: 11px; height: 11px; }

  .badge { font-size: 9px; padding: 3px 8px; }

  .wishlist     { width: 28px; height: 28px; }
  .wishlist svg { width: 13px; height: 13px; }
}
</style>