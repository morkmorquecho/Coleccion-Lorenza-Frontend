<template>
  <div class="pending-root">
    <!-- Top bar (mismo estilo que checkout) -->
    <nav class="topbar">
      <RouterLink :to="{ name: 'Home' }" class="back-link">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          viewBox="0 0 24 24"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Volver
      </RouterLink>
      <span class="topbar-title">Pago en proceso</span>
      <span></span>
    </nav>

    <div class="pending-layout">
      <main class="pending-container">
        <div class="pending-card">
          <div class="icon-wrapper pending">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>

          <h1>Pago pendiente</h1>
          <p>Estamos confirmando tu pago. Te notificaremos en cuanto esté listo.</p>

          <div class="order-info">
            <span class="order-label">Número de orden</span>
            <strong class="order-number">#{{ orderId }}</strong>
          </div>

          <div class="info-message">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4m0 4h.01" />
            </svg>
            <span>El proceso puede tomar hasta 5 minutos</span>
          </div>

          <div class="actions">
            <RouterLink :to="{ name: 'Profile' }" class="btn-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Ver estado
            </RouterLink>

            <RouterLink :to="{ name: 'Home' }" class="btn-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-5v-8H7v8H5a2 2 0 0 1-2-2z" />
              </svg>
              Volver al inicio
            </RouterLink>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import {onMounted } from 'vue'

const cart = useCartStore()

const props = defineProps({
  orderId: {
    type: String,
    required: true,
  },
})

onMounted(() => {
  // Un pequeño retraso para asegurar que todo se ha renderizado
  setTimeout(() => {
    cart.clearCart()
  }, 100)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.pending-root {
  min-height: 100vh;
  background: #f7f5f2;
  color: #1a1a1a;
}

/* ── Topbar (mismo estilo que checkout) ── */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 48px;
  background: #fff;
  border-bottom: 1px solid #ece8e1;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #666;
  text-decoration: none;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--color-primary);
}

.topbar-title {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 1.25rem;
  font-weight: 400;
  letter-spacing: 0.01em;
  margin-right: 2.8em;
}

/* ── Layout principal ── */
.pending-layout {
  max-width: 600px;
  margin: 0 auto;
  padding: 60px 32px;
}

.pending-container {
  width: 100%;
}

.pending-card {
  background: #fff;
  border: 1px solid #ece8e1;
  border-radius: 16px;
  padding: 48px 40px;
  text-align: center;
}

/* ── Icono ── */
.icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.icon-wrapper.pending {
  background: #fffbeb;
  color: #d97706;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.icon-wrapper svg {
  stroke-width: 2.5;
}

/* ── Tipografía ── */
h1 {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 1.75rem;
  font-weight: 400;
  margin-bottom: 12px;
  color: #1a1a1a;
}

p {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 32px;
  line-height: 1.5;
}

/* ── Información de orden ── */
.order-info {
  background: #faf8f5;
  border: 1px solid #ece8e1;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-label {
  font-size: 0.85rem;
  color: #888;
  font-family: 'DM Sans', sans-serif;
}

.order-number {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 1.2rem;
  color: var(--color-primary);
  letter-spacing: 0.5px;
}

/* ── Mensaje informativo ── */
.info-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #fefce8;
  border: 1px solid #fef08a;
  border-radius: 10px;
  padding: 10px 16px;
  margin-bottom: 32px;
  font-size: 0.8rem;
  color: #854d0e;
  font-family: 'DM Sans', sans-serif;
}

.info-message svg {
  flex-shrink: 0;
  color: #d97706;
}

/* ── Botones (estilo igual al checkout) ── */
.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 999px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-primary {
  background: var(--color-primary);
  color: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(196, 80, 26, 0.2);
}

.btn-primary:hover {
  background: #b3451a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(196, 80, 26, 0.3);
}

.btn-secondary {
  background: transparent;
  color: #666;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-1px);
}

/* ── Responsive (mismo que checkout) ── */
@media (max-width: 768px) {
  .pending-layout {
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: calc(100vh - 70px);
  }

  .pending-card {
    padding: 32px 24px;
  }

  .topbar {
    padding: 16px 20px;
  }

  .order-info {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .topbar-title {
    display: none;
  }

  .icon-wrapper {
    width: 64px;
    height: 64px;
  }

  h1 {
    font-size: 1.5rem;
  }

  .info-message {
    font-size: 0.75rem;
  }
}
</style>
