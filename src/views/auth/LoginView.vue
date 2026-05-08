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
          Bienvenido <span class="text-[#dd4b24]">de nuevo</span>
        </h1>
        <p class="mt-3 text-lg text-gray-700 font-medium">Accede a tu cuenta para continuar</p>
      </div>

      <!-- Formulario -->
      <form class="flex flex-col gap-5 mt-2" @submit.prevent="onLogin">
        <FormField
          type="text"
          placeholder="Correo o username"
          v-model="form.identifier"
          :errors="fieldErrors.identifier"
        />

        <FormField
          type="password"
          placeholder="Contraseña"
          v-model="form.password"
          :errors="fieldErrors.password"
          required
        />

        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center gap-2 text-gray-700 cursor-pointer">
            <!-- <input type="checkbox" class="h-4 w-4 accent-[#dd4b24]" />
            Recuérdame -->
          </label>
          <RouterLink
            class="font-semibold text-[#dd4b24] hover:text-[#c43e1d] transition-colors"
            :to="{ name: 'PasswordReset' }"
          >
            ¿Olvidaste tu contraseña?
          </RouterLink>
        </div>

        <button type="submit" class="form-btn-primary" :disabled="loading">
          <span v-if="loading" class="btn-spinner"></span>
          <span>{{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}</span>
        </button>
      </form>

      <!-- Divisor -->
      <div class="form-divider">
        <span>O inicia sesión con</span>
      </div>

      <!-- Social -->
      <div class="form-social-group">
        <!-- Google: contenedor centrado con estilos -->
        <div class="google-btn-wrapper">
          <div ref="googleButtonRef" class="google-button-container" />
        </div>

        <!-- Facebook: mismo estilo visual que el botón de Google -->
        <!-- <button class="form-social-btn" @click="loginWithFacebook" :disabled="loading">
          <svg class="h-5 w-5 fill-[#1877F2]" viewBox="0 0 24 24">
            <path
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
          </svg>
          Facebook
        </button> -->
      </div>

      <!-- Registro -->
      <p class="text-center text-gray-700 font-medium text-sm">
        ¿No tienes cuenta?
        <RouterLink
          :to="{ name: 'Register' }"
          class="font-semibold text-[#dd4b24] hover:text-[#c43e1d] transition-colors"
        >
          Regístrate gratis
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFormHandler } from '@/composables/useFormHandler'
import { useUIStore } from '@/stores/ui'
import authService from '@/services/authService'
import FormField from '@/components/ui/FormField.vue'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUIStore()

// ── Form handler ──────────────────────────────────────────────────────────────
// Callback para mostrar errores usando el store centralizado
function showError(msg) {
  uiStore.showModal(
    msg, 
    'Ocurrió un error', 
    '/animations/quetzal.json'
  )
}

const { loading, fieldErrors, handleSubmit } = useFormHandler({ showError })

const form = ref({
  identifier: '',
  password: '',
})

// Helper para validar email
const isEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

// ── Login action ──────────────────────────────────────────────────────────────
async function onLogin() {
  await handleSubmit(async () => {
    const payload = {
      password: form.value.password,
    }

    if (isEmail(form.value.identifier)) {
      payload.email = form.value.identifier
    } else {
      payload.username = form.value.identifier
    }

    const data = await authService.login(payload)
    authStore.setTokens(data.access, data.refresh)
    authStore.setUser(data.user)
    router.push({ name: 'Home' })
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

  // Renderiza el botón oficial de Google
  window.google.accounts.id.renderButton(googleButtonRef.value, {
    theme: 'outline',     
    size: 'medium',
    shape: 'pill',   
    text: 'continue_with',
    locale: 'es',
  })
})

// ── Facebook login (placeholder) ──────────────────────────────────────────────
function loginWithFacebook() {
  if (loading.value) return
  uiStore.showModal(
    'Funcionalidad en desarrollo', 
    'Próximamente', 
    '/animations/burro.json'
  )
}
</script>

<style scoped>
/* Estilos específicos del componente */
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

/* ✅ Estilos para centrar y agrandar el botón de Google */
.google-btn-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-left: 5.7rem;
}

/* Estilos base para desktop - sin margen izquierdo */
.google-button-container {
  display: flex;
  justify-content: center;
  min-width: 280px;
  max-width: 400px;
  width: 100%;
  transform: scale(1.05); /* Agranda ligeramente el botón */
  transition: transform 0.2s ease;
}

/* 📱 Estilos para móvil - margen izquierdo de 3rem */
@media (max-width: 768px) {
  .google-btn-wrapper {
    justify-content: flex-start;
    margin-left: 4rem;
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

.form-social-btn:hover:not(:disabled) {
  background-color: #f8f9fa;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}

.form-social-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>