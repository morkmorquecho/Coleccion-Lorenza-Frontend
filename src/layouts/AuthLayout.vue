<template>
  <div class="main-layout">


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
import "aos/dist/aos.css"
import '../assets/main.css'


</script>


<style scoped>
/* ── Layout shell ──────────────────────────── */
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── Área de contenido ─────────────────────── */
/* padding-top = altura del header para que el contenido
   no quede debajo del header fijo                       */
.main-layout__content {
  flex: 1;
  display: flex;        
  flex-direction: column; 
}

.main-layout__content > * {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ── Transición entre páginas ──────────────── */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s ease, transform 0.45s var(--expo);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>