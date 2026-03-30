<template>
  <div
    class="carousel"
    @mouseenter="pause"
    @mouseleave="resume"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <!-- Track vertical -->
    <div class="carousel__track" :style="trackStyle">
      <div
        v-for="(slide, i) in slides"
        :key="i"
        class="carousel__slide"
      >
        <!-- Ken Burns bg por slide -->
        <div
          class="slide__bg"
          :class="{ 'slide__bg--active': i === current }"
          :style="{ backgroundImage: slide.image ? `url(${slide.image})` : 'none' }"
        ></div>

        <!-- Overlay -->
        <div class="slide__overlay"></div>

        <!-- Contenido animado -->
        <div class="slide__content">


          <!-- Título — clip reveal palabra por palabra -->
          <h2 class="slide__title" :class="{ 'is-visible': i === current }">
            <span
              v-for="(word, wi) in (slide.title || phrase).split(' ')"
              :key="wi"
              class="title__mask"
              :style="{ '--wi': wi }"
            ><span class="title__word">{{ word }}</span></span>
          </h2>

          <!-- Descripción -->
          <p
            v-if="slide.description"
            class="slide__desc"
            :class="{ 'is-visible': i === current }"
          >{{ slide.description }}</p>

          <!-- CTA -->
          <a
            v-if="slide.cta"
            :href="slide.cta.href"
            class="slide__cta"
            :class="{ 'is-visible': i === current }"
          >
            <span>{{ slide.cta.label }}</span>
            <svg class="cta__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <!-- Frase decorativa vertical -->
    <div class="carousel__phrase" aria-hidden="true">
      <span
        v-for="(char, ci) in phrase.split('')"
        :key="ci"
        class="phrase__char"
        :style="{ '--ci': ci }"
      >{{ char === ' ' ? '\u00A0' : char }}</span>
    </div>

    <!-- Dots con arco de progreso -->
    <div class="carousel__dots" role="tablist">
      <button
        v-for="(s, i) in slides"
        :key="i"
        class="dot"
        :class="{ 'dot--active': i === current }"
        role="tab"
        :aria-selected="i === current"
        :aria-label="`Slide ${i + 1}`"
        @click="goTo(i)"
      >
        <svg class="dot__svg" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle class="dot__ring" cx="14" cy="14" r="11"/>
          <circle
            v-if="i === current"
            class="dot__arc"
            cx="14" cy="14" r="11"
            :style="{ strokeDashoffset: arcOffset }"
          />
        </svg>
        <span class="dot__core"></span>
      </button>
    </div>

    <!-- Controles flecha -->
    <div class="carousel__controls">
      <button class="ctrl" aria-label="Anterior" @click="prev">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 14L4 9l5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="ctrl" aria-label="Siguiente" @click="next">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 4l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Contador con flip -->
    <div class="carousel__index" aria-live="polite">
      <span class="idx-wrap">
        <span class="idx-current" :key="'cur-' + current">{{ pad(current + 1) }}</span>
      </span>
      <span class="idx-sep">/</span>
      <span class="idx-total">{{ pad(slides.length) }}</span>
    </div>

    <!-- Barra de progreso -->
    <div class="carousel__bar" aria-hidden="true">
      <div class="bar__fill" :style="barStyle"></div>
    </div>
  </div>
</template>

<script>
const INTERVAL     = 4500
const SLIDE_EASE   = 'cubic-bezier(0.77, 0, 0.18, 1)'
const ARC_R        = 11
const ARC_CIRC     = 2 * Math.PI * ARC_R   // ≈ 69.115

