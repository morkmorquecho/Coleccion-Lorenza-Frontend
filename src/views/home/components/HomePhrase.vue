<template>
  <section class="phrase-section">

    <!-- Circles decorativas -->
    <div class="circles">
      <div class="circle circle--outer"></div>
      <div class="circle circle--inner"></div>
    </div>

    <!-- Comillas decorativas -->
    <div class="quote-marks" aria-hidden="true">
      <svg width="52" height="60" viewBox="0 0 52 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 4 C6 10 4 18 4 28 L4 56 L22 56 L22 28 L12 28 C12 18 16 10 22 4 Z" fill="#e8b4a0"/>
        <path d="M36 4 C32 10 30 18 30 28 L30 56 L48 56 L48 28 L38 28 C38 18 42 10 48 4 Z" fill="#e8b4a0"/>
      </svg>
    </div>

    <!-- Contenido -->
    <blockquote class="phrase-body">
      <p class="phrase-text">{{ quote }}</p>
      <footer class="phrase-footer">
        <span class="phrase-divider" aria-hidden="true"></span>
        <cite class="phrase-author">{{ author }}</cite>
      </footer>
    </blockquote>

  </section>
</template>

<script>
export default {
  name: 'PhraseComponent',
  props: {
    quote: {
      type: String,
      default: 'El arte popular es la raíz más profunda de la identidad cultural de un pueblo'
    },
    author: {
      type: String,
      default: 'DIEGO RIVERA'
    }
  }
}
</script>

<style scoped>

/* ── Sección contenedora ── */
.phrase-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 680px;
  overflow: hidden;
  font-family: Georgia, serif;
}

/* ── Círculos decorativos de fondo ── */
.circles {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(200, 150, 120, 0.18);
}

.circle--outer {
  width: min(72vw, 640px);
  height: min(72vw, 640px);
}

.circle--inner {
  width: min(52vw, 460px);
  height: min(52vw, 460px);
}

/* ── Comillas decorativas ── */
.quote-marks {
  position: relative;
  z-index: 1;
  margin-bottom: 32px;
  opacity: 0.9;
}

.quote-marks svg {
  display: block;
}

/* ── Blockquote ── */
.phrase-body {
  position: relative;
  z-index: 1;
  margin: 0;
  padding: 0;
  text-align: center;
  max-width: 900px;
}

/* ── Texto de la frase ── */
.phrase-text {
  margin: 0 0 48px 0;
  font-family: Georgia, serif;
  font-size: clamp(1.6rem, 4vw, 3rem);
  line-height: 1.55;
  color: #c94f2c;
  font-weight: normal;
  font-style: italic;
  letter-spacing: 0.01em;
}

/* ── Footer: línea + autor ── */
.phrase-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.phrase-divider {
  display: block;
  width: 48px;
  height: 1.5px;
  background-color: #c94f2c;
  opacity: 0.7;
}

.phrase-author {
  font-family: Georgia, serif;
  font-style: normal;
  font-size: clamp(0.65rem, 1.2vw, 0.8rem);
  letter-spacing: 0.28em;
  color: #c94f2c;
  text-transform: uppercase;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .phrase-section {
    padding: 60px 24px;
    min-height: 360px;
  }

  .circle--outer {
    width: 90vw;
    height: 90vw;
  }

  .circle--inner {
    width: 68vw;
    height: 68vw;
  }

  .quote-marks svg {
    width: 38px;
    height: 44px;
  }

  .phrase-text {
    margin-bottom: 36px;
  }
}

@media (max-width: 480px) {
  .phrase-section {
    padding: 48px 20px;
  }

  .phrase-text {
    font-size: clamp(1.35rem, 5vw, 1.8rem);
    line-height: 1.6;
  }
}
</style>
