<template>
  <section class="collections">
    <div class="collections__grid">
      <article
        v-for="(col, i) in items"
        :key="i"
        class="col-card"
        @mouseenter="hovered = i"
        @mouseleave="hovered = null"
        @touchstart="hovered = i"
        @touchend="hovered = null"
      >
        <div class="col-card__media">
          <img
            :src="col.thumbnail_path"
            :alt="col.name"
            class="col-card__img"
            :class="{ 'col-card__img--zoom': hovered === i }"
          />
          <div
            class="col-card__overlay"
            :class="{ 'col-card__overlay--active': hovered === i }"
          ></div>
        </div>

        <div
          class="col-card__desc"
          :class="{ 'col-card__desc--visible': hovered === i }"
        >
          <p>{{ col.description }}</p>
        </div>

        <div class="col-card__bottom">
          <h2 class="col-card__name">{{ col.name }}</h2>
          <button
            class="col-card__btn"
            :class="{ 'col-card__btn--hover': hovered === i }"
          >
            {{ buttonText }}
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue"

const props = defineProps({
  items: { type: Array, required: true },
  buttonText: { type: String, default: "Explorar" }
})

const hovered = ref(null)
</script>

<style scoped>

/* ─── Section ─────────────────────────────────── */
.collections {
  width: 100%;
  padding: 48px 24px;
  background: var(--color-principal);
  box-sizing: border-box;
}

/* ─── Grid ────────────────────────────────────── */
.collections__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  max-width: 1500px;
  margin: 0 auto;
}

/* ─── Card ────────────────────────────────────── */
.col-card {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  aspect-ratio: 2 / 3;
  cursor: pointer;
  background: #111;
}

/* ─── Media ───────────────────────────────────── */
.col-card__media {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.col-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
  transition: transform 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.col-card__img--zoom {
  transform: scale(1.08);
}

/* ─── Overlay ─────────────────────────────────── */
.col-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0,0,0,0.72) 0%,
    rgba(0,0,0,0.18) 45%,
    rgba(0,0,0,0.04) 100%
  );
  transition: background 0.5s ease;
}

.col-card__overlay--active {
  background: linear-gradient(
    to top,
    rgba(0,0,0,0.85) 0%,
    rgba(0,0,0,0.52) 50%,
    rgba(0,0,0,0.18) 100%
  );
}

/* ─── Description ─────────────────────────────── */
.col-card__desc {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 32px 120px;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity .45s ease, transform .45s ease;
}

.col-card__desc--visible {
  opacity: 1;
  transform: translateY(0);
}

.col-card__desc p {
  font-size: clamp(.82rem, 1.1vw, 1rem);
  color: rgba(255,255,255,.9);
  text-align: center;
}

/* ─── Bottom ──────────────────────────────────── */
.col-card__bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.col-card__name {
  font-size: clamp(1.4rem, 2.2vw, 2rem);
  color: #fff;
  margin: 0;
}

/* ─── Button ──────────────────────────────────── */
.col-card__btn {
  align-self: flex-start;
  font-size: .78rem;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: #fff;
  background: transparent;
  border: 1.5px solid rgba(255,255,255,.7);
  border-radius: 100px;
  padding: 9px 28px;
  cursor: pointer;
  transition: all .3s ease;
}

.col-card__btn:hover,
.col-card__btn--hover {
  background: #c94f2c;
  border-color: #c94f2c;
  transform: translateY(-2px);
}


/* ════════════════════════════════════════════════
   MOBILE  ≤ 768 px
   Cada card ocupa 100dvh — scroll-snap entre ellas
   ════════════════════════════════════════════════ */
@media (max-width: 768px) {

  /* Sección sin padding lateral — el scroll snap vive aquí */
  .collections {
    padding: 0;
    height: 100dvh;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    -webkit-overflow-scrolling: touch;
  }

  /* Una sola columna, sin gap */
  .collections__grid {
    grid-template-columns: 1fr;
    gap: 0;
  }

  /* Cada card = pantalla completa */
  .col-card {
    aspect-ratio: unset;
    height: 100dvh;
    border-radius: 0;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }

  /* Descripción siempre visible en mobile (sin hover) */
  .col-card__desc {
    opacity: 1;
    transform: translateY(0);
    padding: 40px 28px 160px;
  }

  .col-card__desc p {
    font-size: 1rem;
  }

  /* Overlay siempre en estado "activo" */
  .col-card__overlay {
    background: linear-gradient(
      to top,
      rgba(0,0,0,0.82) 0%,
      rgba(0,0,0,0.48) 50%,
      rgba(0,0,0,0.15) 100%
    );
  }

  /* Bottom con más espacio para safe-area (notch, home bar) */
  .col-card__bottom {
    padding: 0 28px calc(40px + env(safe-area-inset-bottom));
    gap: 14px;
  }

  .col-card__name {
    font-size: clamp(1.8rem, 7vw, 2.4rem);
  }

  /* Botón ancho completo en mobile */
  .col-card__btn {
    align-self: stretch;
    text-align: center;
    padding: 14px 28px;
    font-size: .85rem;
  }
}
</style>