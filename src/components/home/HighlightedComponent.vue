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
            v-for="(product, i) in products"
            :key="i"
            class="card"
            @mouseenter="onCardEnter(i)"
            @mouseleave="onCardLeave(i)"
          >
            <span class="badge">NEW</span>

            <!-- media wrapper: image + video -->
            <div class="card-media">
              <img
                :src="product.image"
                :alt="product.name"
                class="card-img"
                :class="{ 'img-hidden': hoveredIndex === i }"
              />
              <video
                :ref="el => { if(el) videoRefs[i] = el }"
                :src="product.video"
                class="card-video"
                :class="{ 'video-visible': hoveredIndex === i }"
                muted
                loop
                playsinline
                preload="none"
              />
            </div>

            <div class="card-info">
              <div class="card-prices">
                <span class="price-old">{{ product.priceOld }}</span>
                <span class="price-new">{{ product.price }}</span>
              </div>
              <div class="card-bottom">
                <div class="card-texts">
                  <p class="card-name">{{ product.name }}</p>
                  <p class="card-color">{{ product.section }}</p>
                </div>
                <button class="btn-add">
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
            v-for="(_, i) in products"
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

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import '../../assets/main.css'

export default {
  name: 'HighlightedComponent',

  setup() {
    const products = [
      {
        name: 'Pieza 1',
        section: 'Dia de muertos',
        priceOld: '$105',
        price: '$84',
        image: '/img/alebrijes/img-2.jpg',
        video: '/video/1.mp4',
      },
      {
        name: 'Pieza 2',
        section: 'Dia de muertos',
        priceOld: '$100',
        price: '$80',
        image: '/img/alebrijes/img-1.jpg',
        video: '/video/2.mp4',
      },
      {
        name: 'Pieza 2',
        section: 'Dia de muertos',
        priceOld: '$100',
        price: '$70',
        image: '/img/alebrijes/img-3.jpg',
        video: '/video/3.mp4',
      },
      {
        name: 'Pieza 2',
        section: 'Dia de muertos',
        priceOld: '$140',
        price: '$98',
        image: '/img/alebrijes/img-4.jpg',
        video: '/video/4.mp4',
      },
    ]

    const videoRefs = ref([])
    const hoveredIndex = ref(null)
    const isMobile = ref(false)

    // ── Desktop hover video ──────────────────────────────────────────────────
    function onCardEnter(i) {
      if (isMobile.value) return
      hoveredIndex.value = i
      const vid = videoRefs.value[i]
      if (vid && vid.src) {
        vid.currentTime = 0
        vid.play().catch(() => {})
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

    // ── Mobile carousel ──────────────────────────────────────────────────────
    const track = ref(null)
    const currentSlide = ref(0)
    let touchStartX = 0
    let touchDeltaX = 0
    let cardWidth = 0

    function getCardWidth() {
      if (!track.value) return 0
      const card = track.value.querySelector('.card')
      return card ? card.offsetWidth + 16 : 0 // gap 16
    }

    function goTo(index) {
      currentSlide.value = Math.max(0, Math.min(index, products.length - 1))
      if (track.value) {
        cardWidth = getCardWidth()
        track.value.style.transform = `translateX(-${currentSlide.value * cardWidth}px)`
      }
    }

    function onTouchStart(e) {
      if (!isMobile.value) return
      touchStartX = e.touches[0].clientX
      touchDeltaX = 0
      cardWidth = getCardWidth()
    }

    function onTouchMove(e) {
      if (!isMobile.value) return
      touchDeltaX = e.touches[0].clientX - touchStartX
      const base = -currentSlide.value * cardWidth
      if (track.value) {
        track.value.style.transform = `translateX(${base + touchDeltaX}px)`
      }
    }

    function onTouchEnd() {
      if (!isMobile.value) return
      if (touchDeltaX < -50) goTo(currentSlide.value + 1)
      else if (touchDeltaX > 50) goTo(currentSlide.value - 1)
      else goTo(currentSlide.value)
    }

    // ── Resize observer ──────────────────────────────────────────────────────
    let ro = null

    onMounted(() => {
      const check = () => {
        isMobile.value = window.innerWidth < 768
        if (!isMobile.value && track.value) {
          track.value.style.transform = ''
        }
      }
      check()
      ro = new ResizeObserver(check)
      ro.observe(document.body)
    })

    onBeforeUnmount(() => {
      if (ro) ro.disconnect()
    })

    return {
      products,
      videoRefs,
      hoveredIndex,
      currentSlide,
      track,
      isMobile,
      onCardEnter,
      onCardLeave,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      goTo,
    }
  },
}
</script>

<style scoped>
@font-face {
  font-family: 'COM4DL';
  src: url('/fonts/COM4DL__.TTF') format('truetype');
  font-weight: normal;
  font-style: normal;
}

/* ── Section ──────────────────────────────────────────────────────────────── */
.highlighted {
  width: 100%;
  background: var(--color-background);
  padding: 24px;
  box-sizing: border-box;
  font-family: 'COM4DL', serif;
}

/* ── Desktop grid ─────────────────────────────────────────────────────────── */
.hl-grid {
  display: grid;
  grid-template-columns: 1fr 0.72fr;
  gap: 16px;
  max-width: 1500px;
  margin: 0 auto;
}

/* ── Cards wrapper ────────────────────────────────────────────────────────── */
.cards-wrapper {
  overflow: hidden;
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
  cursor: pointer;
  transition: box-shadow 0.3s ease;
  min-width: 0;
}

.card:hover {
  box-shadow: 0 6px 24px rgba(0,0,0,0.10);
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
  font-family: 'COM4DL', serif;
}

/* Media */
.card-media {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 10px;
  background: #f0ede8;
}

.card-img,
.card-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  transition: opacity 0.35s ease;
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
  font-family: 'COM4DL', serif;
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
}

.card-color {
  font-size: 12px;
  color: #888;
  margin: 0;
  font-family: 'COM4DL', serif;
}

/* Add button */
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
  font-family: 'COM4DL', serif;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  flex-shrink: 0;
}

.btn-add:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
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
  font-family: 'COM4DL', serif;
  font-size: clamp(28px, 3vw, 44px);
  color: #fff;
  font-weight: 400;
  margin: 0;
  line-height: 1.15;
}

.hero-sub {
  font-family: 'COM4DL', serif;
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
  }

  .hl-grid {
    display: flex;
    flex-direction: column-reverse;
    gap: 0;
  }

  /* Hero takes full width on mobile */
  .hero-panel {
    width: 100%;
    border-radius: 0;
    min-height: 56vw;
  }

  /* Cards become horizontal scroll carousel */
  .cards-wrapper {
    padding: 20px 20px 16px;
    overflow: hidden;
  }

  .cards-track {
    display: flex;
    gap: 16px;
    /* remove grid, flex row */
    grid-template-columns: unset;
  }

  .card {
    min-width: calc(80vw - 40px);
    flex-shrink: 0;
  }

  .carousel-dots {
    display: flex;
  }
}

@media (max-width: 480px) {
  .card {
    min-width: calc(88vw - 40px);
  }
}
</style>
