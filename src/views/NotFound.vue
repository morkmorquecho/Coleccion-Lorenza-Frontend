<template>
  <div class="not-found">
    <!-- Lottie protagonista -->
    <div class="lottie-wrapper">
      <LottiePlayer path="/animations/404.json" />
    </div>

    <!-- Mensaje mínimo -->
    <!-- <div class="message">
        <h1>¡Ups! Esto no existe</h1>
        <p>La página que buscas no está aquí. Quizás fue movida o eliminada.</p>
    </div> -->
  </div>
</template>

<script setup>
import LottiePlayer from '@/components/ui/LottiePlayer.vue';
</script>

<style scoped>
.not-found {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: var(--color-background-3); /* opcional: fondo oscuro elegante */
}

/* Lottie ocupa casi todo */
.lottie-wrapper {
  position: absolute;
  inset: 0;
  z-index: 1;
}

/* Texto encima, discreto */
.message {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  background: rgba(0,0,0,0.3);
  padding: 16px 24px;
  border-radius: 12px;
  backdrop-filter: blur(6px);
}

.message h1 {
  font-size: 48px;
  margin: 0;
}

.message p {
  margin: 4px 0 0;
  font-size: 16px;
  opacity: 0.85;
}
</style>