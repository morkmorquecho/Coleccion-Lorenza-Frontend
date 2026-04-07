<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isMenuOpen = ref(false)
const isSoundOn = ref(true)
const isSpanish = ref(true)
const isVisible = ref(true)
const lastScrollY = ref(0)

const navLinks = [
  { name: 'Inicio',     href: '/' },
  { name: 'Colección',  href: '/colecciones' },
  { name: 'Tienda',     href: '#tienda' },
  { name: 'Blog',       href: '#blog' },
  { name: 'Contactos',  href: '#contactos' }
]

const toggleSound    = () => { isSoundOn.value  = !isSoundOn.value  }
const toggleLanguage = () => { isSpanish.value  = !isSpanish.value  }
const toggleMenu     = () => { isMenuOpen.value = !isMenuOpen.value }
const closeMenu      = () => { isMenuOpen.value = false }

const handleScroll = () => {
  const currentScrollY = window.scrollY
  if (currentScrollY < 50) {
    isVisible.value = true
  } else if (currentScrollY > lastScrollY.value) {
    isVisible.value = false
    isMenuOpen.value = false
  } else {
    isVisible.value = true
  }
  lastScrollY.value = currentScrollY
}

onMounted(()   => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>

  <!-- ─── MENÚ FULL-SCREEN MÓVIL ───────────────────────────────────────────── -->
  <Transition name="fullscreen-menu">
    <div
      v-if="isMenuOpen"
      class="fixed inset-0 z-60 lg:hidden fullscreen-overlay flex flex-col"
    >

      <!-- Barra superior: logo + cerrar -->
      <div class="flex items-center justify-between px-7 pt-8 pb-6">
        <a href="/" @click="closeMenu">
          <img
            src="../assets/logo.svg"
            alt="Logo"
            class="h-10 w-auto brightness-0 invert"
          />
        </a>
        <button
          @click="closeMenu"
          class="close-btn w-11 h-11 flex items-center justify-center rounded-full border-2 border-white/30 text-white transition-all duration-200 active:scale-90"
          aria-label="Cerrar menú"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Links de navegación (área central) -->
      <nav class="flex-1 flex flex-col justify-center px-7 gap-0">
        <RouterLink 
          v-for="(link, i) in navLinks"
          :key="link.name"
          :to="link.href"
          class="menu-link group flex items-center justify-between py-5 border-b border-white/15 last:border-b-0"
          :style="{ '--delay': `${i * 70}ms` }"
          @click="closeMenu"
        >
          <span class="menu-link-text text-white font-bold uppercase tracking-tight leading-none transition-all duration-300 group-active:translate-x-2">
            {{ link.name }}
          </span>
          <div class="menu-link-arrow w-9 h-9 rounded-full border border-white/25 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/50">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </RouterLink>
      </nav>

      <!-- Footer: utilidades -->
      <div class="menu-footer px-7 pb-10 pt-6">
        <div class="flex items-center gap-8">

          <RouterLink
            :to="{ name: 'Login' }"
            class="footer-util flex flex-col items-center gap-2 text-white transition-colors duration-200 hover:opacity-70"
            aria-label="Perfil"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span class="text-[10px] font-semibold uppercase tracking-widest">Perfil</span>
          </RouterLink>

          <!-- Sonido -->
          <button @click="toggleSound" class="footer-util flex flex-col items-center gap-2 text-white transition-colors duration-200 hover:opacity-70" aria-label="Sonido">
            <svg v-if="isSoundOn" xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
            <span class="text-[10px] font-semibold uppercase tracking-widest">{{ isSoundOn ? 'Sonido' : 'Mute' }}</span>
          </button>

          <!-- Idioma -->
          <button @click="toggleLanguage" class="footer-util flex flex-col items-center gap-2 text-white transition-colors duration-200 hover:opacity-70" aria-label="Cambiar idioma">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <span class="text-[10px] font-semibold uppercase tracking-widest">{{ isSpanish ? 'ES' : 'EN' }}</span>
          </button>

        </div>

        <div class="mt-8 flex items-center gap-3">
          <div class="h-px flex-1 bg-white/10"></div>
          <span class="text-[10px] font-semibold uppercase tracking-widest text-white/30">2 items en carrito</span>
          <div class="h-px flex-1 bg-white/10"></div>
        </div>
      </div>

    </div>
  </Transition>

  <!-- ─── HEADER PRINCIPAL ──────────────────────────────────────────────────── -->
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-3 sm:py-4 lg:py-5 mx-2 sm:mx-4 lg:mx-6 xl:mx-8 2xl:mx-12 mt-2 sm:mt-3 lg:mt-4 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-black/5 transition-all duration-500 ease-out',
      isVisible && !isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    ]"
  >
    <nav class="nav-grid">

      <!-- Hamburger (móvil) -->
      <button
        @click="toggleMenu"
        class="nav-hamburger lg:hidden text-[#dd4b24] transition-all duration-300 hover:opacity-70"
        aria-label="Abrir menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Nav links (desktop) -->
      <ul class="nav-links hidden lg:flex items-center gap-5 xl:gap-7 2xl:gap-9">
        <li v-for="link in navLinks" :key="link.name">
          <RouterLink 
            :to="link.href"
            class="nav-link text-[#dd4b24] text-sm lg:text-base xl:text-lg 2xl:text-xl font-medium italic tracking-wide transition-all duration-300 relative"
          >
            {{ link.name }}
          </RouterLink>
        </li>
      </ul>

      <!-- Logo (centro) -->
      <div class="nav-logo justify-self-center">
        <a href="/" class="block logo-link">
          <img
            src="../assets/logo.svg"
            alt="Logo"
            class="h-8 sm:h-10 lg:h-12 xl:h-14 2xl:h-16 w-auto filter drop-shadow-lg transition-transform duration-500 ease-out"
          />
        </a>
      </div>

      <!-- Iconos (desktop) -->
      <div class="nav-icons hidden lg:flex items-center justify-end gap-5 xl:gap-7 2xl:gap-9">

        <RouterLink :to='{name: "Login"}' class="icon-btn text-[#dd4b24]" aria-label="Perfil">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </RouterLink >
        
        <button @click="toggleSound" class="icon-btn text-[#dd4b24]" aria-label="Sonido">
          <svg v-if="isSoundOn" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
        </button>
        <button @click="toggleLanguage" class="icon-btn text-[#dd4b24] flex items-center gap-1 xl:gap-1.5" aria-label="Cambiar idioma">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
          <span class="text-xs xl:text-sm 2xl:text-base font-medium">{{ isSpanish ? 'ES' : 'EN' }}</span>
        </button>
        <button class="icon-btn text-[#dd4b24] relative" aria-label="Carrito">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <span class="absolute -top-2 -right-2 xl:-top-2.5 xl:-right-2.5 w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 bg-[#dd4b24] text-white text-[10px] xl:text-xs 2xl:text-sm font-bold rounded-full flex items-center justify-center">2</span>
        </button>
      </div>

      <!-- Carrito (móvil) -->
      <button class="nav-cart-mobile lg:hidden icon-btn text-[#dd4b24] relative justify-self-end" aria-label="Carrito">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <span class="absolute -top-2 -right-2 w-4 h-4 bg-[#dd4b24] text-white text-[10px] font-bold rounded-full flex items-center justify-center">2</span>
      </button>

    </nav>
  </header>

