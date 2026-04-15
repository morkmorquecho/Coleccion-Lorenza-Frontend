// src/composables/useFormHandler.js
import { ref } from 'vue'
import { useUIStore } from '@/stores/ui'

export function useFormHandler() {
  const loading     = ref(false)
  const fieldErrors = ref({})
  const uiStore     = useUIStore()

  async function handleSubmit(action) {
    loading.value     = true
    fieldErrors.value = {}

    try {
      return await action()
    } catch (error) {
      handleError(error)
    } finally {
      loading.value = false
    }
  }

  function handleError(error) {
    switch (error.type) {
      case 'field_errors':
        fieldErrors.value = error.context
        break

      case 'message_error':
        uiStore.showError(error.context, 'Ocurrio un error', '/animations/quetzal.json')
        break

      default:
        uiStore.showError('Ocurrió un error inesperado, intentalo mas tarde')
        console.error('[Unhandled error]', error)
    }
  }

  return { loading, fieldErrors, handleSubmit }
}