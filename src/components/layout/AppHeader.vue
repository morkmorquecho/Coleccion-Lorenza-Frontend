<template>
  <header :class="['app-header', { 'header--hidden': isHidden, 'header--scrolled': isScrolled }]">
    <div class="header-inner">

      <!-- Logo -->
      <a href="/" class="header-logo" aria-label="Inicio">
        <img src="../../assets/logo.svg" alt="Logo" class="logo-img" />
      </a>

      <!-- Nav Desktop -->
      <nav class="header-nav" aria-label="Navegación principal">
        <a
          v-for="item in navItems"
          :key="item.href"
          :href="item.href"
          :class="['nav-link', { 'nav-link--active': activeLink === item.href }]"
          @click.prevent="setActive(item.href)"
        >
          {{ item.label }}
          <span class="nav-link-line"></span>
        </a>
      </nav>

      <!-- Icons Desktop -->
      <div class="header-actions">
        <button class="icon-btn lang-btn" @click="toggleLang" :aria-label="`Idioma: ${currentLang}`">
          <span class="lang-text">{{ currentLang }}</span>
        </button>

        <button class="icon-btn" @click="toggleMute" :aria-label="muted ? 'Activar sonido' : 'Silenciar'">
          <svg v-if="!muted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <line x1="23" y1="9" x2="17" y2="15"/>
            <line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
        </button>

        <a href="/perfil" class="icon-btn" aria-label="Mi perfil">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </a>

        <a href="/favoritos" class="icon-btn" aria-label="Favoritos">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </a>

        <a href="/carrito" class="icon-btn cart-btn" aria-label="Carrito de compras">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </a>
      </div>

      <!-- Tablet: cart visible + hamburger -->
      <div class="header-actions-tablet">
        <a href="/carrito" class="icon-btn cart-btn" aria-label="Carrito de compras">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </a>

        <button
          class="hamburger"
          :class="{ 'hamburger--open': menuOpen }"
          @click="toggleMenu"
          aria-label="Abrir menú"
          :aria-expanded="menuOpen"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <!-- Backdrop -->
    <Transition name="backdrop-fade">
      <div
        v-if="menuOpen"
        class="drawer-backdrop"
        @click="closeMenu"
        aria-hidden="true"
      />
    </Transition>

    <!-- Drawer -->
    <Transition name="drawer-slide">
      <aside v-if="menuOpen" class="drawer" role="dialog" aria-modal="true" aria-label="Menú">

        <!-- Drawer Header -->
        <div class="drawer-header">
          <span class="drawer-label">Menú</span>
          <button class="drawer-close" @click="closeMenu" aria-label="Cerrar menú">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Drawer Nav -->
        <nav class="drawer-nav" aria-label="Menú móvil">
          <a
            v-for="(item, i) in navItems"
            :key="item.href"
            :href="item.href"
            class="drawer-link"
            :class="{ 'drawer-link--active': activeLink === item.href }"
            :style="{ transitionDelay: menuOpen ? `${i * 45 + 40}ms` : '0ms' }"
            @click.prevent="handleMobileNav(item.href)"
          >
            <span class="drawer-link-index">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="drawer-link-label">{{ item.label }}</span>
            <svg class="drawer-link-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </nav>

        <!-- Drawer Footer -->
        <div class="drawer-footer">
          <div class="drawer-footer-actions">
            <button class="drawer-icon-btn lang-btn" @click="toggleLang" :aria-label="`Idioma: ${currentLang}`">
              <span class="lang-text">{{ currentLang }}</span>
            </button>

            <button class="drawer-icon-btn" @click="toggleMute" :aria-label="muted ? 'Activar sonido' : 'Silenciar'">
              <svg v-if="!muted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/>
                <line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            </button>

            <a href="/perfil" class="drawer-icon-btn" aria-label="Mi perfil" @click="closeMenu">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </a>

            <a href="/favoritos" class="drawer-icon-btn" aria-label="Favoritos" @click="closeMenu">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </a>
          </div>
        </div>

      </aside>
    </Transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isHidden    = ref(false)
