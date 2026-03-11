<template>
  <div
    class="carousel"
    @mouseenter="pause"
    @mouseleave="resume"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <!-- Track vertical -->
    <div class="carousel__track" :style="trackStyle">
      <div
        v-for="(slide, i) in slides"
        :key="i"
        class="carousel__slide"
        :style="{ backgroundImage: slide.image ? `url(${slide.image})` : 'none' }"
      >
        <!-- Overlay para legibilidad -->
        <div class="slide__overlay"></div>

        <!-- Frase -->
        <div class="slide__phrase">
          <span>ARTE</span>
          <span class="phrase__sep">—</span>
          <span>MEXICANO</span>
          <span class="phrase__sep">—</span>
          <span>EN PAPEL</span>
        </div>
      </div>
    </div>

    <!-- Controles -->
    <div class="carousel__controls">
      <button class="ctrl" aria-label="Anterior" @click="prev">
        <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
          <path d="M8 12L2 7L8 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>

      <div class="carousel__dots">
        <button
          v-for="(s, i) in slides"
          :key="i"
          class="dot"
          :class="{ 'dot--active': current === i }"
          @click="goTo(i)"
          :aria-label="`Slide ${i + 1}`"
        ></button>
      </div>

      <button class="ctrl" aria-label="Siguiente" @click="next">
        <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
          <path d="M2 2L8 7L2 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <!-- Barra de progreso -->
    <div class="carousel__progress">
      <div
        class="carousel__progress-bar"
        :style="{ transform: `scaleX(${progress})` }"
      ></div>
    </div>

    <!-- Contador -->
    <div class="carousel__index">
      <span class="idx-current">{{ pad(current + 1) }}</span>
      <span class="idx-sep">/</span>
      <span class="idx-total">{{ pad(slides.length) }}</span>
    </div>
  </div>
</template>

<script>
const INTERVAL  = 4500
const SLIDE_EASE = 'cubic-bezier(0.77, 0, 0.18, 1)'

export default {
  name: 'VerticalCarousel',

  props: {
    slides: {
      type: Array,
      required: true,
      // Cada slide es un objeto: { image: '/img/alebrije-1.jpg' }
      // Si no hay imagen, muestra fondo oscuro placeholder
    },
    delay: {
      type: Number,
      default: 0, // delay inicial para desfasar los 3 carruseles
    }
  },

  data() {
    return {
      current:    0,
      paused:     false,
      progress:   0,
      autoTimer:  null,
      progTimer:  null,
      touchStartY: 0,
    }
  },

  computed: {
    trackStyle() {
      return {
        transform:  `translateY(-${this.current * 100}%)`,
        transition: `transform 0.9s ${SLIDE_EASE}`,
      }
    }
  },

  mounted() {
    setTimeout(() => {
      this.scheduleNext()
      this.startProgress()
    }, this.delay)
  },

  beforeUnmount() {
    clearTimeout(this.autoTimer)
    clearInterval(this.progTimer)
  },

  methods: {
    next() {
      this.current = (this.current + 1) % this.slides.length
      this.resetProgress()
    },

    prev() {
      this.current = (this.current - 1 + this.slides.length) % this.slides.length
      this.resetProgress()
    },

    goTo(i) {
      this.current = i
      this.resetProgress()
    },

    pause() {
      this.paused = true
      clearTimeout(this.autoTimer)
      clearInterval(this.progTimer)
    },

    resume() {
      this.paused   = false
      this.progress = 0
      this.scheduleNext()
      this.startProgress()
    },

    scheduleNext() {
      clearTimeout(this.autoTimer)
      this.autoTimer = setTimeout(() => {
        if (!this.paused) {
          this.next()
        }
      }, INTERVAL)
    },

    startProgress() {
      clearInterval(this.progTimer)
      const steps = 60
      const step  = 1 / steps
      const delay = INTERVAL / steps

      this.progTimer = setInterval(() => {
        if (this.paused) return
        this.progress = Math.min(this.progress + step, 1)
        if (this.progress >= 1) clearInterval(this.progTimer)
      }, delay)
    },

    resetProgress() {
      clearTimeout(this.autoTimer)
      clearInterval(this.progTimer)
      this.progress = 0
      if (!this.paused) {
        this.$nextTick(() => {
          this.scheduleNext()
          this.startProgress()
        })
      }
    },

    onTouchStart(e) {
      this.touchStartY = e.touches[0].clientY
    },

    onTouchEnd(e) {
      const dy = this.touchStartY - e.changedTouches[0].clientY
      if (Math.abs(dy) > 40) {
        dy > 0 ? this.next() : this.prev()
      }
    },

    pad(n) {
      return String(n).padStart(2, '0')
    }
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'Com4ble';
  src: url('/fonts/COM4DL__.TTF') format('truetype');
  font-display: swap;
}

/* ── Carousel shell ──────────────────────── */
.carousel {
  position: relative;
  overflow: hidden;
  background: #1a0e09; /* placeholder hasta tener fotos */
}

/* ── Track ───────────────────────────────── */
.carousel__track {
  display: flex;
  flex-direction: column;
  height: 100%;
  will-change: transform;
}

/* ── Slide ───────────────────────────────── */
.carousel__slide {
  flex: 0 0 100%;
  height: 100%;
  position: relative;
  background-size: cover;
  background-position: center;
  background-color: #1a0e09;
}

/* Overlay oscuro para legibilidad de texto */
.slide__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 5, 2, 0.55) 0%,
    rgba(10, 5, 2, 0.1)  50%,
    rgba(10, 5, 2, 0.2)  100%
  );
  z-index: 1;
}

