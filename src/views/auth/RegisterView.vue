<template>
  <div class="form-page">
    <div class="form-blob form-blob--bottom-right"></div>
    <div class="form-blob form-blob--top-left"></div>

    <div class="form-card">
      <div class="form-card__glow"></div>

      <div class="form-text-primary text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 leading-tight">
          Crea tu <span class="text-[#dd4b24]">cuenta</span>
        </h1>
        <p class="mt-3 text-lg text-gray-700 font-medium">
          Regístrate para comenzar
        </p>
      </div>

      <form class="flex flex-col gap-4 mt-2" @submit.prevent="onRegister">
        <FormField
          type="text"
          placeholder="Nombre completo"
          v-model="form.username"
          :errors="fieldErrors.username"
          required
        />
        <FormField
          type="email"
          placeholder="Correo electrónico"
          v-model="form.email"
          :errors="fieldErrors.email"
          required
        />
        <FormField
          type="password"
          placeholder="Contraseña"
          v-model="form.password"
          :errors="fieldErrors.password"
          required
        />
        <FormField
          type="password"
          placeholder="Confirmar contraseña"
          v-model="form.confirm_password"
          :errors="fieldErrors.confirm_password"
          required
        />

        <button
          type="submit"
          class="form-btn-primary"
          :disabled="loading"
          :aria-busy="loading"
        >
          <span v-if="loading" class="btn-spinner"></span>
          <span>{{ loading ? 'Registrando...' : 'Crear cuenta' }}</span>
        </button>
      </form>

      <div class="form-divider"><span>O regístrate con</span></div>

      <div class="form-social-group">
        <!-- Google: botón oficial renderizado por el SDK -->
        <div class="google-btn-wrapper">
          <div ref="googleButtonRef" class="google-button-container" />
        </div>
      </div>

      <p class="text-center text-gray-700 font-medium text-sm">
        ¿Ya tienes cuenta?
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/authService'
import { useAuthStore } from '@/stores/auth'
import { useFormHandler } from '@/composables/useFormHandler'
import { useUIStore } from '@/stores/ui'
import FormField from '@/components/ui/FormField.vue'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUIStore()

// Función para mostrar errores usando el store centralizado
function showError(msg) {
  uiStore.showModal(
    msg, 
    'Ocurrió un error', 
    '/animations/quetzal.json'
  )
}

// ── Form handler ──────────────────────────────────────────────────────────────
const { loading, fieldErrors, handleSubmit } = useFormHandler({ showError })

const form = ref({
  username: '',
  email: '',
  password: '',
  confirm_password: '',
})

// ── Acciones ──────────────────────────────────────────────────────────────────
async function onRegister() {
  await handleSubmit(async () => {
    await authService.register(form.value)
    router.push({
      name: 'ResendToken',
      query: { email: form.value.email }
    })
  })
}

// ── Google OAuth ──────────────────────────────────────────────────────────────
const googleButtonRef = ref(null)

async function handleGoogleCredential({ credential, error }) {
  if (error || !credential) {
    showError('No se pudo conectar con Google')
    return
  }
  await handleSubmit(async () => {
    const data = await authService.loginWithGoogle(credential)
    authStore.setTokens(data.access, data.refresh)
    authStore.setUser(data.user)
    router.push({ name: 'Home' })
  })
}

onMounted(() => {
  window.google.accounts.id.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback: handleGoogleCredential,
  })

  // Renderiza el botón oficial de Google con texto "Registrarse con Google"
  window.google.accounts.id.renderButton(googleButtonRef.value, {
    theme: 'outline',
    size: 'medium',
    shape: 'pill',
    text: 'signup_with',
    locale: 'es',
  })
})
</script>

<style scoped>
.text-center {
  text-align: center;
}

/* Spinner - Mismo estilo que el login */
.btn-spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.6s linear infinite;
  margin-right: 1.8rem;
  margin-top: 0.2rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ✅ Estilos para centrar y agrandar el botón de Google (mismo que Login) */
.google-btn-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-left: 4.8rem;
}

/* Estilos base para desktop - sin margen izquierdo */
.google-button-container {
  display: flex;
  justify-content: center;
  min-width: 280px;
  max-width: 400px;
  width: 100%;
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

/* 📱 Estilos para móvil - margen izquierdo de 3rem */
@media (max-width: 768px) {
  .google-btn-wrapper {
    justify-content: flex-start;
    margin-left: 3.5rem;
  }
  
  .google-button-container {
    transform: scale(1);
    min-width: auto;
  }
}

/* Opcional: Efecto hover sutil */
.google-button-container:hover {
  transform: scale(1.08);
}

/* En móvil, sin hover scale */
@media (max-width: 768px) {
  .google-button-container:hover {
    transform: scale(1);
  }
}

/* Asegura que el iframe del botón de Google ocupe todo el ancho disponible */
.google-button-container :deep(iframe) {
  width: 100% !important;
  min-width: 280px !important;
}

/* En móvil, el iframe se adapta */
@media (max-width: 768px) {
  .google-button-container :deep(iframe) {
    min-width: auto !important;
    width: auto !important;
  }
}

/* Estilos para campos con error (si FormField no los incluye) */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.input--error {
  border-color: rgba(221, 75, 36, 0.6) !important;
  box-shadow: 0 0 0 3px rgba(221, 75, 36, 0.12) !important;
  background: rgba(255, 245, 242, 0.8) !important;
}

.error-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.error-item {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  font-size: 0.78rem;
  color: #c43e1d;
  font-weight: 500;
  line-height: 1.4;
  padding-left: 0.1rem;
}

.error-icon {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
  margin-top: 1px;
  color: #dd4b24;
}

/* Animaciones para errores */
.field-error-enter-active {
  transition: all 0.2s ease;
}
.field-error-leave-active {
  transition: all 0.15s ease;
}
.field-error-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}
.field-error-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Mejora visual para botones deshabilitados */
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>