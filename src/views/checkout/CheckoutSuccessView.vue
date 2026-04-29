<template>
  <div class="success-root">
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
      <span class="topbar-title">Pago confirmado</span>
      <span></span>
    </nav>

    <div class="success-layout">
      <main class="success-container">
        <div class="success-card">
          <div class="icon-wrapper success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <h1>¡Pago exitoso!</h1>
          <p>Tu pedido ha sido procesado correctamente.</p>

          <div class="order-info">
            <span class="order-label">Número de orden</span>
            <strong class="order-number">#{{ orderId }}</strong>
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
              Ver mi pedido
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
              Seguir comprando
            </RouterLink>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  orderId: {
    type: String,
    required: true,
  },
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

.success-root {
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
.success-layout {
  max-width: 600px;
  margin: 0 auto;
  padding: 60px 32px;
}

.success-container {
  width: 100%;
}

.success-card {
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

.icon-wrapper.success {
  background: #f0fdf4;
  color: #16a34a;
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
  margin-bottom: 32px;
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
  .success-layout {
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: calc(100vh - 70px);
  }

  .success-card {
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
}
</style>
