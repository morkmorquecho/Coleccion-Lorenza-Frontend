<template>
  <div class="main-layout">

    <!-- ① Header fijo — siempre arriba -->
    <AppHeader />

    <!-- ② Contenido de la página actual (Vue Router inyecta aquí) -->
    <main class="main-layout__content">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- ③ Footer — siempre abajo (lo construimos después) -->
    <!-- <AppFooter /> -->

  </div>
</template>

<script>
import { onMounted } from "vue"
import AppHeader from '@/components/layout/AppHeader.vue'
import AOS from "aos"
import "aos/dist/aos.css"

export default {
  name: 'MainLayout',
  components: {
    AppHeader,
    // AppFooter,
  }
}
</script>

<style>
/* ── Variables globales del proyecto ───────
   Pon estas aquí o en tu archivo main.css/index.css
   para que toda la app las use                    */
:root {
  --orange:      #dd4b24;
  --orange-mid:  #e8612f;
  --orange-light:#f07a50;
  --orange-pale: #fdf2ee;
  --orange-soft: #fce8e0;
  --ink:         #1a0e09;
  --ink-soft:    #5a3020;
  --white:       #ffffff;
  --off-white:   #fdfaf8;

  --header-h:    72px;        /* altura del header */
  --expo:        cubic-bezier(0.16,1,0.3,1);
}

/* ── Reset mínimo ──────────────────────────── */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--white);
  color: var(--orange);
  font-family: 'Principal','Georgia', 'Times New Roman', serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}
</style>

<style scoped>
/* ── Layout shell ──────────────────────────── */
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--white);
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