export default {
  name: 'VerticalCarousel',

  props: {
    slides: { type: Array,  required: true },
    delay:  { type: Number, default: 0 },
    phrase: { type: String, default: 'ARTE' },
  },

  data() {
    return {
      current:     0,
      paused:      false,
      progress:    0,     // 0 → 1
      rafId:       null,
      startTime:   null,
      touchStartY: 0,
      touchStartX: 0,
    }
  },

  computed: {
    trackStyle() {
      return {
        transform:  `translateY(-${this.current * 100}%)`,
        transition: `transform 0.95s ${SLIDE_EASE}`,
      }
    },

    // Barra: no CSS transition, driven pure rAF
    barStyle() {
      return { transform: `scaleX(${this.progress})` }
    },

    // Arco SVG: stroke-dashoffset decrece de ARC_CIRC → 0
    arcOffset() {
      return ARC_CIRC * (1 - this.progress)
    },
  },

  mounted() {
    setTimeout(() => this._rafStart(), this.delay)
  },

  beforeUnmount() {
    cancelAnimationFrame(this.rafId)
  },

  methods: {
    // ── rAF loop ───────────────────────────────────────────
    _rafStart() {
      this.startTime = null
      const tick = (now) => {
        if (!this.paused) {
          if (!this.startTime) this.startTime = now
          this.progress = Math.min((now - this.startTime) / INTERVAL, 1)
          if (this.progress >= 1) {
            this._advance()
            this.startTime = null
          }
        }
        this.rafId = requestAnimationFrame(tick)
      }
      this.rafId = requestAnimationFrame(tick)
    },

    _advance() {
      this.current = (this.current + 1) % this.slides.length
    },

    _reset() {
      this.startTime = null
      this.progress  = 0
    },

    // ── Navegación ─────────────────────────────────────────
    next() {
      this._advance()
      this._reset()
    },

    prev() {
      this.current = (this.current - 1 + this.slides.length) % this.slides.length
      this._reset()
    },

    goTo(i) {
      if (i === this.current) return
      this.current = i
      this._reset()
    },

    // ── Pausa ──────────────────────────────────────────────
    pause() {
      this.paused = true
    },

    resume() {
      if (!this.paused) return
      this.paused = false
      // Recupera el punto donde se pausó
      this.startTime = performance.now() - this.progress * INTERVAL
    },

    // ── Touch ──────────────────────────────────────────────
    onTouchStart(e) {
      this.touchStartY = e.touches[0].clientY
      this.touchStartX = e.touches[0].clientX
    },

    onTouchEnd(e) {
      const dy = this.touchStartY - e.changedTouches[0].clientY
      const dx = this.touchStartX - e.changedTouches[0].clientX
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 40) {
        dy > 0 ? this.next() : this.prev()
      }
    },

    pad(n) { return String(n).padStart(2, '0') },
  },
}
</script>

<style scoped>
/* ── Tokens ──────────────────────────────────────── */
.carousel {
  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
  --clr-text:    #f2f2f2;
  --clr-muted:   rgba(242, 242, 242, 0.44);
  --clr-accent:  #ffffff;
  --arc-circ:    69.115;   /* 2π × 11 — coincide con ARC_CIRC en JS */
}

/* ── Shell ───────────────────────────────────────── */
.carousel {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 480px;
  overflow: hidden;
  background: #080808;
  -webkit-font-smoothing: antialiased;
}

/* ── Track ───────────────────────────────────────── */
.carousel__track {
  display: flex;
  flex-direction: column;
  height: 100%;
  will-change: transform;
}

/* ── Slide ───────────────────────────────────────── */
.carousel__slide {
  position: relative;
  flex: 0 0 100vh;
  width: 100%;
  display: flex;
  align-items: flex-end;
  padding: clamp(40px, 8vw, 96px) clamp(24px, 7vw, 80px);
  overflow: hidden;
}

/* ── Ken Burns ───────────────────────────────────── */
.slide__bg {
  position: absolute;
  inset: -8%;
  background-size: cover;
  background-position: center;
  will-change: transform;
  transform: scale(1.08);
  transition: none;
}

.slide__bg--active {
  animation: kenBurns 7.5s cubic-bezier(0.0, 0.0, 0.2, 1) forwards;
}

@keyframes kenBurns {
  0%   { transform: scale(1.08) translate(0%, 0%); }
  100% { transform: scale(1.0)  translate(0.5%, -0.5%); }
}

/* ── Overlay ─────────────────────────────────────── */
.slide__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to top,  rgba(0,0,0,0.78) 0%,  rgba(0,0,0,0.0)  55%),
    linear-gradient(to right, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.0)  60%);
  pointer-events: none;
}

/* ── Contenido ───────────────────────────────────── */
.slide__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 620px;
}

/* -- Eyebrow -- */
.slide__eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0;
  transform: translateX(-14px);
  transition:
    opacity   0.55s var(--ease-out) 0.05s,
    transform 0.55s var(--ease-out) 0.05s;
}
.slide__eyebrow.is-visible {
  opacity: 1;
  transform: translateX(0);
}

.eyebrow__line {
  display: block;
  width: 28px;
  height: 1px;
  background: var(--clr-accent);
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 0.5s var(--ease-out) 0.15s;
}
.slide__eyebrow.is-visible .eyebrow__line {
  transform: scaleX(1);
}

.eyebrow__label {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--clr-muted);
  font-family: 'Principal', 'Helvetica Neue', sans-serif;
}

/* -- Título: clip-reveal por palabra -- */
.slide__title {
  display: flex;
  flex-wrap: wrap;
  gap: 0 0.28em;
  font-size: clamp(34px, 4.3vw, 74px);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: var(--clr-text);
}

/* Cada palabra está envuelta en un mask que oculta el overflow */
.title__mask {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
}

.title__word {
  display: inline-block;
  transform: translateY(105%) skewY(5deg);
  opacity: 0;
  transition:
    transform 0.7s var(--ease-out) calc(0.22s + var(--wi) * 0.09s),
    opacity   0.4s var(--ease-out) calc(0.22s + var(--wi) * 0.09s);
}

.slide__title.is-visible .title__word {
  transform: translateY(0) skewY(0deg);
  opacity: 1;
}

