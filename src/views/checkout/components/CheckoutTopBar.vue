<template>
  <nav class="topbar">
    <a href="/" class="back-link">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
        <path d="m15 18-6-6 6-6"/>
      </svg>
      Volver
    </a>
    <span class="topbar-title">Checkout</span>
    <span></span>
  </nav>
</template>

<style scoped>
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
  transition: color .2s;
}
.back-link:hover { color: var(--color-primary); }
.topbar-title {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 1.25rem;
  font-weight: 400;
  letter-spacing: .01em;
}
</style>