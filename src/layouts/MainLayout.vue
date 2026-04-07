<template>
  <div class="main-layout">

    <!-- ① Header fijo — siempre arriba -->
    <AppHeader />

    <main class="main-layout__content">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <AppFooter />
  </div>
</template>

<script>
import { onMounted } from "vue"
import AppHeader from '@/components/AppHeader.vue'
import "aos/dist/aos.css"
import '../assets/main.css'
import AppFooter from "@/components/AppFooter.vue"

export default {
  name: 'MainLayout',
  components: {
    AppHeader,
    AppFooter,
  }
}
</script>


<style scoped>
/* ── Layout shell ──────────────────────────── */
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-background);
}

/* ── Área de contenido ─────────────────────── */
/* padding-top = altura del header para que el contenido
   no quede debajo del header fijo                       */
.main-layout__content {
  flex: 1;
}

/* ── Transición entre páginas ──────────────── */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.35s var(--expo);
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