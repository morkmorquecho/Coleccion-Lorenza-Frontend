<template>
  <div class="login-page">

    <!-- Blobs decorativos -->
    <div class="blob blob--br"></div>
    <div class="blob blob--tl"></div>

    <!-- Tarjeta glassmorphism -->
    <div class="login-card">
      <div class="login-card__glow"></div>

      <!-- Cabecera -->
      <div class="text-principal text-center ">
        <h1 class="text-4xl font-extrabold text-gray-900 leading-tight">
          Bienvenido <span class="text-[#dd4b24]">de nuevo</span>
        </h1>
        <p class="mt-3 text-lg text-gray-700 font-medium">
          Accede a tu cuenta para continuar
        </p>
      </div>

      <!-- Formulario -->
      <form class="flex flex-col gap-5 mt-2" @submit.prevent="login">

        <input
          type="email"
          placeholder="Correo electrónico o username"
          class="login-input"
          required
          v-model="form.email" 
        />

        <input
          type="password"
          placeholder="Contraseña"
          class="login-input"
          required
        />

        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center gap-2 text-gray-700 cursor-pointer">
            <!-- <input type="checkbox" class="h-4 w-4 accent-[#dd4b24]" />
            Recuérdame -->
          </label>
          <a href="#" class="font-semibold text-[#dd4b24] hover:text-[#c43e1d] transition-colors">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <button type="submit" class="login-btn">
          Iniciar sesión
        </button>
      </form>

      <!-- Divisor -->
      <div class="login-divider">
        <span>O inicia sesión con</span>
      </div>

      <!-- Social -->
      <div class="flex flex-col sm:flex-row gap-3">
        <button class="social-btn" @click="loginWithGoogle">
          <svg class="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Google
        </button>
        <button class="social-btn" @click="loginWithFacebook">
          <svg class="h-5 w-5 fill-[#1877F2]" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Facebook
        </button>
      </div>

      <!-- Registro -->
      <p class="text-center text-gray-700 font-medium text-sm">
        ¿No tienes cuenta?
        <RouterLink
        :to="{name: 'Register'}"
        href="#" class="font-semibold text-[#dd4b24] hover:text-[#c43e1d] transition-colors">
          Regístrate gratis
        </RouterLink>
      </p>

    </div>
  </div>
</template>

<script setup>
  import authService from '@/services/authService';
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  const authStore = useAuthStore()
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

  const router = useRouter()
  const form = ref({ email: '', password: '', confirm_password: '', username: ''})

  const errors = ref({})
  const loading = ref(false)

  onMounted(() => {
    window.google?.accounts.oauth2  
  })

  const loginWithGoogle = () => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: 'openid email profile',
      callback: async ({ error, access_token }) => {
        if (error) {
          errors.value = { non_field_errors: ['No se pudo conectar con Google'] }
          return
        }
        await handleOAuthSuccess(access_token)
      },
    })
    client.requestAccessToken()
  }

  const handleOAuthSuccess = async (googleToken) => {
    loading.value = true
    errors.value  = {}
    try {
      // El interceptor ya devuelve { access, refresh, user }
      const data = await authService.loginWithGoogle(googleToken)
      authStore.setTokens(data.access, data.refresh)
      if (data.user) authStore.setUser(data.user)
      router.push({ name: 'Home' })
    } catch (err) {
      // El interceptor ya armó err.context con los errores del backend
      errors.value = err.context || { non_field_errors: ['Error al autenticar con Google'] }
    } finally {
      loading.value = false
    }
  }


  const login = async () => {
      loading.value = true
      errors.value = {}

      try {
        const payload = {
          username: form.value.username,
          email: form.value.email,
          password: form.value.password,
          confirm_password: form.value.confirm_password
        }

        const res = await authService.login(payload)        
        router.push({name:'Home'})
      } catch (error) {
        console.log('error.context:', error.context)   
        errors.value = error.context || {}
      } finally {
        loading.value = false
      }
    }

  const loginWithFacebook = () => alert('Login con Facebook.')
</script>

<style scoped>
/* ── Página: ocupa todo el espacio que le da main-layout__content ── */
.login-page {
 flex: 1;
  display: flex;
  justify-content: center;  display: flex;
  align-items: center;
  background: #fffbf7;
  padding: 1.5rem 1rem;
  position: relative;
  overflow: hidden;
}

.text-principal{
  margin-bottom: 1em;
}

/* ── Blobs ── */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}
.blob--br {
  bottom: -2.5rem; right: -2.5rem;
  width: 10rem; height: 10rem;
  background: rgba(221,75,36,.18);
}
.blob--tl {
  top: -2.5rem; left: -2.5rem;
  width: 15rem; height: 15rem;
  background: rgba(221,75,36,.08);
}

/* ── Tarjeta ── */
.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem 2rem;
  background: rgba(255,255,255,.45);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255,255,255,.3);
  border-radius: 1.5rem;
  box-shadow: 0 20px 60px rgba(0,0,0,.08);
}

@media (min-width: 640px) {
  .login-card { padding: 4.5rem 2.5rem; }
}

/* Brillo detrás de la card */
.login-card__glow {
  position: absolute;
  inset: -4px;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(221,75,36,.08), rgba(221,75,36,.03));
  filter: blur(16px);
  z-index: -1;
}

/* ── Inputs ── */
.login-input {
  width: 100%;
  padding: .9rem 1.25rem;
  background: rgba(255,255,255,.7);
  border: 1px solid rgba(255,255,255,.25);
  border-radius: .75rem;
  color: #1a0e09;
  font-size: .95rem;
  outline: none;
  transition: box-shadow .2s, border-color .2s;
  box-shadow: 0 1px 4px rgba(0,0,0,.05);
}
.login-input::placeholder { color: #9ca3af; }
.login-input:focus {
  border-color: rgba(221,75,36,.4);
  box-shadow: 0 0 0 3px rgba(221,75,36,.15);
}

/* ── Botón principal ── */
.login-btn {
  width: 100%;
  padding: 1rem;
  background: #dd4b24;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  border-radius: .75rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(221,75,36,.35);
  transition: background .2s, transform .2s;
}
.login-btn:hover {
  background: #c43e1d;
  transform: translateY(-1px);
}

/* ── Divisor ── */
.login-divider {
  position: relative;
  text-align: center;
  color: #6b7280;
  font-size: .85rem;
}
.login-divider::before,
.login-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 33%;
  height: 1px;
  background: #e5e7eb;
}
.login-divider::before { left: 0; }
.login-divider::after  { right: 0; }

/* ── Botones sociales ── */
.social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .6rem;
  padding: .8rem 1rem;
  background: rgba(255,255,255,.7);
  border: 1px solid rgba(0,0,0,.08);
  border-radius: .75rem;
  font-weight: 600;
  font-size: .9rem;
  color: #1a0e09;
  cursor: pointer;
  transition: background .2s, transform .2s, box-shadow .2s;
}
.social-btn:hover {
  background: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,.08);
}
</style>