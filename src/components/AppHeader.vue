<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import CartDrawer from './cart/CartDrawer.vue'
import { useCartStore } from '@/stores/cart'
import { useCurrencyStore } from '@/stores/currency'

const cart = useCartStore()
const currencyStore = useCurrencyStore()

const isMenuOpen = ref(false)
const isSoundOn = ref(true)
const isSpanish = ref(true)
const isVisible = ref(true)
const isHovered = ref(false)
const isScrolled = ref(false)
const lastScrollY = ref(0)
let inactivityTimer = null

const navLinks = [
  { name: 'Inicio',     href: '/' },
  { name: 'Colección',  href: '/colecciones' },
  { name: 'Tienda',     href: '/piezas' },
  { name: 'Blog',       href: '#blog' },
  { name: 'Contactos',  href: '#contactos' }
]

const toggleSound    = () => { isSoundOn.value  = !isSoundOn.value  }
const toggleLanguage = () => { isSpanish.value  = !isSpanish.value  }
const toggleMenu     = () => { isMenuOpen.value = !isMenuOpen.value }
const closeMenu      = () => { isMenuOpen.value = false }

const toggleCurrency = () => {
  currencyStore.currency = currencyStore.currency === 'MXN' ? 'USD' : 'MXN'
}

// Función para iniciar el timer de inactividad
const startInactivityTimer = () => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer)
  }
  
  inactivityTimer = setTimeout(() => {
    if (!isHovered.value && !isMenuOpen.value && isVisible.value) {
      isVisible.value = false
    }
  }, 2500)
}

const handleScroll = () => {
  const currentScrollY = window.scrollY
  
  isScrolled.value = currentScrollY > 80
  
  if (currentScrollY > lastScrollY.value && currentScrollY > 50) {
    // Scroll hacia abajo - ocultar header
    if (!isHovered.value && !isMenuOpen.value && isVisible.value) {
      isVisible.value = false
    }
    if (inactivityTimer) {
      clearTimeout(inactivityTimer)
    }
  } else if (currentScrollY < lastScrollY.value) {
    // Scroll hacia arriba - mostrar header
    if (!isVisible.value) {
      isVisible.value = true
    }
    startInactivityTimer()
  }
  
  lastScrollY.value = currentScrollY
}

const handleMouseEnter = () => {
  isHovered.value = true
  if (!isVisible.value) {
    isVisible.value = true
  }
  if (inactivityTimer) {
    clearTimeout(inactivityTimer)
  }
}

const handleMouseLeave = () => {
  isHovered.value = false
  if (!isMenuOpen.value) {
    startInactivityTimer()
  }
}

const handleHeaderAreaHover = () => {
  if (!isVisible.value && !isMenuOpen.value) {
    isVisible.value = true
  }
  isHovered.value = true
  if (inactivityTimer) {
    clearTimeout(inactivityTimer)
  }
}

const handleHeaderAreaLeave = () => {
  isHovered.value = false
  if (!isMenuOpen.value) {
    startInactivityTimer()
  }
}

watch(isMenuOpen, (newVal) => {
  if (newVal) {
    isVisible.value = true
    if (inactivityTimer) {
      clearTimeout(inactivityTimer)
    }
  } else {
    startInactivityTimer()
  }
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  startInactivityTimer()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (inactivityTimer) {
    clearTimeout(inactivityTimer)
  }
})
</script>

