<template>
  <section class="block">
    <header class="block-header">
      <span class="step">1</span>
      <div>
        <h2>Dirección de envío</h2>
        <p>Donde recibirás tu pedido</p>
      </div>
    </header>

    <div class="address-card" v-if="address">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
      <div class="address-text">
        <strong>{{ address.recipient_name }}</strong>
        <span>{{ address.street }}</span>
        <span>{{ address.city }}, {{ address.state }} {{ address.postal_code }}</span>
        <span>{{ address.phone_number }}</span>
      </div>
      <span class="badge">Predeterminada</span>
    </div>

    <div class="address-empty" v-else>
      <p>No tienes una dirección configurada.</p>
    </div>
    
    <RouterLink :to="{name:'Profile'}">
      <a class="link-btn" target="_blank">
        Administrar direcciones
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" x2="21" y1="14" y2="3"/>
        </svg>
      </a>
    </RouterLink>
  </section>
</template>

<script setup>
defineProps({
  address: {
    type: Object,
    default: null
  }
})
</script>

<style scoped>
.block {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  border: 1px solid #ece8e1;
}
.block-header {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  margin-bottom: 20px;
}
.step {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}
.block-header h2 {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 1.15rem;
  font-weight: 400;
  line-height: 1.2;
}
.block-header p {
  font-size: 0.8rem;
  color: #888;
  margin-top: 3px;
}
.address-card {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 16px;
  background: #faf8f5;
  border: 1px solid #ece8e1;
  border-radius: 12px;
  margin-bottom: 14px;
  position: relative;
}
.address-card svg { color: var(--color-primary); flex-shrink: 0; margin-top: 2px; }
.address-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.875rem;
  color: #555;
  line-height: 1.5;
}
.address-text strong { color: #1a1a1a; font-size: 0.95rem; }
.badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: .07em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 999px;
}
.address-empty {
  padding: 24px;
  border: 2px dashed #ddd;
  border-radius: 12px;
  text-align: center;
  font-size: 0.875rem;
  color: #888;
  margin-bottom: 14px;
}
.link-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.83rem;
  color: #555;
  text-decoration: none;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 14px;
  transition: all .2s;
}
.link-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }
</style>