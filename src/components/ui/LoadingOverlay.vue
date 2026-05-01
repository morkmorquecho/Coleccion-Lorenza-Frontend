<template>
  <div class="loading-overlay">
    <Transition name="fade-transition" mode="out-in">
      <!-- Loading State -->
      <div 
        v-if="isLoading" 
        key="loading" 
        class="loading-container"
        :class="{ 'min-time-reached': minTimeReached }"
      >
        <div class="loading-animation">
          <LottiePlayer 
            :path="animationPath"
            :autoplay="true"
            :loop="true"
            :speed="speed"
          />
        </div>
        <div v-if="showMessage && elapsedTime > 3000" class="loading-message">
          <p>Cargando piezas únicas...</p>
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
import LottiePlayer from '@/components/ui/LottiePlayer.vue'

const props = defineProps({
  // Tiempo mínimo en milisegundos que debe durar la animación
  minDisplayTime: {
    type: Number,
    default: 3000 // 3 segundos
  },
  // Ruta del archivo Lottie
  animationPath: {
    type: String,
    required: true
  },
  // Velocidad de la animación
  speed: {
    type: Number,
    default: 1
  },
  // Mostrar mensaje después de cierto tiempo
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
const elapsedTime = ref(0)
let startTime = null
let animationFrame = null
let minTimeTimeout = null
let loadingCompleteResolver = null

// Controlador para saber si ya se resolvió la carga real
let actualLoadingComplete = false

// Función para actualizar el tiempo transcurrido
const updateElapsedTime = () => {
  if (!startTime) return
  elapsedTime.value = Date.now() - startTime
  animationFrame = requestAnimationFrame(updateElapsedTime)
}

// Función para finalizar la carga
const finishLoading = () => {
  // Limpiar timeouts y animation frames
  if (minTimeTimeout) {
    clearTimeout(minTimeTimeout)
  }
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  
  // Pequeño delay adicional para transición suave
  setTimeout(() => {
    isLoading.value = false
    emit('loading-complete')
  }, 50)
}

// Observar cambios en la prop loading
watch(() => props.loading, (newLoading) => {
  if (!newLoading && !actualLoadingComplete) {
    actualLoadingComplete = true
    
    // Si ya pasó el tiempo mínimo, terminar inmediatamente
    if (minTimeReached.value) {
      finishLoading()
    }
    // Si no, esperar a que se cumpla el tiempo mínimo
  }
})

// Iniciar el componente
onMounted(() => {
  startTime = Date.now()
  actualLoadingComplete = false
  isLoading.value = true
  minTimeReached.value = false
  
  // Iniciar contador de tiempo
  updateElapsedTime()
  
  // Configurar timeout para tiempo mínimo
  minTimeTimeout = setTimeout(() => {
    minTimeReached.value = true
    
    // Si la carga real ya terminó, proceder a finalizar
    if (actualLoadingComplete) {
      finishLoading()
    }
  }, props.minDisplayTime)
})

// Limpiar al desmontar
onBeforeUnmount(() => {
  if (minTimeTimeout) {
    clearTimeout(minTimeTimeout)
  }
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<style scoped>
.loading-overlay {
  width: 100%;
  min-height: 500px;
  position: relative;
}

/* Fade Transition */
.fade-transition-enter-active,
.fade-transition-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-transition-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.fade-transition-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

/* Loading Container */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  width: 100%;
  transition: all 0.3s ease;
}

.loading-container.min-time-reached {
  animation: subtlePulse 1s ease-in-out infinite;
}

.loading-animation {
  width: 200px;
  height: 200px;
  transition: all 0.3s ease;
}

/* Mensaje que aparece después de 3 segundos */
.loading-message {
  margin-top: 24px;
  text-align: center;
  animation: fadeInUp 0.5s ease;
}

.loading-message p {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1rem;
  color: #c4501a;
  letter-spacing: 0.05em;
  font-weight: 500;
}

/* Content State */
.loading-content {
  width: 100%;
  animation: contentFadeIn 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animaciones */
@keyframes subtlePulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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

/* Responsive */
@media (max-width: 768px) {
  .loading-animation {
    width: 150px;
    height: 150px;
  }
  
  .loading-message p {
    font-size: 0.875rem;
  }
}
</style>