/* ── Frase ───────────────────────────────── */
.slide__phrase {
  position: absolute;
  bottom: 3rem;
  left: 0; right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  z-index: 10;
  font-family: 'Com4ble', Georgia, serif;
  font-size: clamp(0.6rem, 1vw, 0.85rem);
  letter-spacing: 0.38em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.92);
}

.phrase__sep {
  color: #dd4b24;
  opacity: 0.9;
  font-size: 0.75em;
}

/* ── Controles ───────────────────────────── */
.carousel__controls {
  position: absolute;
  right: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.ctrl {
  width: 26px; height: 26px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(8px);
  color: rgba(255, 255, 255, 0.65);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.25s ease,
              border-color 0.25s ease,
              transform 0.3s cubic-bezier(0.16,1,0.3,1);
}

.ctrl:hover {
  background: rgba(221, 75, 36, 0.5);
  border-color: rgba(221, 75, 36, 0.8);
  color: #fff;
  transform: scale(1.12);
}

/* ── Dots ────────────────────────────────── */
.carousel__dots {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0.2rem 0;
}

.dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.28);
  cursor: pointer;
  padding: 0;
  transition: background 0.3s ease,
              height 0.35s cubic-bezier(0.16,1,0.3,1),
              border-radius 0.35s cubic-bezier(0.16,1,0.3,1);
}

.dot--active {
  background: #dd4b24;
  height: 14px;
  border-radius: 3px;
}

/* ── Progreso ────────────────────────────── */
.carousel__progress {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 20;
  overflow: hidden;
}

.carousel__progress-bar {
  height: 100%;
  width: 100%;
  background: #dd4b24;
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 0.1s linear;
  opacity: 0.9;
}

/* ── Índice ──────────────────────────────── */
.carousel__index {
  position: absolute;
  bottom: 0.8rem;
  left: 0.9rem;
  z-index: 20;
  display: flex;
  align-items: baseline;
  gap: 3px;
  font-family: 'Com4ble', Georgia, serif;
}

.idx-current {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.85);
}

.idx-sep {
  font-size: 0.55rem;
  color: rgba(255, 255, 255, 0.3);
}

.idx-total {
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.35);
}
</style>