<template>
  <!-- MENU MOBILE FULLSCREEN -->
  <Transition name="fullscreen-menu">
    <div
      v-if="isMenuOpen"
      class="fixed inset-0 z-60 lg:hidden fullscreen-overlay flex flex-col"
    >
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
          class="close-btn w-11 h-11 flex items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 active:scale-90"
          aria-label="Cerrar menú"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav class="flex-1 flex flex-col justify-center px-7 gap-0">
        <RouterLink 
          v-for="(link, i) in navLinks"
          :key="link.name"
          :to="link.href"
          class="menu-link group flex items-center justify-between py-5 border-b border-white/10 last:border-b-0"
          :style="{ '--delay': `${i * 70}ms` }"
          @click="closeMenu"
        >
          <span class="menu-link-text text-white font-light uppercase tracking-widest leading-none transition-all duration-300 group-active:translate-x-2">
            {{ link.name }}
          </span>
          <div class="menu-link-arrow w-9 h-9 rounded-full border border-white/20 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/40">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </RouterLink>
      </nav>

      <div class="menu-footer px-7 pb-10 pt-6">
        <div class="flex items-center gap-8">
          <RouterLink
            :to="{ name: 'Profile' }"
            class="footer-util flex flex-col items-center gap-2 text-white/80 transition-all duration-300 hover:text-white"
            aria-label="Perfil"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span class="text-[9px] font-medium uppercase tracking-[0.2em]">Perfil</span>
          </RouterLink>

          <button @click="toggleSound" class="footer-util flex flex-col items-center gap-2 text-white/80 transition-all duration-300 hover:text-white" aria-label="Sonido">
            <svg v-if="isSoundOn" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
            <span class="text-[9px] font-medium uppercase tracking-[0.2em]">{{ isSoundOn ? 'Sonido' : 'Mute' }}</span>
          </button>

          <button @click="toggleLanguage" class="footer-util flex flex-col items-center gap-2 text-white/80 transition-all duration-300 hover:text-white" aria-label="Cambiar idioma">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <span class="text-[9px] font-medium uppercase tracking-[0.2em]">{{ isSpanish ? 'ES' : 'EN' }}</span>
          </button>

          <!-- Currency button in mobile menu -->
          <button @click="toggleCurrency" class="footer-util flex flex-col items-center gap-2 text-white/80 transition-all duration-300 hover:text-white" aria-label="Cambiar moneda">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-[9px] font-medium uppercase tracking-[0.2em]">{{ currencyStore.currency }}</span>
          </button>
        </div>

        <div class="mt-8 flex items-center gap-3">
          <div class="h-px flex-1 bg-white/10"></div>
          <span class="text-[9px] font-medium uppercase tracking-[0.2em] text-white/40">{{ cart.totalItems }} items en carrito</span>
          <div class="h-px flex-1 bg-white/10"></div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Zona detectora de hover -->
  <div 
    class="header-trigger-area"
    @mouseenter="handleHeaderAreaHover"
    @mouseleave="handleHeaderAreaLeave"
  ></div>

  <!-- HEADER PRINCIPAL -->
  <header
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    class="header-main"
    :class="[
      isVisible && !isMenuOpen ? 'is-visible' : 'is-hidden',
      isScrolled ? 'is-scrolled' : 'is-floating',
      isHovered && isScrolled ? 'is-expanded' : 'is-compact'
    ]"
  >
    <div class="header-inner">
      <a href="/" class="header-logo">
        <img
          src="../assets/logo.svg"
          alt="Logo"
          class="logo-img"
        />
      </a>

      <nav class="header-nav">
        <RouterLink 
          v-for="link in navLinks"
          :key="link.name"
          :to="link.href"
          class="nav-item"
        >
          {{ link.name }}
        </RouterLink>
      </nav>

      <div class="header-actions">
        <RouterLink :to='{name: "Profile"}' class="action-btn" aria-label="Perfil">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </RouterLink>
        
        <button @click="toggleSound" class="action-btn" aria-label="Sonido">
          <svg v-if="isSoundOn" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
        </button>

        <button @click="toggleLanguage" class="action-btn lang-btn" aria-label="Idioma">
          <span>{{ isSpanish ? 'ES' : 'EN' }}</span>
        </button>

        <!-- Currency switcher button -->
        <button @click="toggleCurrency" class="action-btn currency-btn" aria-label="Cambiar moneda">
          <span>{{ currencyStore.currency }}</span>
        </button>

        <button @click="cart.openCart" class="action-btn cart-btn" aria-label="Carrito">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <span class="cart-badge">{{ cart.totalItems }}</span>
        </button>
      </div>

      <div class="header-mobile">
        <button @click="cart.openCart" class="mobile-cart" aria-label="Carrito">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <span class="cart-badge-mobile">{{ cart.totalItems }}</span>
        </button>
        <button @click="toggleMenu" class="mobile-menu" aria-label="Menu">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </div>
  </header>

  <CartDrawer />
</template>

<style scoped>
.header-trigger-area {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 120px;
  z-index: 29;
  pointer-events: auto;
}

