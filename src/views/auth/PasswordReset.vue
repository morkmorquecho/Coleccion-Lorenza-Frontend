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
      <template #actions v-if="showLoginButton">
        <button class="form-btn-primary mt-4" @click="goToLogin">
          Ir a iniciar sesión
        </button>
      </template>
    </ModalComponent>

    <!-- Blobs decorativos -->
    <div class="form-blob form-blob--bottom-right"></div>
    <div class="form-blob form-blob--top-left"></div>

    <!-- Tarjeta del formulario -->
    <div class="form-card">
      <div class="form-card__glow"></div>

      <!-- Header -->
      <div class="form-text-primary text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 leading-tight">
          Recuperar <span class="text-[#dd4b24]">contraseña</span>
        </h1>
        <p class="subtitle text-lg text-gray-700 font-medium">
          Ingresa tu correo y te enviaremos instrucciones
        </p>
      </div>

      <!-- Formulario -->
      <form class="flex flex-col gap-5 mt-2" @submit.prevent="onSubmit">
        <FormField
          type="email"
          placeholder="Correo electrónico"
          v-model="form.email"
          :errors="fieldErrors.email"
          required
        />

        <button type="submit" class="form-btn-primary" :disabled="loading">
          <span v-if="loading" class="btn-spinner"></span>
          <span>{{ loading ? 'Enviando...' : 'Enviar instrucciones' }}</span>
        </button>
      </form>

      <!-- Enlace para volver al login -->
      <p class="text-center text-gray-700 font-medium text-sm">
        ¿Recordaste tu contraseña?
        <RouterLink
          :to="{ name: 'Login' }"
          class="font-semibold text-[#dd4b24] hover:text-[#c43e1d] transition-colors"
        >
          Inicia sesión
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFormHandler } from '@/composables/useFormHandler'
import authService from '@/services/authService'
import FormField from '@/components/ui/FormField.vue'
import ModalComponent from '@/components/ui/ModalComponent.vue'
import LottiePlayer from '@/components/ui/LottiePlayer.vue'

const router = useRouter()

// ── Modal configuration ─────────────────────────────────────────────────────────
const showModal = ref(false)
const modalMessage = ref('')
const modalTitle = ref('')
const animationPath = ref('')
const showLoginButton = ref(false)

const ANIMATIONS = {
  success: '/animations/burro.json',
  error: '/animations/quetzal.json',
}

// Callback para mostrar errores en el modal
function showError(msg) {
  modalMessage.value = msg
  modalTitle.value = 'Error'
  animationPath.value = ANIMATIONS.error
  showLoginButton.value = false
  showModal.value = true
}

// Función para mostrar mensaje de éxito
function showSuccess(msg) {
  modalMessage.value = msg
  modalTitle.value = 'Revisa tu correo'
  animationPath.value = ANIMATIONS.success
  showLoginButton.value = true
  showModal.value = true
}

// ── Form handler ──────────────────────────────────────────────────────────────
const { loading, fieldErrors, handleSubmit } = useFormHandler({ showError })

const form = ref({
  email: '',
})

// ── Submit action ──────────────────────────────────────────────────────────────
async function onSubmit() {
  await handleSubmit(async () => {
    await authService.requestPasswordReset(form.value.email)
    
    // Mostrar mensaje de éxito
    showSuccess(
      'Si el correo existe, recibirás instrucciones para restablecer tu contraseña.'
    )
    
    // Limpiar el formulario
    form.value.email = ''
  })
}

// ── Navigation ──────────────────────────────────────────────────────────────
const goToLogin = () => {
  showModal.value = false
  router.push({ name: 'Login' })
}
</script>

<style scoped>
/* Estilos específicos del componente (no conflictivos) */
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

.subtitle{
  margin-top: 1em;
}

@keyframes spin {
    to {
    transform: rotate(360deg);
    }
}

/* Ajustes específicos si son necesarios */
.text-center {
    text-align: center;
}
</style>