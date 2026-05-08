<template>
  <section class="carousel-section">

    <!-- Header -->
    <div class="carousel-header">
      <div class="header-left">
        <h1 class="header-title">Ultimas<br /><em>Historias</em></h1>
      </div>
      <div class="header-right">
        <p class="header-desc">
          Descubre artículos, crónicas y reflexiones relacionadas al arte y cultura mexicana.
        </p>
        <div class="nav-buttons">
          <button class="nav-btn" @click="scrollBy(-1)" aria-label="Anterior">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="nav-btn" @click="scrollBy(1)" aria-label="Siguiente">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Carousel track -->
    <div class="carousel-outer">
      <div
        class="carousel-track"
        ref="trackRef"
        @scroll.passive="onScroll"
      >
        <!-- triplicamos: [clon izq] [original] [clon der] -->
        <div
          v-for="(card, i) in infiniteCards"
          :key="i"
          class="carousel-item"
          :style="{ '--i': i % cards.length }"
        >
          <article
            class="blog-card"
            :class="{ 'is-hovered': card._hovered }"
            @mouseenter="card._hovered = true"
            @mouseleave="card._hovered = false"
          >
            <div class="card-image-wrap">
              <img :src="card.cover_image" :alt="card.title" class="card-image" />
              <div class="image-overlay" />
            </div>
            <div class="card-body">
              <span class="card-section">{{ card.section }}</span>
              <h2 class="card-title">{{ card.title }}</h2>
              <p class="card-excerpt">{{ card.content.length > 30 ? card.content.slice(0, 30) + '...' : card.content }}</p>
            </div>
          </article>
        </div>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="progress-bar-wrap">
      <div class="progress-bar-track">
        <div class="progress-bar-fill" :style="{ width: progressPercent + '%' }" />
      </div>
      <span class="progress-label">{{ currentVisible }} / {{ cards.length }}</span>
    </div>

  </section>
</template>

<script setup>
// ✅ FIX #4: eliminado `reactive` (no se usaba), agregado `nextTick`
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import blogService from '@/services/blogService'

const cards = ref([])

// ── Infinite loop: triplicamos el array ───────────────────────────────────────
// ✅ FIX #1: cards → cards.value en todos los accesos dentro de la lógica JS
const infiniteCards = computed(() => [
  ...cards.value,
  ...cards.value,
  ...cards.value,
])

// ── Refs ──────────────────────────────────────────────────────────────────────
const trackRef   = ref(null)
const scrollLeft = ref(0)

// ── Helpers ───────────────────────────────────────────────────────────────────
function getItemWidth() {
  const el = trackRef.value
  if (!el || !el.firstElementChild) return 320
  return el.firstElementChild.offsetWidth
}

function getBlockWidth() {
  // ✅ FIX #1: cards → cards.value
  return cards.value.length * (getItemWidth() + 24)
}

// ── Computed para el UI ───────────────────────────────────────────────────────
const currentVisible = computed(() => {
  const itemW = getItemWidth()
  const relativeScroll = scrollLeft.value - getBlockWidth()
  const idx = Math.round(Math.max(0, relativeScroll) / (itemW + 24))
  // ✅ FIX #1: cards → cards.value
  return (idx % cards.value.length) + 1
})

const progressPercent = computed(() =>
  // ✅ FIX #1: cards → cards.value
  ((currentVisible.value - 1) / cards.value.length) * 100
)

// ── Scroll handler con teleport silencioso ────────────────────────────────────
function onScroll() {
  const el = trackRef.value
  if (!el) return
  scrollLeft.value = el.scrollLeft
  const block = getBlockWidth()
  if (!block) return

  if (el.scrollLeft >= block * 2) {
    el.scrollLeft -= block
    scrollLeft.value = el.scrollLeft
  }
  if (el.scrollLeft <= 0) {
    el.scrollLeft += block
    scrollLeft.value = el.scrollLeft
  }
}

function scrollBy(dir) {
  const el = trackRef.value
  if (!el) return
  el.scrollBy({ left: dir * (getItemWidth() + 24), behavior: 'smooth' })
}

// ── Drag to scroll ────────────────────────────────────────────────────────────
let isDragging      = false
let startX          = 0
let startScrollLeft = 0

function onMouseDown(e) {
  e.preventDefault()
  isDragging = true
  startX = e.pageX
  startScrollLeft = trackRef.value.scrollLeft
  trackRef.value.style.cursor = 'grabbing'
}
function onMouseMove(e) {
  if (!isDragging) return
  trackRef.value.scrollLeft = startScrollLeft - (e.pageX - startX)
}
function onMouseUp() {
  isDragging = false
  if (trackRef.value) trackRef.value.style.cursor = 'grab'
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
// ✅ FIX #2: Un solo onMounted async. Inicializamos el scroll DESPUÉS de cargar
//            los datos y esperar a que Vue renderice las cards con nextTick.
// ✅ FIX #3: Mapeamos los resultados agregando `_hovered: false` como propiedad
//            propia del objeto para que Vue 3 lo haga reactivo correctamente.
onMounted(async () => {
  const res = await blogService.getPosts({ recent: true })
  cards.value = res.results.map(card => ({ ...card, _hovered: false }))

  await nextTick() // esperar a que Vue renderice las cards antes de leer el DOM

  const el = trackRef.value
  if (!el) return

  // Arrancamos en el bloque del medio (el "original")
  el.scrollLeft = getBlockWidth()
  scrollLeft.value = el.scrollLeft

  el.addEventListener('mousedown', onMouseDown, { passive: false })
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
})
</script>

<style scoped>
.carousel-section {
  --accent: var(--color-primary);
  --color-background: var(--color-background);
  --ink: #1a1008;
  --muted: #6b5e52;
  --rule: rgba(26, 16, 8, 0.12);

  width: 100%;
  background: var(--color-background);
  padding: 64px 0 48px;
  box-sizing: border-box;
  overflow: hidden;
}

/* ── Header ──────────────────────────────────────────────────────────────── */
.carousel-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  padding: 0 clamp(24px, 5vw, 80px) 28px;
  margin-bottom: 40px;
  border-bottom: 1px solid var(--rule);
}

