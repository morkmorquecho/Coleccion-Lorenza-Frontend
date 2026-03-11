// src/services/api.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // http://localhost:8000/api/v1
})

// ── INTERCEPTOR DE REQUEST ──────────────────
// Se ejecuta ANTES de cada petición que salga
api.interceptors.request.use(
  (config) => {
    // Importamos el store aquí dentro, no afuera
    // porque cuando el archivo carga, Pinia aún no está lista
    const authStore = useAuthStore()

    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── INTERCEPTOR DE RESPONSE ─────────────────
// Se ejecuta cuando llega la respuesta de Django

let isRefreshing = false
// Bandera para evitar que múltiples requests fallen al mismo tiempo
// y todos intenten hacer refresh simultáneamente

let failedQueue = []
// Cola de requests que fallaron mientras se estaba haciendo refresh
// Se reintentarán todos una vez que el token sea renovado

function processQueue(error, token = null) {
  // Resuelve o rechaza todos los requests en cola
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  // Si la respuesta es exitosa, la deja pasar sin tocarla
  (response) => response,

  // Si hay error...
  async (error) => {
    const originalRequest = error.config
    const authStore = useAuthStore()

    // ¿Es un 401 y no es el endpoint de refresh (para evitar loop infinito)?
    // _retry: marca que ya intentamos renovar este request una vez
    if (error.response?.status === 401 && !originalRequest._retry) {

      // Si ya hay un refresh en progreso, mete este request en la cola
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)  // reintenta con el nuevo token
        }).catch(err => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Intenta renovar el token
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/token/refresh/`,
          { refresh: authStore.refreshToken }
        )

        const { access, refresh } = response.data
        authStore.setTokens(access, refresh)

        // Resuelve todos los requests que estaban esperando
        processQueue(null, access)

        // Reintenta el request original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest)

      } catch (refreshError) {
        // El refresh también falló → la sesión expiró completamente
        processQueue(refreshError, null)
        authStore.clearSession()

        // Redirige al login
        // Importamos el router aquí para evitar dependencia circular
        const { default: router } = await import('@/router')
        router.push({ name: 'Login' })

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api