const isScrolled  = ref(false)
const menuOpen    = ref(false)
const activeLink  = ref('#inicio')
const muted       = ref(false)
const currentLang = ref('ES')
const cartCount   = ref(2)

const navItems = [
  { label: 'Inicio',    href: '#inicio' },
  { label: 'Colección', href: '#coleccion' },
  { label: 'Tienda',    href: '#tienda' },
  { label: 'Blog',      href: '#blog' },
  { label: 'Contactos', href: '#contactos' },
]

const langs = ['ES', 'EN', 'FR']

let lastScrollY = 0
let ticking = false

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      const currentY = window.scrollY
      isScrolled.value = currentY > 20
      if (currentY > lastScrollY && currentY > 80) {
        isHidden.value = true
        if (menuOpen.value) closeMenu()
      } else {
        isHidden.value = false
      }
      lastScrollY = currentY <= 0 ? 0 : currentY
      ticking = false
    })
    ticking = true
  }
}

function toggleMute()  { muted.value = !muted.value }
function toggleLang()  { const i = langs.indexOf(currentLang.value); currentLang.value = langs[(i + 1) % langs.length] }
function setActive(href) { activeLink.value = href }

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  document.body.style.overflow = menuOpen.value ? 'hidden' : ''
}

function closeMenu() {
  menuOpen.value = false
  document.body.style.overflow = ''
}

function handleMobileNav(href) {
  setActive(href)
  closeMenu()
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  lastScrollY = window.scrollY
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* ===========================
   FONT
   =========================== */
@font-face {
  font-family: 'COM4DL__';
  src: url('/fonts/COM4DL__.TTF') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

/* ===========================
   TOKENS
   =========================== */
.app-header {
  --orange:      #ff6a1a;
  --orange-dim:  rgba(255, 106, 26, 0.55);
  --bg-glass:    rgba(6, 4, 2, 0.18);
  --bg-scrolled: rgba(6, 4, 2, 0.52);
  --border:      rgba(255, 106, 26, 0.12);
  --blur:        20px;
  --height:      64px;
  --ease:        cubic-bezier(0.4, 0, 0.2, 1);

  /* Drawer */
  --drawer-width:   300px;
  --drawer-bg:      #0c0704;
  --drawer-border:  rgba(255, 106, 26, 0.1);
}

/* ===========================
   BASE HEADER
   =========================== */
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0 28px;
  background: var(--bg-glass);
  border-bottom: 1px solid transparent;
  backdrop-filter: blur(0px) saturate(100%);
  -webkit-backdrop-filter: blur(0px) saturate(100%);
  transform: translateY(0);
  transition:
    transform 0.4s var(--ease),
    background 0.36s var(--ease),
    backdrop-filter 0.36s var(--ease),
    border-color 0.36s var(--ease);
}

.app-header.header--scrolled {
  background: var(--bg-scrolled);
  backdrop-filter: blur(var(--blur)) saturate(180%);
  -webkit-backdrop-filter: blur(var(--blur)) saturate(180%);
  border-bottom-color: var(--border);
}

.app-header.header--hidden {
  transform: translateY(-110%);
}

/* ===========================
   INNER ROW
   =========================== */
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1320px;
  margin: 0 auto;
  height: var(--height);
  gap: 16px;
}

/* ===========================
   LOGO
   =========================== */
.header-logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  text-decoration: none;
}

.logo-img {
  height: 36px;
  width: auto;
  display: block;
  filter: brightness(0) saturate(100%) invert(52%) sepia(95%) saturate(1200%) hue-rotate(1deg) brightness(105%);
  transition: filter 0.28s ease, transform 0.36s var(--ease);
}

.header-logo:hover .logo-img {
  filter: brightness(0) saturate(100%) invert(52%) sepia(95%) saturate(1200%) hue-rotate(1deg) brightness(130%);
  transform: scale(1.05);
}

/* ===========================
   NAV DESKTOP
   =========================== */
.header-nav {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  justify-content: center;
}

.nav-link {
  position: relative;
  padding: 6px 13px;
  font-family: 'COM4DL__', sans-serif;
  font-size: 12.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--orange-dim);
  text-decoration: none;
  transition: color 0.22s ease;
  white-space: nowrap;
}