.header-eyebrow {
  font-family: 'COM4DL', Georgia, serif;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent);
  display: block;
  margin-bottom: 10px;
}

.header-title {
  font-family: 'Cormorant Garamond', Georgia, serif; 
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 700;
  line-height: 1.1;
  color: var(--ink);
  margin: 0;
}
.header-title em {
  font-style: italic;
  color: var(--accent);
}

.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
  max-width: 300px;
}

.header-desc {
  font-family: Georgia, serif;
  font-size: 13px;
  line-height: 1.7;
  color: var(--muted);
  margin: 0;
  text-align: right;
}

/* ── Nav buttons ─────────────────────────────────────────────────────────── */
.nav-buttons { display: flex; gap: 8px; }

.nav-btn {
  width: 40px; height: 40px;
  border: 1.5px solid var(--rule);
  background: transparent;
  border-radius: 50%;
  display: grid; place-items: center;
  cursor: pointer;
  color: var(--ink);
  transition: border-color 0.25s, background 0.25s, color 0.25s, transform 0.2s;
}
.nav-btn:hover {
  border-color: var(--accent);
  background: var(--accent);
  color: #fff;
  transform: scale(1.08);
}

/* ── Track ───────────────────────────────────────────────────────────────── */
.carousel-outer { position: relative; }

.carousel-track {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding: 8px clamp(24px, 5vw, 80px) 24px;
  cursor: grab;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.carousel-track::-webkit-scrollbar { display: none; }
.carousel-track:active { cursor: grabbing; }

/* ── Items ───────────────────────────────────────────────────────────────── */
.carousel-item {
  flex: 0 0 clamp(260px, 28vw, 360px);
  animation: fadeSlideIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(var(--i) * 60ms);
}

@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── BlogCard ────────────────────────────────────────────────────────────── */
.blog-card {
  display: flex;
  flex-direction: column;
  background: var(--color-background);
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  width: 100%;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.blog-card:hover,
.blog-card.is-hovered { transform: translateY(-4px); }

.card-image-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}
.card-image {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
  transition: transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.65s ease;
}
.blog-card:hover .card-image,
.blog-card.is-hovered .card-image {
  transform: scale(1.06);
  filter: saturate(1.1) brightness(1.03) sepia(0.18);
}

.image-overlay {
  position: absolute; inset: 0;
  background: rgba(255, 94, 31, 0);
  mix-blend-mode: overlay;
  transition: background 0.65s ease;
  pointer-events: none;
}
.blog-card:hover .image-overlay,
.blog-card.is-hovered .image-overlay { background: rgba(255, 94, 31, 0.22); }

.card-body {
  padding: 20px 0 8px;
  display: flex; flex-direction: column; gap: 10px;
}

.card-section {
  font-family: 'Georgia', sans-serif; /* ← antes: COM4DL */
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
  line-height: 1;
}

.card-title {
  font-size: clamp(18px, 2.2vw, 26px);
  font-weight: 700; line-height: 1.3;
  color: var(--ink); margin: 0;
  transition: color 0.4s ease;
}
.blog-card:hover .card-title,
.blog-card.is-hovered .card-title { color: var(--accent); }

.card-excerpt {
  font-family: 'Georgia', sans-serif; 
  font-size: 13px;
  line-height: 1.65;
  color: var(--muted);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.4s ease;
}
.blog-card:hover .card-excerpt,
.blog-card.is-hovered .card-excerpt { color: var(--color-primary); }

/* ── Progress ────────────────────────────────────────────────────────────── */
.progress-bar-wrap {
  display: flex; align-items: center; gap: 16px;
  padding: 0 clamp(24px, 5vw, 80px);
  margin-top: 8px;
}
.progress-bar-track {
  flex: 1; height: 2px;
  background: var(--rule); border-radius: 2px; overflow: hidden;
}
.progress-bar-fill {
  height: 100%; background: var(--accent);
  border-radius: 2px; transition: width 0.2s ease;
}
.progress-label {
  font-size: 11px; letter-spacing: 0.12em;
  color: var(--muted); white-space: nowrap;
}

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .carousel-header { flex-direction: column; align-items: flex-start; }
  .header-right { align-items: flex-start; max-width: 100%; }
  .header-desc { text-align: left; }
}
</style>