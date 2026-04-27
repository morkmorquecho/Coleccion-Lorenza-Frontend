<template>
  <section class="highlighted">

    <!-- DESKTOP: grid 2 cols (cards | hero) -->
    <div class="hl-grid">

      <!-- Cards grid desktop / carousel mobile -->
      <div class="cards-wrapper">
        <div
          class="cards-track"
          ref="track"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <article
            v-for="(piece, i) in pieces"
            :key="i"
            class="card"
            :class="{ 'active-slide': currentSlide === i }"
            @mouseenter="onCardEnter(i)"
            @mouseleave="onCardLeave(i)"
          >
            <span class="badge">NEW</span>

            <!-- media wrapper: image + video -->
            <RouterLink :to="{ name: 'PieceDetail', params: { slug: piece.slug } }">
            <div class="card-media"
              @mouseenter="onCardEnter(i)"
              @mouseleave="onCardLeave(i)"
            >
              <img
                :src="piece.thumbnail_path"
                :alt="piece.title"
                class="card-img"
                :class="{ 'img-hidden': hoveredIndex === i && piece.intro_video }"
                :style="{
                  objectPosition: getImageFocalPoint(piece),
                  objectFit: 'cover'
                }"
              />
              <video
                v-if="piece.intro_video && piece.intro_video.trim() !== ''"
                :ref="el => { if(el) videoRefs[i] = el }"
                :src="piece.intro_video"
                class="card-video"
                :class="{ 'video-visible': hoveredIndex === i }"
                muted
                loop
                playsinline
                preload="none"
              />
            </div>
          </RouterLink>

            <div class="card-info">
              <div class="card-prices">
                <span
                  v-if="piece.original_price_base != piece.final_price_base"                
                  class="price-old">${{ piece.original_price_base }}
                </span>
                <span class="price-new">${{ piece.final_price_base }}</span>
              </div>
              <div class="card-bottom">
                <div class="card-texts">
                  <p class="card-name">{{ piece.title }}</p>
                  <p class="card-color">{{ piece.section }}</p>
                </div>
                  <button
                    class="btn-add"
                    :class="{ 'btn-disabled': piece.quantity === 0 }"
                    :disabled="piece.quantity === 0"
                    @click.stop="handleAdd(piece)" 
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                  ADD
                </button>
              </div>
            </div>
          </article>
        </div>

        <!-- Mobile dots -->
        <div class="carousel-dots">
          <button
            v-for="(_, i) in pieces"
            :key="i"
            class="dot"
            :class="{ active: currentSlide === i }"
            @click="goTo(i)"
          />
        </div>
      </div>

      <!-- Hero image -->
      <div class="hero-panel">
        <img src="/img/alebrijes/foto.jpg" alt="Women's Sale" class="hero-img" />
        <div class="hero-overlay">
          <h2 class="hero-title">Decora tu hogar con identidad</h2>
          <p class="hero-sub">Piezas con esencia mexicana que cuentan una historia.</p>        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import '../../../assets/main.css'
import piecesService from '@/services/piecesService'
import { useCartStore } from '@/stores/cart'

const pieces = ref([])

onMounted(async () => {
  const res = await piecesService.getPieces({ featured: true })
  pieces.value = res.results
  await nextTick()
  updateCardWidth()
})

function getImageFocalPoint(piece) {
  if (piece.focal_point) return piece.focal_point
  return '60% 10%'
}

const videoRefs = ref([])
const hoveredIndex = ref(null)
const isMobile = ref(false)

// ── Desktop hover video ─────────────────────────────────────────────────────
function onCardEnter(i) {
  if (isMobile.value) return
  hoveredIndex.value = i
  
  const piece = pieces.value[i]
  const vid = videoRefs.value[i]
  
  if (vid && piece?.intro_video && vid.src) {
    vid.currentTime = 0
    vid.play().catch(err => {
      console.log('Video autoplay failed:', err)
    })
  }
}

function onCardLeave(i) {
  if (isMobile.value) return
  hoveredIndex.value = null
  
  const vid = videoRefs.value[i]
  if (vid) {
    vid.pause()
    vid.currentTime = 0
  }
}

// ── Mobile carousel (Instagram Stories style) ──────────────────────────────
const track = ref(null)
const currentSlide = ref(0)
const isDragging = ref(false)
const startPosition = ref(0)
const currentTranslate = ref(0)
const previousTranslate = ref(0)
const animationId = ref(null)
const cardWidth = ref(0)

function updateCardWidth() {
  if (!track.value) return
  const card = track.value.querySelector('.card')
  if (card) {
    // Obtener el ancho incluyendo el gap
    const cardRect = card.getBoundingClientRect()
    const trackChildren = track.value.children
    if (trackChildren.length > 0) {
      // Calcular el gap del CSS
      const trackStyle = window.getComputedStyle(track.value)
      const gap = parseInt(trackStyle.gap) || 16
      cardWidth.value = cardRect.width + gap
    }
  }
}

