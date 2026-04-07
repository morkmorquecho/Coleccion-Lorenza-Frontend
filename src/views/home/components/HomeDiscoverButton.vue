<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue"

// ─── State ────────────────────────────────────────────────────────────────────
const hovered    = ref(false)
const isVisible  = ref(false)
const canHover   = ref(true)          // false en dispositivos touch
const buttonRef  = ref(null)
let   observer   = null

const words        = ["Conoce", "la", "Creatividad", "Mexicana"]
const wordDelays    = [0, 0.06, 0.12, 0.18, 0.24]
const wordDelaysOut = [0.2, 0.15, 0.1, 0.05, 0]

// En touch: las palabras animadas no se activan, sólo "Explorar" al hacer scroll
const wordActive    = computed(() => canHover.value && hovered.value)
// La flecha/Explorar se muestra con hover (desktop) o al entrar en viewport (mobile)
const explorarShow  = computed(() => canHover.value ? hovered.value : isVisible.value)

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
  // Detecta si el dispositivo acepta hover real (pointer fino = desktop/laptop)
  canHover.value = window.matchMedia("(hover: hover) and (pointer: fine)").matches

  if (!canHover.value && buttonRef.value) {
    observer = new IntersectionObserver(
      ([entry]) => { isVisible.value = entry.isIntersecting },
      { threshold: 0.6 }
    )
    observer.observe(buttonRef.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <button
    ref="buttonRef"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    class="group relative flex flex-col items-center gap-0 cursor-pointer select-none w-full max-w-max mx-auto px-2"
    style="background: none; border: none; padding: 0 0.5rem"
  >
    <!-- Glow ambiental (solo desktop hover) -->
    <div
      class="absolute pointer-events-none rounded-full blur-3xl"
      :style="{
        width: '120%', height: '200%', top: '-50%', left: '-10%',
        background: 'radial-gradient(ellipse, var(--color-primary, #e05c2a) 0%, transparent 70%)',
        opacity: wordActive ? 0.08 : 0,
        transition: 'opacity 0.8s ease'
      }"
    />

    <!-- Palabras -->
    <div
      class="relative flex flex-wrap justify-center items-center gap-x-[0.35em] gap-y-0"
      style="padding: 0.6em 0"
    >
      <div
        v-for="(word, i) in words"
        :key="i"
        class="relative"
        style="overflow: visible; padding: 0.15em 0"
      >
        <!-- Texto base -->
        <span
          class="block text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.15em] uppercase text-foreground"
          :style="{
            fontFamily:'Cormorant Garamond',
            color: 'var(--color-primary, #e05c2a)',
            lineHeight: 1.2,
            transform: wordActive ? 'translateY(-115%)' : 'translateY(0%)',
            opacity:   wordActive ? 0 : 1,
            transition: `transform 0.6s cubic-bezier(0.76,0,0.24,1) ${wordActive ? wordDelays[i] : wordDelaysOut[i]}s,
                         opacity 0.35s ease ${wordActive ? wordDelays[i] : wordDelaysOut[i]}s`
          }"
        >{{ word }}</span>

        <!-- Texto hover coloreado (solo desktop) -->
        <span
          v-if="canHover"
          class="absolute inset-0 flex items-center justify-center text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.15em] uppercase"
          :style="{
            fontFamily:'Cormorant Garamond',
            lineHeight: 1.2,
            color: 'var(--color-primary, #e05c2a)',
            transform: wordActive ? 'translateY(0%)' : 'translateY(115%)',
            opacity:   wordActive ? 1 : 0,
            transition: `transform 0.6s cubic-bezier(0.76,0,0.24,1) ${wordActive ? wordDelays[i] : wordDelaysOut[i]}s,
                         opacity 0.35s ease ${wordActive ? wordDelays[i] : wordDelaysOut[i]}s`
          }"
        >{{ word }}</span>
      </div>
    </div>



    <!-- Explorar con flecha -->
    <div
      class="flex items-center gap-3 mt-3"
      :style="{
        opacity:   explorarShow ? 1 : 0,
        transform: explorarShow ? 'translateY(0px)' : 'translateY(6px)',
        transition: 'opacity 0.4s ease 0.2s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.2s'
      }"
    >
      <div
        class="h-px"
        :style="{
          background: 'var(--color-primary, #e05c2a)',
          width:   explorarShow ? '1.5rem' : '0px',
          opacity: explorarShow ? 0.6 : 0,
          transition: 'width 0.45s cubic-bezier(0.76,0,0.24,1) 0.3s, opacity 0.3s ease 0.3s'
        }"
      />
      <span
        class="text-[9px] tracking-[0.4em] uppercase font-medium"
        :style="{ color: 'var(--color-primary, #e05c2a)' }"
      >Explorar</span>
      <svg width="22" height="10" viewBox="0 0 22 10" fill="none" style="overflow: visible">
        <line x1="0" y1="5" x2="16" y2="5"
          :stroke="'var(--color-primary, #e05c2a)'" stroke-width="1.2" stroke-linecap="round"
          :style="{
            strokeDasharray: 16,
            strokeDashoffset: explorarShow ? 0 : 16,
            transition: `stroke-dashoffset 0.45s cubic-bezier(0.76,0,0.24,1) ${explorarShow ? '0.38s' : '0s'}`
          }" />
        <line x1="12" y1="1" x2="20" y2="5"
          :stroke="'var(--color-primary, #e05c2a)'" stroke-width="1.2" stroke-linecap="round"
          :style="{
            strokeDasharray: 9,
            strokeDashoffset: explorarShow ? 0 : 9,
            transition: `stroke-dashoffset 0.3s cubic-bezier(0.76,0,0.24,1) ${explorarShow ? '0.55s' : '0s'}`
          }" />
        <line x1="12" y1="9" x2="20" y2="5"
          :stroke="'var(--color-primary, #e05c2a)'" stroke-width="1.2" stroke-linecap="round"
          :style="{
            strokeDasharray: 9,
            strokeDashoffset: explorarShow ? 0 : 9,
            transition: `stroke-dashoffset 0.3s cubic-bezier(0.76,0,0.24,1) ${explorarShow ? '0.6s' : '0s'}`
          }" />
      </svg>
    </div>

    <!-- Puntos decorativos (solo desktop) -->
    <div
      v-if="canHover"
      v-for="(pos, i) in [{ top: '-6px', left: '-8px' }, { top: '-6px', right: '-8px' }]"
      :key="'dot-' + i"
      class="absolute w-1 h-1 rounded-full pointer-events-none"
      :style="{
        ...pos,
        background: 'var(--color-primary, #e05c2a)',
        opacity:   hovered ? 0.5 : 0,
        transform: hovered ? 'scale(1)' : 'scale(0)',
        transition: `opacity 0.3s ease ${0.1 + i * 0.05}s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${0.1 + i * 0.05}s`
      }"
    />
  </button>
</template>