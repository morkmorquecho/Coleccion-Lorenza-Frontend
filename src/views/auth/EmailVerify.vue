<template>
  <div class="form-page">
    <ModalComponent
      v-model="showModal"
      :title="modalTitle"
      :subtitle="modalMessage"
    >
      <template #lottie>
        <LottiePlayer :path="animationPath" />
      </template>
    </ModalComponent>

    <!-- Blobs decorativos -->
    <div class="form-blob form-blob--bottom-right"></div>
    <div class="form-blob form-blob--top-left"></div>

    <!-- Tarjeta glassmorphism -->
    <div class="form-card">
      <div class="form-card__glow"></div>

      <!-- Estado: Cargando -->
      <div v-if="loading" class="verify-state">
        <div class="verify-animation">
          <LottiePlayer path="/animations/mariachi.json" />
        </div>
        
        <div class="verify-content">
          <h2 class="verify-title">Verificando tu cuenta...</h2>
          <p class="verify-description">Un momento por favor 🙏</p>
        </div>
      </div>

      <!-- Estado: Éxito -->
      <div v-else-if="status === 'success'" class="verify-state">
        <div class="verify-animation">
          <LottiePlayer path="/animations/mariachi.json" />
        </div>
        
        <div class="verify-content">
          <h2 class="verify-title success-title">¡Verificación exitosa! </h2>
          <p class="verify-description success-description">
            Tu correo electrónico ha sido verificado correctamente.
          </p>
          
          <button class="form-btn-primary" @click="goToLogin">
            Continuar
          </button>
        </div>
      </div>

      <!-- Estado: Error -->
      <div v-else-if="status === 'error'" class="verify-state">
        <div class="verify-animation">
          <LottiePlayer path="/animations/mariachi.json" />
        </div>
        
        <div class="verify-content">
          <h2 class="verify-title error-title">Ups... algo salió mal</h2>
          <p class="verify-description error-description">
            {{ errorMessage }}
          </p>

          <button class="form-btn-primary" @click="retry">
            Reintentar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFormHandler } from '@/composables/useFormHandler'
import authService from '@/services/authService'
import LottiePlayer from '@/components/ui/LottiePlayer.vue'
import ModalComponent from '@/components/ui/ModalComponent.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

// Estado local
const status = ref('loading')
const errorMessage = ref('')
const token = ref(null)

// ── Modal configuration ─────────────────────────────────────────────────────────
const showModal = ref(false)
const modalMessage = ref('')
const modalTitle = ref('')
const animationPath = ref('')

const ANIMATIONS = {
  success: '/animations/burro.json',
  error: '/animations/quetzal.json',
}

// Callback para mostrar errores en el modal
function showError(msg) {
  modalMessage.value = msg
  modalTitle.value = 'Error de verificación'
  animationPath.value = ANIMATIONS.error
  showModal.value = true
}

// ── Form handler ──────────────────────────────────────────────────────────────
const { loading, handleSubmit } = useFormHandler({ showError })

// Función principal de verificación
async function onVerify() {
  if (!token.value) {
    status.value = 'error'
    errorMessage.value = 'Token inválido o faltante.'
    return
  }

  await handleSubmit(async () => {
    const data = await authService.verifyEmail(token.value)
    authStore.setUser(data.user)

    status.value = 'success'
  })
}

// Si hay error, capturar mensaje para mostrar en la UI
// Nota: El composable maneja el error en el modal, pero necesitamos
// el mensaje local para mostrarlo en la vista de error
const verify = async () => {
  status.value = 'loading'
  errorMessage.value = ''
  
  try {
    await onVerify()
  } catch (error) {
    status.value = 'error'
    // Extraer mensaje de error para mostrar en la UI
    if (typeof error.context === 'string') {
      errorMessage.value = error.context
    } else if (error.context?.detail) {
      errorMessage.value = error.context.detail
    } else if (error.response?.data?.detail) {
      errorMessage.value = error.response.data.detail
    } else {
      errorMessage.value = 'No se pudo verificar tu cuenta. Intenta nuevamente.'
    }
    
    // Si el error es por token expirado/inválido, mostrar modal adicional
    if (errorMessage.value.includes('expirado') || errorMessage.value.includes('inválido')) {
      showError(errorMessage.value)
    }
  }
}

const retry = () => {
  verify()
}

const goToLogin = () => {
  router.push({ name: 'Login' })
}

onMounted(() => {
  token.value = route.query.token
  verify()
})
</script>

<style scoped>
/* Estados generales */
.verify-state {
  animation: fadeIn 0.5s ease;
}

.verify-animation {
  width: 280px;
  height: 280px;
  margin: 0 auto 1rem;
}

.verify-content {
  text-align: center;
}

.verify-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  color: #1f2937;
}

.verify-description {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 2rem;
}

/* Estado de éxito */
.success-title {
  color: #dd4b24;
}

.success-description {
  color: #4b5563;
}

/* Estado de error */
.error-title {
  color: #dc2626;
}

.error-description {
  color: #9f2f16;
}

/* Botón */
.form-btn-primary {
  width: 100%;
  padding: 0.9rem 1.5rem;
  background: linear-gradient(135deg, #dd4b24, #c43e1d);
  border: none;
  border-radius: 0.75rem;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.form-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(221, 75, 36, 0.3);
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>