.fullscreen-overlay {
  background: linear-gradient(135deg, #dd4b24 0%, #c43d1a 100%);
}

.fullscreen-menu-enter-active {
  transition: clip-path 0.6s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.3s ease;
}
.fullscreen-menu-leave-active {
  transition: clip-path 0.5s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.2s ease 0.3s;
}

.fullscreen-menu-enter-from,
.fullscreen-menu-leave-to {
  clip-path: circle(0% at 50% 0%);
  opacity: 0;
}

.fullscreen-menu-enter-to,
.fullscreen-menu-leave-from {
  clip-path: circle(150% at 50% 0%);
  opacity: 1;
}

.menu-link {
  text-decoration: none;
  animation: linkReveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: var(--delay, 0ms);
}

.menu-link-text {
  font-size: clamp(1.8rem, 8vw, 2.4rem);
  letter-spacing: 0.1em;
}

@keyframes linkReveal {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.menu-footer {
  animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
  transform: rotate(90deg);
}

.header-main {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  padding: 1rem 1.5rem;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (min-width: 768px) {
  .header-main {
    padding: 1.25rem 2rem;
  }
}

@media (min-width: 1024px) {
  .header-main {
    padding: 1.5rem 3rem;
  }
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.75rem 1.25rem;
  border-radius: 100px;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (min-width: 768px) {
  .header-inner {
    padding: 0.875rem 1.5rem;
  }
}

@media (min-width: 1024px) {
  .header-inner {
    padding: 1rem 2rem;
  }
}

.is-floating .header-inner {
  background: transparent;
  border: 1px solid transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.is-floating .nav-item,
.is-floating .action-btn,
.is-floating .lang-btn span,
.is-floating .currency-btn span {
  color: rgba(221, 75, 36, 0.85);
  text-shadow: 
    0 0 20px rgba(255, 255, 255, 0.4),
    0 0 40px rgba(255, 255, 255, 0.2),
    0 1px 2px rgba(0, 0, 0, 0.1);
}

.is-floating .nav-item:hover,
.is-floating .action-btn:hover {
  color: #dd4b24;
  text-shadow: 
    0 0 25px rgba(255, 255, 255, 0.6),
    0 0 50px rgba(255, 255, 255, 0.3);
}

.is-floating .hamburger-line {
  background: #dd4b24;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.is-floating .mobile-cart {
  color: rgba(221, 75, 36, 0.85);
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
}

.is-floating .logo-img {
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.3));
}

.is-scrolled .header-inner {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.is-scrolled .nav-item,
.is-scrolled .action-btn,
.is-scrolled .currency-btn span {
  color: rgba(221, 75, 36, 0.6);
  text-shadow: none;
}

.is-scrolled .nav-item:hover,
.is-scrolled .action-btn:hover {
  color: #dd4b24;
}

.is-scrolled .hamburger-line {
  background: #dd4b24;
  box-shadow: none;
}

.is-scrolled .mobile-cart {
  color: rgba(221, 75, 36, 0.6);
  filter: none;
}

.is-scrolled .logo-img {
  filter: none;
}

.is-visible {
  transform: translateY(0);
  opacity: 1;
}

.is-hidden {
  transform: translateY(-120%);
  opacity: 0;
}

.is-scrolled.is-compact .header-inner {
  transform: scale(0.97);
  opacity: 0.9;
}

.is-scrolled.is-expanded .header-inner {
  transform: scale(1);
  opacity: 1;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.header-logo {
  display: block;
  flex-shrink: 0;
}

.logo-img {
  height: 2.5rem;
  width: auto;
  transition: all 0.4s ease;
}

@media (min-width: 768px) {
  .logo-img {
    height: 2.75rem;
  }
}

@media (min-width: 1024px) {
  .logo-img {
    height: 3rem;
  }
}

.header-logo:hover .logo-img {
  transform: scale(1.05);
}

.header-nav {
  display: none;
}

@media (min-width: 1024px) {
  .header-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2.5rem;
    flex: 1;
  }
}

.nav-item {
  position: relative;
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 1px;
  background: #dd4b24;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-50%);
}

.nav-item:hover::after {
  width: 100%;
}

.header-actions {
  display: none;
}

@media (min-width: 1024px) {
  .header-actions {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    flex-shrink: 0;
  }
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.lang-btn, .currency-btn {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
}

.cart-btn {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 16px;
  height: 16px;
  background: #dd4b24;
  color: white;
  font-size: 9px;
  font-weight: 600;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-mobile {
  display: flex;
  align-items: center;
  gap: 1rem;
}

@media (min-width: 1024px) {
  .header-mobile {
    display: none;
  }
}

.mobile-cart {
  position: relative;
  transition: all 0.3s ease;
}

.mobile-cart:hover {
  color: #dd4b24;
}

.cart-badge-mobile {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 14px;
  height: 14px;
  background: #dd4b24;
  color: white;
  font-size: 8px;
  font-weight: 600;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-menu {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  width: 28px;
  height: 28px;
  padding: 4px;
}

.hamburger-line {
  display: block;
  width: 100%;
  height: 1.5px;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.mobile-menu:hover .hamburger-line:first-child {
  transform: translateY(-1px);
}

.mobile-menu:hover .hamburger-line:last-child {
  transform: translateY(1px);
}
</style>