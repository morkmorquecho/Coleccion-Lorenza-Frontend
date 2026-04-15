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
        <button class="form-social-btn" @click="registerWithGoogle" :disabled="loading">
          <svg class="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>
        <button class="form-social-btn" @click="registerWithFacebook" :disabled="loading">
          <svg class="h-5 w-5 fill-[#1877F2]" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </button>
      </div>

      <p class="text-center text-gray-700 font-medium text-sm">
        ¿Ya tienes cuenta?
        <RouterLink :to="{ name: 'Login' }" class="font-semibold text-[#dd4b24] hover:text-[#c43e1d] transition-colors">
          Inicia sesión
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted }    from 'vue'
import { useRouter }         from 'vue-router'
import authService           from '@/services/authService'
import { useAuthStore }      from '@/stores/auth'
import { useFormHandler }    from '@/composables/useFormHandler'
import FormField             from '@/components/ui/FormField.vue'
import ModalComponent        from '@/components/ui/ModalComponent.vue'
import LottiePlayer          from '@/components/ui/LottiePlayer.vue'

const router    = useRouter()
const authStore = useAuthStore()

// ── Modal local (para message_error) ─────────────────────────────────────────
const showModal    = ref(false)
const modalMessage = ref('')
const modalTitle   = ref('')
const animationPath = ref('')

const ANIMATIONS = {
  success: '/animations/burro.json',
  error:   '/animations/quetzal.json',
}

// Lo pasamos al composable para que sepa cómo mostrar message_error
function showError(msg) {
  modalMessage.value  = msg
  modalTitle.value    = 'Ocurrió un error'
  animationPath.value = ANIMATIONS.error
  showModal.value     = true
}

// ── Form handler ──────────────────────────────────────────────────────────────
const { loading, fieldErrors, handleSubmit } = useFormHandler({ showError })

const form = ref({
  username:         '',
  email:            '',
  password:         '',
  confirm_password: '',
})

// ── Acciones ──────────────────────────────────────────────────────────────────
async function onRegister() {
  await handleSubmit(async () => {
    await authService.register(form.value)
    router.push({
         name: 'ResendToken' ,
         query: {email: form.value.email}
    })
  })
}

onMounted(() => {
  window.google?.accounts.oauth2
})

async function registerWithGoogle() {
  if (loading.value) return

  const client = window.google.accounts.oauth2.initTokenClient({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    scope: 'openid email profile',
    callback: async ({ error, access_token }) => {
      if (error) {
        showError('No se pudo conectar con Google')
        return
      }
      await handleSubmit(async () => {
        const data = await authService.loginWithGoogle(access_token)
        authStore.setTokens(data.access, data.refresh)
        authStore.setUser(data.user)
        router.push({ name: 'Home' })
      })
    },
  })

  client.requestAccessToken()
}

function registerWithFacebook() {
  if (loading.value) return
  alert('Registro con Facebook.')
}
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