.nav-link::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 6px;
  background: rgba(255, 106, 26, 0.07);
  opacity: 0;
  transition: opacity 0.22s ease;
}

.nav-link:hover,
.nav-link--active {
  color: var(--orange);
}

.nav-link:hover::before {
  opacity: 1;
}

.nav-link-line {
  position: absolute;
  bottom: 1px;
  left: 13px;
  right: 13px;
  height: 1px;
  background: var(--orange);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.28s var(--ease);
  border-radius: 1px;
}

.nav-link--active .nav-link-line,
.nav-link:hover .nav-link-line {
  transform: scaleX(1);
}

/* ===========================
   ACTIONS DESKTOP
   =========================== */
.header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

/* Tablet strip: cart + hamburger only */
.header-actions-tablet {
  display: none;
  align-items: center;
  gap: 6px;
}

/* ===========================
   ICON BTN (shared)
   =========================== */
.icon-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: var(--orange-dim);
  text-decoration: none;
  transition: color 0.22s ease, background 0.22s ease;
  padding: 0;
}

.icon-btn svg {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
}

.icon-btn:hover {
  color: var(--orange);
  background: rgba(255, 106, 26, 0.09);
}

.lang-btn {
  width: auto;
  padding: 0 10px;
}

.lang-text {
  font-family: 'COM4DL__', sans-serif;
  font-size: 11px;
  letter-spacing: 0.12em;
  color: inherit;
}

.cart-btn { position: relative; }

.cart-badge {
  position: absolute;
  top: 3px;
  right: 3px;
  min-width: 15px;
  height: 15px;
  padding: 0 3px;
  background: var(--orange);
  color: #0a0a0a;
  font-family: 'COM4DL__', sans-serif;
  font-size: 9px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  font-weight: 700;
  line-height: 1;
}

/* ===========================
   HAMBURGER
   =========================== */
.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 9px;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  transition: border-color 0.22s ease, background 0.22s ease;
}

.hamburger:hover {
  border-color: rgba(255, 106, 26, 0.35);
  background: rgba(255, 106, 26, 0.05);
}

.hamburger span {
  display: block;
  height: 1.5px;
  background: var(--orange);
  border-radius: 2px;
  transition: transform 0.32s var(--ease), opacity 0.22s ease, width 0.22s ease;
  transform-origin: center;
}

.hamburger span:nth-child(1) { width: 18px; }
.hamburger span:nth-child(2) { width: 12px; }
.hamburger span:nth-child(3) { width: 18px; }

.hamburger--open span:nth-child(1) { width: 18px; transform: translateY(6.5px) rotate(45deg); }
.hamburger--open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger--open span:nth-child(3) { width: 18px; transform: translateY(-6.5px) rotate(-45deg); }

/* ===========================
   BACKDROP
   =========================== */
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(3, 2, 1, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 1100;
  cursor: pointer;
}

.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: opacity 0.3s ease;
}
.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}

/* ===========================
   DRAWER
   =========================== */
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: var(--drawer-width);
  max-width: 88vw;
  background: var(--drawer-bg);
  border-left: 1px solid var(--drawer-border);
  z-index: 1200;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Subtle grain texture on drawer */
.drawer::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  pointer-events: none;
  opacity: 0.5;
}

.drawer-slide-enter-active {
  transition: transform 0.38s cubic-bezier(0.22, 1, 0.36, 1);
}
.drawer-slide-leave-active {
  transition: transform 0.28s cubic-bezier(0.4, 0, 1, 1);
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}

/* --- Drawer Header --- */
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: var(--height);
  border-bottom: 1px solid var(--drawer-border);
  flex-shrink: 0;
}

.drawer-label {
  font-family: 'COM4DL__', sans-serif;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 106, 26, 0.35);
}

.drawer-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  background: transparent;
  border: 1px solid var(--drawer-border);
  border-radius: 8px;
  cursor: pointer;
  color: var(--orange-dim);
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  padding: 0;
}

.drawer-close svg {
  width: 15px;
  height: 15px;
}

.drawer-close:hover {
  color: var(--orange);
  border-color: rgba(255, 106, 26, 0.35);
  background: rgba(255, 106, 26, 0.06);
}

