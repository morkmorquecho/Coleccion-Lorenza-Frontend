// src/services/api.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// ── REQUEST INTERCEPTOR ─────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── HELPERS ─────────────────────────────────────────────────────────────────
let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token)
  })
  failedQueue = []
}

/**
 * Convierte una respuesta { success: false, ... } en un Error estructurado.
 * Úsalo en cualquier punto donde necesites normalizar errores de la API.
 */
function createApiError(responseData) {
  const error = new Error(responseData.message || 'Error en la respuesta')
  error.errors     = responseData.errors
  error.context    = responseData.errors?.context    || {}
  error.code_error = responseData.errors?.code_error || null
  return error
}

/**
 * Determina si un error de respuesta es un error formateado por la API
 * (success: false) versus un 401 de token expirado que debemos refrescar.
 *
 * Ajusta la condición según cómo tu backend distinga ambos casos.
 * Opción A: el backend manda success:false en credenciales inválidas.
 * Opción B: usas code_error, e.g. 'TOKEN_EXPIRED' vs 'INVALID_CREDENTIALS'.
 */
function isFormattedApiError(response) {
  return response?.data?.success === false
}

// ── RESPONSE INTERCEPTOR ────────────────────────────────────────────────────
api.interceptors.response.use(
  // ── Respuestas 2xx ───────────────────────────────────────────────────────
  (response) => {
    const { success, data, errors, message } = response.data

    if (!success) {
      return Promise.reject(createApiError({ success, errors, message }))
    }

    return data
  },

  // ── Respuestas de error ──────────────────────────────────────────────────
  async (error) => {
    const originalRequest = error.config
    const authStore       = useAuthStore()
    const { response }    = error

    // ── 1. Errores formateados por la API (success: false) ─────────────────
    //    Tienen prioridad sobre cualquier lógica de refresh.
    //    Esto captura: credenciales inválidas, permisos, validaciones, etc.
    if (isFormattedApiError(response)) {
      return Promise.reject(createApiError(response.data))
    }

    // ── 2. 401 sin formato de API → intentar refresh de token ──────────────
    if (response?.status === 401 && !originalRequest._retry) {

      // Sin refresh token: sesión inválida, limpiar y redirigir
      if (!authStore.refreshToken) {
        authStore.clearSession()
        const { default: router } = await import('@/router')
        router.push({ name: 'Login' })
        return Promise.reject(error)
      }

      // Otro request ya está refrescando: encolar y esperar
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch(Promise.reject)
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/token/refresh/`,
          { refresh: authStore.refreshToken }
        )
        const { access, refresh } = data.data

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

    // ── 3. Cualquier otro error HTTP (403, 404, 500, red, etc.) ────────────
    return Promise.reject(error)
  }
)

export default api