</template>

<style scoped>
/* ─── GLASSMORPHISM HEADER ────────────────────────────────────────────────── */
@supports (backdrop-filter: blur(12px)) {
  header {
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
  }
}

/* ─── OVERLAY FULL-SCREEN ─────────────────────────────────────────────────── */
.fullscreen-overlay {
  background-color: #dd4b24;
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 40px,
    rgba(0, 0, 0, 0.03) 40px,
    rgba(0, 0, 0, 0.03) 41px
  );
}

/* ─── TRANSICIÓN: circle expand desde esquina del hamburger ──────────────── */
.fullscreen-menu-enter-active {
  transition: clip-path 0.55s cubic-bezier(0.77, 0, 0.175, 1);
}
.fullscreen-menu-leave-active {
  transition: clip-path 0.45s cubic-bezier(0.77, 0, 0.175, 1);
}
.fullscreen-menu-enter-from {
  clip-path: circle(0% at 32px 32px);
}
.fullscreen-menu-enter-to {
  clip-path: circle(160% at 32px 32px);
}
.fullscreen-menu-leave-from {
  clip-path: circle(160% at 32px 32px);
}
.fullscreen-menu-leave-to {
  clip-path: circle(0% at 32px 32px);
}

/* ─── LINKS ───────────────────────────────────────────────────────────────── */
.menu-link {
  text-decoration: none;
  animation: linkReveal 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: var(--delay, 0ms);
}

.menu-link-text {
  font-size: clamp(2.4rem, 10vw, 3.2rem);
  letter-spacing: -0.04em;
}

@keyframes linkReveal {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.menu-footer {
  animation: fadeUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.35s both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ─── CLOSE BTN ───────────────────────────────────────────────────────────── */
.close-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.6);
}

/* ─── GRID PRINCIPAL ──────────────────────────────────────────────────────── */
.nav-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-areas: "hamburger logo cart-mobile";
  align-items: center;
  column-gap: 1.5rem;
  margin-bottom: .6rem;
  margin-top: .6rem;
  margin-left: 1rem;
  margin-right: 1.5rem;
}

@media (min-width: 1024px) {
  .nav-grid {
    grid-template-columns: 1fr auto 1fr;
    grid-template-areas: "nav-links logo nav-icons";
    column-gap: 3rem;
  }
}

.nav-links       { grid-area: nav-links; padding-left: .4rem; }
.nav-hamburger   { grid-area: hamburger; }
.nav-logo        { grid-area: logo; }
.nav-icons       { grid-area: nav-icons; padding-right: 2.5rem; }
.nav-cart-mobile { grid-area: cart-mobile; }

/* ─── NAV LINKS DESKTOP ───────────────────────────────────────────────────── */
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  width: 0;
  height: 1px;
  background-color: #dd4b24;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: translateX(-50%);
}
.nav-link:hover::after { width: 100%; }
.nav-link:hover        { opacity: 0.8; }

/* ─── ICONOS ──────────────────────────────────────────────────────────────── */
.icon-btn          { position: relative; transition: all 0.3s; }
.icon-btn:hover    { opacity: 0.7; transform: translateY(-2px); }

/* ─── LOGO ────────────────────────────────────────────────────────────────── */
.logo-link:hover img { transform: scale(1.05); }



</style>