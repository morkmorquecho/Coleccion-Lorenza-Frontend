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
          Restablecer <span class="text-[#dd4b24]">contraseña</span>
        </h1>
        <p class="mt-3 text-lg text-gray-700 font-medium">
          Ingresa tu nueva contraseña
        </p>
      </div>

      <!-- Formulario -->
      <form class="flex flex-col gap-5 mt-2" @submit.prevent="onResetPassword">
        <FormField
          type="password"
          placeholder="Nueva contraseña"
          v-model="form.new_password"
          :errors="fieldErrors.new_password"
          required
        />

        <FormField
          type="password"
          placeholder="Confirmar nueva contraseña"
          v-model="form.confirm_new_password"
          :errors="fieldErrors.confirm_new_password"
          required
        />

        <button type="submit" class="form-btn-primary" :disabled="loading">
          <span v-if="loading" class="btn-spinner"></span>
          <span>{{ loading ? 'Restableciendo...' : 'Restablecer contraseña' }}</span>
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFormHandler } from '@/composables/useFormHandler'
import { useUIStore } from '@/stores/ui'
import authService from '@/services/authService'
import FormField from '@/components/ui/FormField.vue'

const router = useRouter()
const route = useRoute()
const uiStore = useUIStore()

// Obtener parámetros de la URL
const uidb64 = route.params.uidb64
const token = route.params.token

// Función para mostrar errores usando el store centralizado
function showError(msg) {
  uiStore.showModal(
    msg, 
    'Error', 
    '/animations/quetzal.json'
  )
}

// Función para mostrar mensaje de éxito con botón de acción
function showSuccess(msg) {
  uiStore.showModal(
    msg, 
    '¡Contraseña restablecida!', 
    '/animations/burro.json',
    {
      showActionButton: true,
      buttonText: 'Ir a iniciar sesión',
      onConfirm: () => router.push({ name: 'Login' })
    }
  )
}

// ── Form handler ──────────────────────────────────────────────────────────────
const { loading, fieldErrors, handleSubmit } = useFormHandler({ showError })

const form = ref({
  new_password: '',
  confirm_new_password: '',
})

// ── Submit action ──────────────────────────────────────────────────────────────
async function onResetPassword() {
  await handleSubmit(async () => {
    const payload = {
      uidb64: uidb64,
      token: token,
      new_password: form.value.new_password,
      confirm_new_password: form.value.confirm_new_password,
    }

    await authService.confirmPasswordReset(payload)
    
    // Mostrar mensaje de éxito
    showSuccess(
      'Tu contraseña ha sido actualizada correctamente. Ahora puedes iniciar sesión.'
    )
    
    // Limpiar el formulario
    form.value.new_password = ''
    form.value.confirm_new_password = ''
  })
}

// ── Validación inicial ──────────────────────────────────────────────────────
onMounted(() => {
  if (!uidb64 || !token) {
    showError('El enlace para restablecer contraseña no es válido o está incompleto.')
  }
})
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

.form-btn-primary:disabled {
  opacity: 0.75;
  cursor: not-allowed;
  transform: none;
}
</style>