<template>
  <div class="form-page">
    <!-- Blobs decorativos -->
    <div class="form-blob form-blob--bottom-right"></div>
    <div class="form-blob form-blob--top-left"></div>

    <!-- Tarjeta glassmorphism -->
    <div class="form-card">
      <div class="form-card__glow"></div>

      <!-- Cabecera -->
      <div class="form-text-primary text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 leading-tight">
          Verifica tu <span class="text-[#dd4b24]">correo</span>
        </h1>
        <p class="mt-3 text-gray-600">
          Te enviamos un enlace de verificación
        </p>
      </div>

      <!-- Animación -->
      <div class="verify-animation">
        <LottiePlayer path="/animations/burro.json" />
      </div>

      <!-- Instrucciones -->
      <div class="verify-instructions">
        <div class="instruction-item">
          <div class="instruction-icon">1</div>
          <div class="instruction-text">
            <strong>Revisa tu bandeja de entrada</strong>
            <span>Hemos enviado un correo a <strong>{{ email }}</strong></span>
          </div>
        </div>
        
        <div class="instruction-item">
          <div class="instruction-icon">2</div>
          <div class="instruction-text">
            <strong>Haz clic en el enlace</strong>
            <span>Activarás tu cuenta en solo un segundo</span>
          </div>
        </div>
        
        <div class="instruction-item">
          <div class="instruction-icon">3</div>
          <div class="instruction-text">
            <strong>¡Listo!</strong>
            <span>Disfrutaras de la experiencia completa</span>
          </div>
        </div>
      </div>

      <!-- Sección de reenvío -->
      <div class="verify-resend-section">
        <button 
          class="form-btn-secondary w-full" 
          :disabled="loading"
          @click="onResendEmail"
        >
          <span v-if="loading" class="btn-spinner"></span>
          <span>{{ loading ? 'Reenviando...' : 'Reenviar correo de verificación' }}</span>
        </button>

        <!-- Feedback messages -->
        <transition name="fade">
          <div v-if="feedbackMessage" :class="['verify-feedback', `verify-feedback--${feedbackType}`]">
            <svg v-if="feedbackType === 'success'" class="feedback-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="feedback-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            {{ feedbackMessage }}
          </div>
        </transition>

        <div class="verify-tips">
          <p class="tips-title">💡 ¿No encuentras el correo?</p>
          <ul class="tips-list">
            <li>Revisa tu carpeta de <strong>Spam</strong> o <strong>Correo no deseado</strong></li>
            <li>Agrega <strong>noreply@tudominio.com</strong> a tus contactos</li>
            <li>Espera unos minutos, a veces tarda en llegar</li>
          </ul>
        </div>
      </div>

      <!-- Enlace para volver al login -->
      <div class="verify-footer">
        <RouterLink
          :to="{ name: 'Login' }"
          class="text-sm text-gray-500 hover:text-[#dd4b24] transition-colors"
        >
          ← Volver al inicio de sesión
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useFormHandler } from '@/composables/useFormHandler'
import { useUIStore } from '@/stores/ui'
import authService from '@/services/authService'
import LottiePlayer from '@/components/ui/LottiePlayer.vue'

const route = useRoute()
const uiStore = useUIStore()

const email = route.query.email

// ── UI Feedback State ──────────────────────────────────────────────────────────
const feedbackMessage = ref('')
const feedbackType = ref('success') // 'success' or 'error'

// Función para mostrar errores críticos en el modal centralizado
function showError(msg) {
  uiStore.showModal(
    msg, 
    'Error', 
    '/animations/quetzal.json'
  )
}

// Función para mostrar feedback en la UI
function showFeedback(message, type = 'success') {
  feedbackMessage.value = message
  feedbackType.value = type
  
  // Auto-clear después de 5 segundos
  setTimeout(() => {
    feedbackMessage.value = ''
  }, 5000)
}

// ── Form handler ──────────────────────────────────────────────────────────────
const { loading, handleSubmit } = useFormHandler({ showError })

// ── Resend email action ──────────────────────────────────────────────────────
async function onResendEmail() {
  await handleSubmit(async () => {
    // Validar que tengamos el email
    if (!email || email === 'tu correo electrónico') {
      throw new Error('No tenemos registro de tu correo electrónico')
    }

    await authService.resendToken(email)
    showFeedback('¡Correo reenviado exitosamente! Revisa tu bandeja de entrada', 'success')
  }, {
    // Callback para errores no críticos (mostrar en UI en lugar de modal)
    onError: (error) => {
      let errorMsg = ''
      
      if (typeof error === 'string') {
        errorMsg = error
      } else if (error.context?.detail) {
        errorMsg = error.context.detail
      } else if (error.message) {
        errorMsg = error.message
      } else {
        errorMsg = 'No pudimos reenviar el correo. Por favor, intenta nuevamente más tarde.'
      }
      
      // Mostrar error en UI
      showFeedback(errorMsg, 'error')
      
      // Si el error es grave, mostrar modal también
      if (errorMsg.includes('No tenemos registro') || 
          errorMsg.includes('usuario no existe')) {
        showError(errorMsg)
      }
      
      // Re-lanzar el error para que handleSubmit lo maneje
      throw error
    }
  })
}
</script>

<style scoped>
/* Spinner */
.btn-spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.6s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.text-center {
  text-align: center;
}

/* Animación de verificación */
.verify-animation {
  width: 180px;
  height: 180px;
  margin: 0.5rem auto 0;
}

/* Instrucciones paso a paso */
.verify-instructions {
  margin: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.instruction-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.instruction-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateX(4px);
}

.instruction-icon {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #dd4b24, #c43e1d);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.instruction-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.instruction-text strong {
  color: #1f2937;
  font-size: 0.9rem;
}

.instruction-text span {
  color: #6b7280;
  font-size: 0.8rem;
  line-height: 1.4;
}

/* Botón secundario */
.form-btn-secondary {
  width: 100%;
  padding: 0.9rem 1.5rem;
  background: transparent;
  border: 1.5px solid rgba(221, 75, 36, 0.3);
  border-radius: 0.75rem;
  color: #dd4b24;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.form-btn-secondary:hover:not(:disabled) {
  background: rgba(221, 75, 36, 0.08);
  border-color: #dd4b24;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(221, 75, 36, 0.15);
}

.form-btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Feedback messages */
.verify-feedback {
  margin-top: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.feedback-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.verify-feedback--success {
  background: rgba(221, 75, 36, 0.1);
  color: #dd4b24;
  border: 1px solid rgba(221, 75, 36, 0.2);
}

.verify-feedback--error {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
  border: 1px solid rgba(220, 38, 38, 0.2);
}

/* Tips section */
.verify-tips {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(249, 250, 251, 0.6);
  border-radius: 0.75rem;
  border-left: 3px solid #dd4b24;
}

.tips-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.tips-list li {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.4;
  padding-left: 1rem;
  position: relative;
}

.tips-list li::before {
  content: "•";
  color: #dd4b24;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.tips-list strong {
  color: #4b5563;
}

/* Footer */
.verify-footer {
  margin-top: 1.5rem;
  padding-top: 1rem;
  text-align: center;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

/* Divisor - Líneas ELIMINADAS */
.form-divider {
  text-align: center;
  margin: 1rem 0;
}

.form-divider span {
  padding: 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.w-full {
  width: 100%;
}
</style>