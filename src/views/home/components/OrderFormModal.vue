<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-30 flex items-center justify-center bg-stone-950/30 backdrop-blur-sm p-4"
        @click.self="close"
      >
        <div
          class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          <!-- Header -->
          <header class="flex items-center justify-between px-6 py-5 border-b border-orange-100">
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-100">
                <TruckIcon class="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 class="text-base font-semibold text-stone-800">
                  Número de seguimiento
                </h2>
                <p class="text-xs text-stone-500">
                  Ingresa el número de rastreo
                </p>
              </div>
            </div>
            <button
              @click="close"
              :disabled="loading"
              class="modal-close"
              aria-label="Cerrar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </header>

          <!-- Form Content -->
          <div class="p-6">
            <form @submit.prevent="handleSubmit">
              <div class="space-y-4">
                <!-- Tracking Input -->
                <div>
                  <label class="block text-sm font-medium text-stone-700 mb-2">
                    Número de seguimiento
                  </label>
                  <input
                    v-model="trackingNumber"
                    type="text"
                    class="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 outline-none transition-all text-stone-800 placeholder:text-stone-400"
                    :class="{ 'border-red-300 focus:border-red-400': error }"
                    :disabled="loading"
                    placeholder="Ej: 1Z999AA10123456784"
                    autocomplete="off"
                    @input="clearError"
                  />
                  <p v-if="error" class="mt-1.5 text-xs text-red-500">
                    {{ error }}
                  </p>
                </div>

                <!-- Loading State Overlay (opcional) -->
                <div v-if="loading" class="flex items-center justify-center py-4">
                  <div class="relative w-8 h-8">
                    <div class="absolute inset-0 rounded-full border-2 border-orange-100"></div>
                    <div class="absolute inset-0 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-3 pt-2">
                  <button
                    type="button"
                    @click="close"
                    :disabled="loading"
                    class="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    :disabled="!trackingNumber.trim() || loading"
                    class="flex-1 px-4 py-2.5 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ loading ? 'Guardando...' : 'Guardar' }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Truck } from 'lucide-vue-next'

const TruckIcon = Truck

const props = defineProps<{
  modelValue: boolean
  initialValue?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [trackingNumber: string]
}>()

const trackingNumber = ref(props.initialValue || '')
const error = ref('')

// Reset form when modal opens
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    trackingNumber.value = props.initialValue || ''
    error.value = ''
  }
})

function clearError() {
  error.value = ''
}

function validate(): boolean {
  if (!trackingNumber.value.trim()) {
    error.value = 'El número de seguimiento es requerido'
    return false
  }
  
  // Validación básica (puedes ajustarla según tu necesidad)
  if (trackingNumber.value.trim().length < 5) {
    error.value = 'El número de seguimiento es demasiado corto'
    return false
  }
  
  return true
}

function handleSubmit() {
  if (!validate()) return
  
  emit('submit', trackingNumber.value.trim())
}

function close() {
  if (!props.loading) {
    emit('update:modelValue', false)
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}

.modal-close {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  color: #6b5b52;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.1);
  color: #dd4b24;
  transform: rotate(90deg);
}

.modal-close:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 0.8s linear infinite;
}
</style>