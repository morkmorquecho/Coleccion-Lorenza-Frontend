<script setup>
// No props needed — standalone badge
</script>

<template>
  <a
    href="https://www.etsy.com/mx/shop/ColeccionLorenza"
    target="_blank"
    rel="noopener noreferrer"
    class="etsy-badge"
    aria-label="5 años de reputación en Etsy – ver reseñas"
  >
    <!-- Trofeo SVG -->
    <span class="trophy-wrap">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="trophy-icon"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M6 9H4a2 2 0 0 1-2-2V5h4" />
        <path d="M18 9h2a2 2 0 0 0 2-2V5h-4" />
        <path d="M12 17v4" />
        <path d="M8 21h8" />
        <path d="M6 3h12v8a6 6 0 0 1-12 0V3z" />
      </svg>
    </span>

    <!-- Tooltip -->
    <span class="etsy-tooltip" role="tooltip">
        <span class="tooltip-eyebrow font-prices">+5 años en Etsy</span>
        <span class="tooltip-text">Mira nuestra reputación y reseñas</span>
    </span>
  </a>
</template>

<style scoped>
/* ── Wrapper ───────────────────────────────────────────── */
.etsy-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
  isolation: isolate;
}

/* ── Trofeo ────────────────────────────────────────────── */
.trophy-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.trophy-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-primary, #dd4b24);
  transform-origin: center bottom;
  animation: trophySwing 3s ease-in-out infinite;
  transition: color 0.3s ease, filter 0.3s ease;
}

@keyframes trophySwing {
  0%   { transform: rotate(0deg)   scale(1);    filter: brightness(1);   }
  15%  { transform: rotate(8deg)   scale(1.08); filter: brightness(1.25);}
  30%  { transform: rotate(-6deg)  scale(1.05); filter: brightness(1.15);}
  45%  { transform: rotate(4deg)   scale(1.03); filter: brightness(1.1); }
  60%  { transform: rotate(0deg)   scale(1);    filter: brightness(1);   }
  100% { transform: rotate(0deg)   scale(1);    filter: brightness(1);   }
}

/* Hover: pausa la animación, brilla */
.etsy-badge:hover .trophy-icon {
  animation: none;
  transform: scale(1.18) rotate(0deg);
  filter: brightness(1.4);
  color: var(--color-primary, --color-hover);
}

/* ── Tooltip ───────────────────────────────────────────── */
.etsy-tooltip {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(6px);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;

  background: rgba(255, 255, 255, 0.97);
  border: 1px solid rgba(221, 75, 36, 0.15);
  border-radius: 10px;
  padding: 9px 14px;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.1),
    0 2px 6px rgba(221, 75, 36, 0.08);

  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition:
    opacity 0.25s ease,
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 100;
}

/* Flecha */
.etsy-tooltip::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-bottom-color: rgba(221, 75, 36, 0.15);
}
.etsy-tooltip::after {
  content: '';
  position: absolute;
  bottom: calc(100% - 1px);
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-bottom-color: rgba(255, 255, 255, 0.97);
}

.etsy-badge:hover .etsy-tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* Textos */
.tooltip-eyebrow {
  font-size: 0.6975rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-primary, #dd4b24);
  line-height: 1;
}

.tooltip-text {
  font-size: 0.75rem;
  font-weight: 400;
  color: #3a3a3a;
  letter-spacing: 0.02em;
  line-height: 1.3;
}
</style>