// src/stores/ui.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {

  // ── LOADING GLOBAL ─────────────────────
  // Muestra un spinner mientras hay requests activos
  const isLoading = ref(false)

  function setLoading(value) {
    isLoading.value = value
  }

  // ── NOTIFICACIONES (toast) ──────────────
  // Lista de notificaciones activas en pantalla
  const notifications = ref([])
  // Estructura: { id, type: 'success'|'error'|'info', message, duration }

  function notify(message, type = 'info', duration = 4000) {
    const id = Date.now() // id único basado en timestamp
    notifications.value.push({ id, type, message })

    // Se elimina automáticamente después de `duration` ms
    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }

  function removeNotification(id) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  // Atajos para no escribir notify('...', 'success') cada vez
  const notifySuccess = (msg) => notify(msg, 'success')
  const notifyError   = (msg) => notify(msg, 'error')
  const notifyInfo    = (msg) => notify(msg, 'info')

  return {
    isLoading,
    setLoading,
    notifications,
    notify,
    removeNotification,
    notifySuccess,
    notifyError,
    notifyInfo,
  }
})