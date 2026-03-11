<template>
  <header :class="['app-header', { 'header--hidden': isHidden, 'header--scrolled': isScrolled }]">
    <div class="header-inner">
      <!-- Logo -->
      <a href="/" class="header-logo" aria-label="Inicio">
        <span class="logo-mark">&#9632;</span>
        <span class="logo-text">studio</span>
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
          <span class="nav-link-dot"></span>
        </a>
      </nav>

      <!-- CTA Desktop -->
      <div class="header-actions">
        <a href="#contact" class="cta-btn">
          Contacto
          <span class="cta-arrow">&#8594;</span>
        </a>
      </div>

      <!-- Hamburger Mobile -->
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

    <!-- Mobile Menu Overlay -->
    <Transition name="menu-slide">
      <div v-if="menuOpen" class="mobile-menu" role="dialog" aria-modal="true">
        <nav class="mobile-nav" aria-label="Menú móvil">
          <a
            v-for="(item, i) in navItems"
            :key="item.href"
            :href="item.href"
            class="mobile-nav-link"
            :style="{ transitionDelay: `${i * 60}ms` }"
            :class="{ 'mobile-nav-link--visible': menuOpen }"
            @click.prevent="handleMobileNav(item.href)"
          >
            <span class="mobile-link-number">0{{ i + 1 }}</span>
            {{ item.label }}
          </a>
        </nav>
        <div class="mobile-footer">
          <a href="#contact" class="cta-btn cta-btn--mobile" @click="toggleMenu">
            Contacto <span class="cta-arrow">&#8594;</span>
          </a>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// --- State ---
const isHidden  = ref(false)
const isScrolled = ref(false)
const menuOpen  = ref(false)
const activeLink = ref('#home')

const navItems = [
  { label: 'Inicio',    href: '#home' },
  { label: 'Trabajo',   href: '#work' },
  { label: 'Servicios', href: '#services' },
  { label: 'Nosotros',  href: '#about' },
]

// --- Scroll logic ---
let lastScrollY = 0
let ticking = false

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      const currentY = window.scrollY
      isScrolled.value = currentY > 20

      if (currentY > lastScrollY && currentY > 80) {
        // Scrolling down
        isHidden.value = true
        if (menuOpen.value) menuOpen.value = false
      } else {
        // Scrolling up
        isHidden.value = false
      }

      lastScrollY = currentY <= 0 ? 0 : currentY
      ticking = false
    })
    ticking = true
  }
}

// --- Mobile menu ---
function toggleMenu() {
  menuOpen.value = !menuOpen.value
  document.body.style.overflow = menuOpen.value ? 'hidden' : ''
}

function handleMobileNav(href) {
  setActive(href)
  menuOpen.value = false
  document.body.style.overflow = ''
}

function setActive(href) {
  activeLink.value = href
}

// --- Lifecycle ---
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
   TOKENS / VARIABLES
   =========================== */
.app-header {
  --color-bg:      rgba(8, 8, 10, 0.72);
  --color-border:  rgba(255, 255, 255, 0.08);
  --color-text:    #e8e8e8;
  --color-muted:   rgba(232, 232, 232, 0.45);
  --color-accent:  #e2e2e2;
  --color-cta-bg:  #ffffff;
  --color-cta-txt: #0a0a0a;
  --radius:        999px;
  --blur:          18px;
  --height:        60px;
  --transition:    0.38s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===========================
   BASE
   =========================== */
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 12px 24px;
  transform: translateY(0);
  transition:
    transform var(--transition),
    background var(--transition),
    backdrop-filter var(--transition),
    border-color var(--transition);
  background: transparent;
  border-bottom: 1px solid transparent;
}

.app-header.header--scrolled {
  background: var(--color-bg);
  backdrop-filter: blur(var(--blur)) saturate(160%);
  -webkit-backdrop-filter: blur(var(--blur)) saturate(160%);
  border-bottom-color: var(--color-border);
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
  max-width: 1200px;
  margin: 0 auto;
  height: var(--height);
  gap: 24px;
}

