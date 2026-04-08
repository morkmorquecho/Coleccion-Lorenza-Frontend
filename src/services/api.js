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
  (response) => {
    const { success, data, errors, message } = response.data
    if (!success) {
      const error = new Error(message || 'Error en la respuesta')
      error.errors = errors
      error.context = errors?.context || {}
      error.code_error = errors?.code_error || null
      return Promise.reject(error)
    }
    return data
  },

  async (error) => {
    const originalRequest = error.config
    const authStore = useAuthStore()

    // ✅ Primero manejar el 401 con refresh
    if (error.response?.status === 401 && !originalRequest._retry) {

      if (!authStore.refreshToken) {
        return Promise.reject(error) 
      }
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }).catch(err => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/token/refresh/`,
          { refresh: authStore.refreshToken }
        )
        const { access, refresh } = response.data.data
        authStore.setTokens(access, refresh)
        processQueue(null, access)
        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest)

      } catch (refreshError) {
        processQueue(refreshError, null)
        authStore.clearSession()
        const { default: router } = await import('@/router')
        router.push({ name: 'Login' })
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // ✅ Después manejar otros errores con success:false
    const responseData = error.response?.data
    if (responseData && responseData.success === false) {
      const apiError = new Error(responseData.message || 'Error en la respuesta')
      apiError.errors = responseData.errors
      apiError.context = responseData.errors?.context || {}
      apiError.code_error = responseData.errors?.code_error || null
      return Promise.reject(apiError)
    }

    return Promise.reject(error)
  }
)

export default api