/* -- Descripción -- */
.slide__desc {
  font-size: clamp(13px, 1.7vw, 15px);
  line-height: 1.65;
  color: var(--clr-muted);
  max-width: 420px;
  font-family: 'Principal', 'Helvetica Neue', sans-serif;
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity   0.6s var(--ease-out) 0.48s,
    transform 0.6s var(--ease-out) 0.48s;
}
.slide__desc.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* -- CTA -- */
.slide__cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  align-self: flex-start;
  padding: 11px 22px;
  border: 1px solid rgba(255,255,255,0.22);
  border-radius: 999px;
  color: var(--clr-text);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-decoration: none;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  font-family: 'Principal', 'Helvetica Neue', sans-serif;
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity      0.55s var(--ease-out) 0.60s,
    transform    0.55s var(--ease-out) 0.60s,
    background   0.2s ease,
    border-color 0.2s ease,
    box-shadow   0.2s ease;
}
.slide__cta.is-visible {
  opacity: 1;
  transform: translateY(0);
}
.slide__cta:hover {
  background: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.5);
  box-shadow: 0 0 20px rgba(255,255,255,0.07);
}
.cta__arrow {
  transition: transform 0.2s ease;
}
.slide__cta:hover .cta__arrow {
  transform: translateX(4px);
}

/* ── Frase decorativa ────────────────────────────── */
.carousel__phrase {
  position: absolute;
  top: 50%;
  right: clamp(10px, 2.5vw, 28px);
  transform: translateY(-50%) rotate(90deg);
  transform-origin: center;
  display: flex;
  gap: 1px;
  pointer-events: none;
  z-index: 5;
}

.phrase__char {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.35em;
  color: rgba(255,255,255,0.16);
  opacity: 0;
  animation: charFadeUp 0.45s var(--ease-out) calc(var(--ci) * 0.05s + 0.2s) forwards;
}

@keyframes charFadeUp {
  from { opacity: 0; transform: translateY(5px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Dots ────────────────────────────────────────── */
.carousel__dots {
  position: absolute;
  bottom: clamp(28px, 5vw, 52px);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 14px;
  z-index: 10;
}

.dot {
  position: relative;
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  /* El -90deg lo aplicamos con transform en los circles */
  transform: rotate(-90deg);
}

.dot__ring {
  stroke: rgba(255,255,255,0.18);
  stroke-width: 1.2;
}

.dot__arc {
  stroke: var(--clr-accent);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-dasharray: 69.115;   /* ARC_CIRC = 2π × 11 */
  /* stroke-dashoffset viene vía :style binding desde arcOffset */
  transition: stroke-dashoffset 0.08s linear;
}

.dot__core {
  position: relative;
  z-index: 1;
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255,255,255,0.32);
  transition:
    background 0.3s ease,
    transform  0.35s var(--ease-out);
}

.dot--active .dot__core {
  background: var(--clr-accent);
  transform: scale(1.35);
}

/* ── Controles flecha ────────────────────────────── */
.carousel__controls {
  position: absolute;
  top: 50%;
  right: clamp(14px, 3.5vw, 36px);
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10;
}

.ctrl {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  color: var(--clr-text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background   0.2s ease,
    border-color 0.2s ease,
    transform    0.25s var(--ease-out);
}

.ctrl:hover {
  background: rgba(255,255,255,0.13);
  border-color: rgba(255,255,255,0.45);
  transform: scale(1.1);
}
.ctrl:active {
  transform: scale(0.93);
}

/* ── Contador flip ───────────────────────────────── */
.carousel__index {
  position: absolute;
  bottom: clamp(16px, 3vw, 24px);
  left: clamp(18px, 4vw, 32px);
  z-index: 10;
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-family: 'Principal', 'Helvetica Neue', sans-serif;
}

.idx-wrap {
  display: inline-block;
  overflow: hidden;
  height: 1.2em;
}

.idx-current {
  display: inline-block;
  font-size: 1rem;
  color: var(--clr-text);
  animation: flipDown 0.45s var(--ease-out) both;
}

@keyframes flipDown {
  from {
    transform: translateY(-110%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.idx-sep {
  font-size: 0.5rem;
  color: rgba(255,255,255,0.28);
}

.idx-total {
  font-size: 0.58rem;
  color: rgba(255,255,255,0.32);
}

/* ── Barra progreso ──────────────────────────────── */
.carousel__bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255,255,255,0.08);
  z-index: 10;
  overflow: hidden;
}

.bar__fill {
  height: 100%;
  width: 100%;
  background: var(--clr-accent);
  transform-origin: left center;
  transform: scaleX(0);
  will-change: transform;
  /* Sin CSS transition: actualizado 60fps por rAF */
}

/* ── Responsive ──────────────────────────────────── */
@media (max-width: 600px) {
  .carousel__controls,
  .carousel__phrase {
    display: none;
  }
  .slide__content {
    gap: 14px;
  }
}
</style>