/* ===========================
   LOGO
   =========================== */
.header-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--color-text);
  flex-shrink: 0;
}

.logo-mark {
  font-size: 14px;
  color: var(--color-accent);
  transform: rotate(45deg);
  display: inline-block;
  transition: transform 0.5s ease;
}

.header-logo:hover .logo-mark {
  transform: rotate(225deg);
}

.logo-text {
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text);
}

/* ===========================
   NAV DESKTOP
   =========================== */
.header-nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  position: relative;
  padding: 6px 14px;
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: var(--color-muted);
  text-decoration: none;
  border-radius: var(--radius);
  transition: color 0.22s ease, background 0.22s ease;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius);
  opacity: 0;
  transition: opacity 0.22s ease;
}

.nav-link:hover {
  color: var(--color-text);
}

.nav-link:hover::before {
  opacity: 1;
}

.nav-link--active {
  color: var(--color-text);
}

.nav-link-dot {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%) scale(0);
  width: 3px;
  height: 3px;
  background: var(--color-accent);
  border-radius: 50%;
  transition: transform 0.22s ease;
}

.nav-link--active .nav-link-dot,
.nav-link:hover .nav-link-dot {
  transform: translateX(-50%) scale(1);
}

/* ===========================
   CTA BUTTON
   =========================== */
.header-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  background: var(--color-cta-bg);
  color: var(--color-cta-txt);
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  border-radius: var(--radius);
  text-decoration: none;
  transition: background 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease;
  box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
}

.cta-btn:hover {
  background: #f0f0f0;
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(255, 255, 255, 0.15);
}

.cta-arrow {
  display: inline-block;
  transition: transform 0.22s ease;
}

.cta-btn:hover .cta-arrow {
  transform: translateX(3px);
}

/* ===========================
   HAMBURGER
   =========================== */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  transition: border-color 0.22s ease;
}

.hamburger:hover {
  border-color: rgba(255, 255, 255, 0.22);
}

.hamburger span {
  display: block;
  width: 18px;
  height: 1.5px;
  background: var(--color-text);
  border-radius: 2px;
  transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.22s ease;
  transform-origin: center;
}

.hamburger--open span:nth-child(1) {
  transform: translateY(6.5px) rotate(45deg);
}

.hamburger--open span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger--open span:nth-child(3) {
  transform: translateY(-6.5px) rotate(-45deg);
}

/* ===========================
   MOBILE MENU
   =========================== */
.mobile-menu {
  position: fixed;
  inset: 0;
  background: rgba(6, 6, 8, 0.97);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px 32px 48px;
  z-index: 999;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 18px 0;
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  font-size: clamp(28px, 7vw, 42px);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: rgba(232, 232, 232, 0.35);
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  transform: translateY(20px);
  opacity: 0;
  transition:
    color 0.22s ease,
    transform 0.42s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.42s ease;
}

.mobile-nav-link--visible {
  transform: translateY(0);
  opacity: 1;
}

.mobile-nav-link:hover {
  color: var(--color-text);
}

.mobile-link-number {
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.1em;
  color: rgba(232, 232, 232, 0.25);
  flex-shrink: 0;
  margin-top: 4px;
}

.mobile-footer {
  margin-top: 48px;
}

.cta-btn--mobile {
  font-size: 15px;
  padding: 14px 32px;
}

/* ===========================
   TRANSITIONS (Vue)
   =========================== */
.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: opacity 0.32s ease, transform 0.38s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-slide-enter-from,
.menu-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ===========================
   RESPONSIVE
   =========================== */
@media (max-width: 768px) {
  .header-nav,
  .header-actions {
    display: none;
  }

  .hamburger {
    display: flex;
  }
}

@media (max-width: 480px) {
  .app-header {
    padding: 10px 16px;
  }
}
</style>