function setSliderPosition() {
  if (!track.value) return
  const position = -currentSlide.value * cardWidth.value
  currentTranslate.value = position
  previousTranslate.value = position
  track.value.style.transform = `translateX(${position}px)`
}

function goTo(index) {
  if (index === currentSlide.value) return
  currentSlide.value = Math.max(0, Math.min(index, pieces.value.length - 1))
  setSliderPosition()
}

function animation() {
  if (!isDragging.value) return
  
  const movedBy = currentTranslate.value - previousTranslate.value
  
  // Calcular el cambio de slide basado en el movimiento
  const threshold = cardWidth.value * 0.3 // 30% del ancho de la card
  
  if (movedBy < -threshold) {
    // Swipe hacia la izquierda - siguiente slide
    goTo(currentSlide.value + 1)
    isDragging.value = false
  } else if (movedBy > threshold) {
    // Swipe hacia la derecha - slide anterior
    goTo(currentSlide.value - 1)
    isDragging.value = false
  } else {
    // Volver a la posición original
    setSliderPosition()
    isDragging.value = false
  }
  
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
    animationId.value = null
  }
}

function onTouchStart(e) {
  if (!isMobile.value) return
  
  // Cancelar cualquier animación pendiente
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
    animationId.value = null
  }
  
  isDragging.value = true
  startPosition.value = e.touches[0].clientX
  previousTranslate.value = currentTranslate.value
  
  // Remover transición durante el arrastre
  if (track.value) {
    track.value.style.transition = 'none'
  }
}

function onTouchMove(e) {
  if (!isMobile.value || !isDragging.value) return
  
  const currentPosition = e.touches[0].clientX
  const diff = currentPosition - startPosition.value
  
  // Calcular nueva posición con límites suaves
  let newTranslate = previousTranslate.value + diff
  
  // Añadir resistencia en los bordes
  if (currentSlide.value === 0 && diff > 0) {
    // Primera card, arrastrando a la derecha - resistencia
    newTranslate = previousTranslate.value + (diff * 0.3)
  } else if (currentSlide.value === pieces.value.length - 1 && diff < 0) {
    // Última card, arrastrando a la izquierda - resistencia
    newTranslate = previousTranslate.value + (diff * 0.3)
  }
  
  currentTranslate.value = newTranslate
  
  if (track.value) {
    track.value.style.transform = `translateX(${newTranslate}px)`
  }
}

function onTouchEnd() {
  if (!isMobile.value || !isDragging.value) return
  
  // Restaurar transición
  if (track.value) {
    track.value.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  }
  
  // Usar requestAnimationFrame para una animación suave
  animationId.value = requestAnimationFrame(animation)
}

// ── Resize observer ─────────────────────────────────────────────────────────
let ro = null
let resizeObserver = null

onMounted(() => {
  const check = () => {
    isMobile.value = window.innerWidth < 768
    updateCardWidth()
    
    if (!isMobile.value && track.value) {
      track.value.style.transform = ''
      track.value.style.transition = ''
    } else if (isMobile.value) {
      setSliderPosition()
    }
  }

  check()
  
  ro = new ResizeObserver(() => {
    updateCardWidth()
    if (isMobile.value) {
      setSliderPosition()
    }
  })
  ro.observe(document.body)
  
  // Observar cambios en el track para actualizar ancho
  if (track.value) {
    resizeObserver = new ResizeObserver(() => {
      updateCardWidth()
      if (isMobile.value) {
        setSliderPosition()
      }
    })
    resizeObserver.observe(track.value)
  }
})

onBeforeUnmount(() => {
  if (ro) ro.disconnect()
  if (resizeObserver) resizeObserver.disconnect()
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }
})

const cartStore = useCartStore()

function handleAdd(piece) {
  if (piece.quantity === 0) return
  
  cartStore.addItem({
    id: piece.id,
    slug: piece.slug,
    title: piece.title,
    thumbnail_path: piece.thumbnail_path,
    final_price_base: piece.final_price_base
  }, 1)

  cartStore.openCart()
}
</script>

<style scoped>
/* ── Section ──────────────────────────────────────────────────────────────── */
.highlighted {
  width: 100%;
  background: var(--color-background);
  padding: 24px;
  box-sizing: border-box;
  font-family: serif;
  overflow-x: hidden;
}

/* ── Desktop grid ─────────────────────────────────────────────────────────── */
.hl-grid {
  display: grid;
  grid-template-columns: 1fr 0.72fr;
  gap: 16px;
  max-width: 1500px;
  margin: 0 auto;
  overflow-x: hidden;
}

