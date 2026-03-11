// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {

  // ── STATE ──────────────────────────────
  // ref() = dato reactivo, como data() en Vue 2
  const user = ref(null)          // objeto del usuario logueado
  const accessToken = ref(localStorage.getItem('access_token') || null)
  const refreshToken = ref(localStorage.getItem('refresh_token') || null)

  // ── GETTERS ────────────────────────────
  // computed() = dato derivado del state, como computed en Options API
  const isLoggedIn = computed(() => !!accessToken.value)
  const isAdmin = computed(() => user.value?.is_staff === true)
  // El ?. es optional chaining: si user es null no explota

  // ── ACTIONS ────────────────────────────

  function setTokens(access, refresh) {
    // Guarda en el state Y en localStorage
    // localStorage: persiste aunque cierres el navegador
    // state: disponible reactivamente en toda la app
    accessToken.value = access
    refreshToken.value = refresh
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
  }

  function setUser(userData) {
    user.value = userData
  }

  function clearSession() {
    // Limpia todo al hacer logout
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  return {
    // State
    user,
    accessToken,
    refreshToken,
    // Getters
    isLoggedIn,
    isAdmin,
    // Actions
    setTokens,
    setUser,
    clearSession,
  }
})