/* --- Drawer Nav --- */
.drawer-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px 0;
  overflow-y: auto;
}

.drawer-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  text-decoration: none;
  color: rgba(255, 106, 26, 0.4);
  border-bottom: 1px solid rgba(255, 106, 26, 0.05);
  transition:
    color 0.22s ease,
    background 0.22s ease,
    padding-left 0.22s var(--ease),
    opacity 0.4s ease,
    transform 0.4s var(--ease);
  transform: translateX(16px);
  opacity: 0;
}

/* Links animate in when drawer opens */
.drawer-link {
  animation: drawerLinkIn 0.4s var(--ease) forwards;
}

@keyframes drawerLinkIn {
  to { transform: translateX(0); opacity: 1; }
}

.drawer-link:hover,
.drawer-link--active {
  color: var(--orange);
  background: rgba(255, 106, 26, 0.05);
  padding-left: 26px;
}

.drawer-link-index {
  font-family: 'COM4DL__', sans-serif;
  font-size: 9px;
  letter-spacing: 0.1em;
  color: rgba(255, 106, 26, 0.2);
  flex-shrink: 0;
  width: 20px;
}

.drawer-link--active .drawer-link-index {
  color: rgba(255, 106, 26, 0.5);
}

.drawer-link-label {
  font-family: 'COM4DL__', sans-serif;
  font-size: 15px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  flex: 1;
}

.drawer-link-arrow {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.2s ease, transform 0.2s var(--ease);
}

.drawer-link:hover .drawer-link-arrow,
.drawer-link--active .drawer-link-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* --- Drawer Footer --- */
.drawer-footer {
  flex-shrink: 0;
  padding: 20px;
  border-top: 1px solid var(--drawer-border);
}

.drawer-footer-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.drawer-icon-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  height: 38px;
  background: rgba(255, 106, 26, 0.04);
  border: 1px solid rgba(255, 106, 26, 0.08);
  border-radius: 8px;
  cursor: pointer;
  color: var(--orange-dim);
  text-decoration: none;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
  padding: 0 10px;
}

.drawer-icon-btn svg {
  width: 16px;
  height: 16px;
}

.drawer-icon-btn:hover {
  color: var(--orange);
  background: rgba(255, 106, 26, 0.1);
  border-color: rgba(255, 106, 26, 0.25);
}

/* ===========================
   RESPONSIVE — 3 NIVELES
   =========================== */

/*
  ┌─────────────────────────────────────────────────┐
  │  NIVEL 1 — Desktop (≥1024px)                    │
  │  Logo | Nav centrado | Todos los iconos          │
  └─────────────────────────────────────────────────┘
*/
@media (min-width: 1024px) {
  .header-actions-tablet { display: none; }
  .header-actions        { display: flex; }
  .header-nav            { display: flex; }
}

/*
  ┌─────────────────────────────────────────────────┐
  │  NIVEL 2 — Tablet (600px – 1023px)              │
  │  Logo | Nav (solo primeros 3 ítems) | Cart + ☰  │
  └─────────────────────────────────────────────────┘
*/
@media (min-width: 600px) and (max-width: 1023px) {
  .header-actions        { display: none; }
  .header-actions-tablet { display: flex; }
  .header-nav            { display: flex; flex: 1; justify-content: center; }

  /* Ocultar ítems 4 y 5 en tablet */
  .header-nav .nav-link:nth-child(n+4) {
    display: none;
  }

  .app-header { padding: 0 20px; }
}

/*
  ┌─────────────────────────────────────────────────┐
  │  NIVEL 3 — Mobile (<600px)                      │
  │  Logo | Cart + ☰  (nav oculta completamente)   │
  └─────────────────────────────────────────────────┘
*/
@media (max-width: 599px) {
  .header-actions        { display: none; }
  .header-actions-tablet { display: flex; }
  .header-nav            { display: none; }
  .app-header            { padding: 0 14px; }

  .drawer {
    width: 92vw;
  }
}

/* Drawer más ancho en pantallas pequeñas */
@media (max-width: 400px) {
  .drawer { max-width: 100vw; border-left: none; }
}
</style>