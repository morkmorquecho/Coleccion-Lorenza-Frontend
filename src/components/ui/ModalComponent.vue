<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="modal-overlay"
        @click.self="handleClose"
      >
        <div class="modal-backdrop" />

        <div class="modal-container">
          <!-- Close button -->
          <button
            class="modal-close"
            @click="handleClose"
            aria-label="Cerrar modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>

          <!-- Lottie Container -->
          <div class="modal-lottie-wrapper">
            <div class="modal-lottie-box">
              <slot name="lottie">
                <!-- Icono por defecto si no hay Lottie -->
                <div class="default-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </div>
              </slot>
            </div>
          </div>

          <!-- Content -->
          <div class="modal-content">
            <h2 class="modal-title">
              {{ title }}
            </h2>

            <p class="modal-subtitle">
              {{ subtitle }}
            </p>

            <div class="modal-actions">
              <button
                v-if="showCancel"
                @click="handleClose"
                class="modal-btn modal-btn-secondary"
              >
                {{ cancelText }}
              </button>
              <button
                @click="handleConfirm"
                class="modal-btn modal-btn-primary"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>

          <!-- Decorative elements -->
          <div class="modal-decor modal-decor-1" />
          <div class="modal-decor modal-decor-2" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '¡Atención!'
  },
  subtitle: {
    type: String,
    default: '¿Estás seguro de continuar?'
  },
  confirmText: {
    type: String,
    default: 'Aceptar'
  },
  cancelText: {
    type: String,
    default: 'Cancelar'
  },
  showCancel: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'confirm'])

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
  if (!props.showCancel) {
    handleClose()
  }
}
</script>

<style scoped>
/* Layout del overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  backdrop-filter: blur(12px);
  animation: fadeIn 0.3s ease-out;
}

.modal-container {
  position: relative;
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  border-radius: 32px;
  background: linear-gradient(135deg, #ffffff 0%, #fef9f5 100%);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(221, 75, 36, 0.1);
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Close button */
.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
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

.modal-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #dd4b24;
  transform: rotate(90deg);
}

/* Lottie wrapper */
.modal-lottie-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fef5f0 0%, #fff 100%);
  padding: 48px 24px 24px 24px;
  position: relative;
}

.modal-lottie-box {
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(1.3); 
}

.default-icon {
  width: 80%;
  height: 80%;
  color: #dd4b24;
  animation: pulse 2s ease-in-out infinite;
}

.default-icon svg {
  width: 100%;
  height: 100%;
}

/* Content area */
.modal-content {
  padding: 32px 40px 40px 40px;
  text-align: center;
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #2d1f1a 0%, #5c3d2e 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 12px 0;
}

.modal-subtitle {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: #7a6b62;
  font-weight: 400;
}

/* Actions */
.modal-actions {
  margin-top: 36px;
  display: flex;
  gap: 16px;
  justify-content: center;
}

.modal-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 16px;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-btn-primary {
  background: linear-gradient(135deg, #dd4b24 0%, #c13b17 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(221, 75, 36, 0.25);
}

.modal-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(221, 75, 36, 0.35);
}

.modal-btn-primary:active {
  transform: translateY(0);
}

.modal-btn-secondary {
  background: rgba(0, 0, 0, 0.05);
  color: #5c3d2e;
}

.modal-btn-secondary:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.modal-btn-secondary:active {
  transform: translateY(0);
}

/* Decorative corners */
.modal-decor {
  position: absolute;
  width: 120px;
  height: 120px;
  pointer-events: none;
  opacity: 0.4;
}

.modal-decor-1 {
  top: -60px;
  right: -60px;
  border-radius: 50%;
  background: radial-gradient(circle, #dd4b24 0%, transparent 70%);
  filter: blur(40px);
}

.modal-decor-2 {
  bottom: -60px;
  left: -60px;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, #ff9a6e 0%, transparent 70%);
  filter: blur(40px);
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Transiciones del modal */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95) translateY(20px);
}
</style>