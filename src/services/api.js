// src/services/api.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'

const MANY_REQUESTS_MESSAGE = "Has excedido el número de intentos permitidos. Intenta nuevamente más tarde."

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// ── HELPERS ──────────────────────────────────────────────────────────────────
let isRefreshing = false
let failedQueue = []

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

function isTokenExpiringSoon(token, secondsBefore = 60) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now() + secondsBefore * 1000
  } catch {
    return true
  }
}

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token)
  })
  failedQueue = []
}

function normalizeFieldErrors(context) {
  if (!context || typeof context !== 'object') return context

  const normalized = {}

  for (const key in context) {
    const value = context[key]

    if (Array.isArray(value)) {
      normalized[key] = value
    } else if (typeof value === 'string') {
      normalized[key] = [value]
    } else {
      normalized[key] = value
    }
  }

  return normalized
}

function resolveErrorType(context) {
  if (typeof context === 'string' && context.length > 0) return 'message_error'
  if (typeof context === 'object' && context !== null && Object.keys(context).length > 0) return 'field_errors'
  return 'unknown'
}

function createApiError(responseData) {
  const rawContext = responseData.errors?.context ?? {}
  const context = normalizeFieldErrors(rawContext)
  const type     = resolveErrorType(context)

  const detail  = rawContext?.detail ?? null                              // ← extrae detail
  const message = responseData.message || detail || 'Error inesperado'   // ← lo usa como fallback

  const error      = new Error(message)
  error.errors     = responseData.errors
  error.context    = context
  error.code_error = responseData.errors?.code_error || null
  error.type       = type

  return error
}

function isFormattedApiError(response) {
  return response?.data?.success === false
}

async function doRefresh(authStore) {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/token/refresh/`,
    { refresh: authStore.refreshToken }
  )
  const { access, refresh } = data.data
  authStore.setTokens(access, refresh)
  return access
}

// ── INTERCEPTORS ─────────────────────────────────────────────────────────────
export function setupInterceptors(pinia) {
  const authStore = useAuthStore(pinia)
  const uiStore   = useUIStore(pinia)

  // ── REQUEST ──────────────────────────────────────────────────────────────
  api.interceptors.request.use(
    async (config) => {
      let token = authStore.accessToken

      if (token && authStore.refreshToken && isTokenExpiringSoon(token, 60)) {
        if (isRefreshing) {
          token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
        } else {
          isRefreshing = true
          try {
            token = await doRefresh(authStore)
            processQueue(null, token)
          } catch (err) {
            processQueue(err, null)
            authStore.clearSession()
            const { default: router } = await import('@/router')
            router.push({ name: 'Login' })
            return Promise.reject(err)
          } finally {
            isRefreshing = false
          }
        }
      }

      if (token && !isTokenExpired(token)) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    },
    (error) => Promise.reject(error)
  )

  // ── RESPONSE ─────────────────────────────────────────────────────────────
  api.interceptors.response.use(
    (response) => {
      if (response.status === 204 || response.data == null) {  
        return null
      }

      const { success, data, errors, message } = response.data
      if (!success) {
        return Promise.reject(createApiError({ success, errors, message }))
      }
      return data
    },

    async (error) => {
      const originalRequest = error.config
      const { response }    = error

      if (response?.status === 429) {
        uiStore.showError(MANY_REQUESTS_MESSAGE)
        return Promise.reject(
          createApiError({
            success: false,
            message: MANY_REQUESTS_MESSAGE,
            errors: { code_error: 'RATE_LIMIT_EXCEEDED', context: MANY_REQUESTS_MESSAGE }
          })
        )
      }

      if (isFormattedApiError(response)) {
        return Promise.reject(createApiError(response.data))
      }

      // 401 inesperado por race condition
      if (response?.status === 401 && !originalRequest._retry) {
        if (!authStore.refreshToken) {
          authStore.clearSession()
          const { default: router } = await import('@/router')
          router.push({ name: 'Login' })
          return Promise.reject(error)
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              return api(originalRequest)
            })
            .catch((err) => Promise.reject(err))
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const token = await doRefresh(authStore)
          processQueue(null, token)
          originalRequest.headers.Authorization = `Bearer ${token}`
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

      return Promise.reject(error)
    }
  )
}

export default api