/* ── Cards wrapper ────────────────────────────────────────────────────────── */
.cards-wrapper {
  overflow: hidden;
  min-width: 0;
}

.cards-track {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  transition: transform 0.42s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

/* ── Single card ──────────────────────────────────────────────────────────── */
.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 18px 18px 14px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 0;
  overflow: hidden;
}

.card:hover {
  box-shadow: 0 12px 28px rgba(0,0,0,0.15);
  transform: translateY(-4px);
}

/* Efecto de zoom en la imagen al hacer hover */
.card:hover .card-img:not(.img-hidden) {
  transform: scale(1.08);
}

.card:hover .card-video {
  transform: scale(1.08);
}

/* Media wrapper con overflow hidden para el zoom */
.card-media {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 10px;
  background: #f0ede8;
}

.card-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-img {
  opacity: 1;
}

.card-img.img-hidden {
  opacity: 0;
}

.card-video {
  opacity: 0;
}

.card-video.video-visible {
  opacity: 1;
}

/* Badge */
.badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: var(--orange-soft);
  color: #3a3530;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 4px 10px;
  border-radius: 999px;
  z-index: 2;
  font-family: 'COM4DL';
}

/* Info */
.card-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-prices {
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  gap: 8px;
}

.price-old {
  font-size: 13px;
  color: #999;
  text-decoration: line-through;
  font-family: serif;
}

.price-new {
  font-size: 15px;
  color: #c94f2c;
  font-weight: 700;
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
  gap: 2px;
}

.card-name {
  font-size: 13px;
  font-weight: 700;
  color: #1c1a17;
  letter-spacing: 0.04em;
  margin: 0;
  font-family:'Cormorant Garamond','Georgia', 'Times New Roman', Times, serif;
}

.card-color {
  font-size: 12px;
  color: #888;
  margin: 0;
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-style: italic;
}

/* Add button - Estilos normales */
.btn-add {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1.5px solid #c5bfb6;
  background: transparent;
  color: #1c1a17;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
  font-family: serif;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-add:hover:not(:disabled) {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
  transform: scale(1.05);
}

/* Estilos para botón deshabilitado */
.btn-add:disabled,
.btn-add.btn-disabled {
  opacity: 0.5;
  background: #f5f5f5;
  border-color: #e0e0e0;
  color: #999;
  transform: none;
  cursor: default;
}

.btn-add:disabled:hover,
.btn-add.btn-disabled:hover {
  background: #f5f5f5;
  border-color: #e0e0e0;
  color: #999;
  transform: none;
  cursor: default;
}

/* ── Hero panel ───────────────────────────────────────────────────────────── */
.hero-panel {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  min-height: 400px;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.55) 40%, transparent 80%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 36px 32px;
  gap: 10px;
}

.hero-title {
  font-family: COM4DL;
  font-size: clamp(28px, 3vw, 44px);
  color: #fff;
  font-weight: 400;
  margin: 0;
  line-height: 1.15;
}

.hero-sub {
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-size: clamp(13px, 1.2vw, 16px);
  color: rgba(255,255,255,0.82);
  max-width: 340px;
  line-height: 1.55;
  margin: 0;
}

/* ── Carousel dots (mobile only, hidden on desktop) ───────────────────────── */
.carousel-dots {
  display: none;
  justify-content: center;
  gap: 7px;
  margin-top: 14px;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: none;
  background: #ccc;
  cursor: pointer;
  padding: 0;
  transition: background 0.25s ease, transform 0.25s ease;
}

.dot.active {
  background: #c94f2c;
  transform: scale(1.3);
}

/* ── Responsive ───────────────────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .hl-grid {
    grid-template-columns: 1fr 0.6fr;
  }
}

@media (max-width: 767px) {
  .highlighted {
    padding: 0;
    overflow-x: hidden;
  }

  .hl-grid {
    display: flex;
    flex-direction: column-reverse;
    gap: 0;
    overflow-x: hidden;
  }

  /* Hero takes full width on mobile */
  .hero-panel {
    width: 100%;
    border-radius: 0;
    min-height: 56vw;
  }

  /* Cards become horizontal carousel - Instagram Stories style */
  .cards-wrapper {
    padding: 20px 20px 16px;
    overflow: hidden;
    position: relative;
  }

  .cards-track {
    display: flex;
    gap: 16px;
    grid-template-columns: unset;
    width: 100%;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: grab;
    touch-action: pan-y pinch-zoom;
  }
  
  .cards-track:active {
    cursor: grabbing;
  }

  .card {
    min-width: calc(100% - 0px);
    flex-shrink: 0;
    flex-grow: 1;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .carousel-dots {
    display: flex;
    margin-top: 20px;
  }
}

@media (max-width: 480px) {
  .card {
    min-width: 100%;
  }
}
</style>