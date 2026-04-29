
<!-- layouts/CheckoutLayout.vue -->
<template>
  <div class="checkout-layout">
    <main class="main-layout__content">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script>
  import '../assets/main.css'
</script>

<style scoped>
.checkout-layout {
  min-height: 100vh;
  background: linear-gradient(180deg, #faf8f5 0%, #fff 100%);
}


.main-layout__content {
  width: 100%;
}

/* Transiciones de página */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Responsive */
@media (max-width: 768px) {
  .main-layout__content {
    padding: 0;
  }
}
</style>