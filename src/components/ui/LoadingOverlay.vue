<!-- components/ui/LoadingOverlay.vue -->
<template>
  <div class="loading-overlay">
    <Transition name="fade-transition" mode="out-in">
      <!-- Loading State -->
      <div 
        v-if="isLoading" 
        key="loading" 
        class="loading-container"
      >
        <div class="loading-animation">
          <LottiePlayer 
            path="/animations/burro.json"
            :autoplay="true"
            :loop="true"
            :speed="speed"
          />
        </div>

        <!-- FIX ②⑤: visible desde el inicio, dentro del mismo contenedor que el lottie -->
        <div v-if="showMessage" class="loading-message">
          <p>Cargando...</p>
        </div>
      </div>

      <!-- Content State -->
      <div v-else key="content" class="loading-content">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import LottiePlayer from './LottiePlayer.vue'

const props = defineProps({
  // Tiempo mínimo en milisegundos que debe durar la animación
  minDisplayTime: {
    type: Number,
    default: 2000
  },
  // Velocidad de la animación
  speed: {
    type: Number,
    default: 1
  },
  // Mostrar mensaje
  showMessage: {
    type: Boolean,
    default: true
  },
  // Estado de carga (control externo)
  loading: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['loading-complete'])

// Estados internos
const isLoading = ref(true)
const minTimeReached = ref(false)
let startTime = null
let minTimeTimeout = null
let actualLoadingComplete = false

// FIX ④⑤: sin setTimeout extra, isLoading se apaga directamente
const finishLoading = () => {
  if (minTimeTimeout) clearTimeout(minTimeTimeout)
  isLoading.value = false
  emit('loading-complete')
}

// Observar cambios en la prop loading
watch(() => props.loading, (newLoading) => {
  if (!newLoading && !actualLoadingComplete) {
    actualLoadingComplete = true
    if (minTimeReached.value) {
      finishLoading()
    }
  }
})

// Iniciar el componente
onMounted(() => {
  startTime = Date.now()
  actualLoadingComplete = false
  isLoading.value = true
  minTimeReached.value = false

  minTimeTimeout = setTimeout(() => {
    minTimeReached.value = true
    if (actualLoadingComplete) {
      finishLoading()
    }
  }, props.minDisplayTime)
})

// Limpiar al desmontar
onBeforeUnmount(() => {
  if (minTimeTimeout) clearTimeout(minTimeTimeout)
})
</script>

<style scoped>
.loading-overlay {
  width: 100%;
  min-height: 500px;
  position: relative;
}

/* FIX ④: transición más rápida y suave */
.fade-transition-enter-active,
.fade-transition-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.fade-transition-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-transition-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Loading Container */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  width: 100%;
}

/* FIX ③: Lottie más grande */
.loading-animation {
  width: 300px;
  height: 300px;
}

/* FIX ②: mensaje visible desde el inicio y más llamativo */
.loading-message {
  margin-top: 16px;
  text-align: center;
}

.loading-message p {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.25rem;
  color: #c4501a;
  letter-spacing: 0.12em;
  font-weight: 600;
  text-transform: uppercase;
  animation: pulse 1.4s ease-in-out infinite;
}

.loading-content {
  width: 100%;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}

@keyframes contentFadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  /* FIX ③ mobile */
  .loading-animation {
    width: 200px;
    height: 200px;
  }

  .loading-message p {
    font-size: 1rem;
  }
}
</style>