<template>
  <footer class="footer">
    <div class="footer__inner">

      <!-- Columna 1: Marca -->
      <div class="footer__col footer__col--brand">
        <img src="../../assets/logo.svg" alt="Colección Lorenza" class="footer__logo" />
        <p class="footer__tagline">Arte mexicano en papel</p>
        <p class="footer__about">
          Proyecto artesanal dedicado a preservar y celebrar el arte popular mexicano
          a través de piezas únicas elaboradas en papel.
        </p>
      </div>

      <!-- Columna 2: Navegación -->
      <div class="footer__col">
        <h3 class="footer__heading">Explorar</h3>
        <nav>
          <ul class="footer__links">
            <li v-for="link in navLinks" :key="link.label">
              <a :href="link.href" class="footer__link">
                <span class="footer__link-arrow">&#8594;</span>
                {{ link.label }}
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Columna 3: Contacto -->
      <div class="footer__col">
        <h3 class="footer__heading">Contacto</h3>
        <ul class="footer__contact-list">
          <li class="footer__contact-item">
            <svg class="footer__contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M2 7l10 7 10-7"/>
            </svg>
            <a 
              href="https://mail.google.com/mail/?view=cm&to=lorenza.arte.enpapel@gmail.com" 
              target="_blank"
              rel="noopener noreferrer"
              class="footer__link"
            >
              lorenza.arte.enpapel@gmail.com
            </a>
          </li>
          <li class="footer__contact-item">
            <svg class="footer__contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            <a :href="whatsappUrl" target="_blank" rel="noopener" class="footer__link">
              +52 314 101 0990
            </a>
          </li>
        </ul>
        <a :href="whatsappUrl" target="_blank" rel="noopener" class="footer__whatsapp-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" class="footer__whatsapp-icon">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
          </svg>
          Escribir por WhatsApp
        </a>
      </div>

      <!-- Columna 4: Redes sociales -->
      <div class="footer__col">
        <h3 class="footer__heading">Síguenos</h3>
        <p class="footer__social-text">Descubre nuestras colecciones en redes</p>
        <div class="footer__socials">
          <a
            v-for="social in socials"
            :key="social.name"
            :href="social.href"
            :aria-label="social.name"
            target="_blank"
            rel="noopener"
            class="footer__social-btn"
          >
            <svg v-if="social.iconType === 'svg'" viewBox="0 0 24 24" fill="currentColor" v-html="social.icon"></svg>
            <img v-else :src="social.icon" class="footer__social-img">
          </a>
        </div>
      </div>

    </div>

    <!-- Barra inferior -->
    <div class="footer__bottom">
      <span class="footer__copy">© 2026 Colección Lorenza</span>
      <span class="footer__dev">Sitio web desarrollado por <a href="#" class="footer__dev-link">Estudio Digital</a></span>
    </div>
  </footer>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'FooterComponent',

  setup() {
    const navLinks = [
      { label: 'Inicio',     href: '/' },
      { label: 'Colección',  href: '/coleccion' },
      { label: 'Tienda',     href: '/tienda' },
      { label: 'Blog',       href: '/blog' },
      { label: 'Contacto',   href: '/contacto' },
    ]

    const whatsappUrl = computed(() =>
      `https://wa.me/523141010990?text=${encodeURIComponent('Hola, me interesa conocer más sobre Colección Lorenza.')}`
    )

    const socials = [
      {
        name: 'Instagram',
        href: 'https://instagram.com',
        icon: '/icons/insta.svg',
        iconType: 'img'
      },
      {
        name: 'Facebook',
        href: 'https://facebook.com',
        icon: '/icons/face.svg',
        iconType: 'img'
      },
      {
        name: 'Etsy',
        href: 'https://etsy.com',
        icon: '/icons/etsy.svg',
        iconType: 'img'
      },
    ]

    return { navLinks, whatsappUrl, socials }
  }
})
</script>

<style scoped>
@font-face {
  font-family: 'COM4DL';
  src: url('/fonts/COM4DL__.TTF') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

/* ─── Variables ─────────────────────────────────────────── */
.footer {
  --orange:      #c94f2c;
  --orange-dim:  #e07a5a;
  --cream:       #faf5ee;
  --cream-dark:  #f0e8da;
  --ink:         #2a1a0e;
  --ink-soft:    #6b4c38;
  --border:      rgba(201, 79, 44, 0.15);

  font-family: 'COM4DL', Georgia, serif;
  background-color: #1a0f08;
  color: var(--cream);
  width: 100%;
}

.footer__social-img {
  width: 18px;
  height: 18px;
}

/* ─── Grid principal ─────────────────────────────────────── */
.footer__inner {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1.3fr 1fr;
  gap: 3rem 4rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 5rem 2.5rem 3.5rem;
}

/* ─── Columna marca ──────────────────────────────────────── */
.footer__logo {
  height: 48px;
  width: auto;
  filter: invert(1) sepia(1) saturate(3) hue-rotate(340deg) brightness(1.1);
  margin-bottom: 1rem;
  display: block;
}

.footer__tagline {
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--orange-dim);
  margin: 0 0 1.1rem;
}

.footer__about {
  font-size: 0.85rem;
  line-height: 1.7;
  color: rgba(250, 245, 238, 0.55);
  margin: 0;
  max-width: 26ch;
  font-family: Georgia, 'Times New Roman', Times, serif;
}

/* ─── Headings de columna ────────────────────────────────── */
.footer__heading {
  font-size: 0.68rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--orange);
  margin: 0 0 1.6rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border);
}

/* ─── Links de navegación ────────────────────────────────── */
.footer__links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.footer__link {
  font-size: 0.9rem;
  color: rgba(250, 245, 238, 0.65);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.25s ease;
  font-family: Georgia, 'Times New Roman', Times, serif;
}

.footer__link:hover {
  color: var(--orange-dim);
}

.footer__link-arrow {
  font-size: 0.75rem;
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.25s ease, transform 0.25s ease;
  display: inline-block;
  color: var(--orange);
}

.footer__link:hover .footer__link-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* ─── Contacto ───────────────────────────────────────────── */
.footer__contact-list {
  list-style: none;
  margin: 0 0 1.8rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer__contact-item {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
}

.footer__contact-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--orange);
  stroke: var(--orange);
}

.footer__contact-item .footer__link {
  font-size: 0.83rem;
  line-height: 1.4;
  word-break: break-all;
}

.footer__whatsapp-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.6rem 1.2rem;
  border: 1px solid var(--border);
  border-radius: 2rem;
  font-family: 'COM4DL', Georgia, serif;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  color: var(--orange-dim);
  text-decoration: none;
  background: rgba(201, 79, 44, 0.06);
  transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease;
}

.footer__whatsapp-btn:hover {
  background: rgba(201, 79, 44, 0.14);
  border-color: rgba(201, 79, 44, 0.4);
  color: var(--cream);
}

.footer__whatsapp-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

/* ─── Redes sociales ─────────────────────────────────────── */
.footer__social-text {
  font-size: 0.83rem;
  color: rgba(250, 245, 238, 0.45);
  margin: 0 0 1.5rem;
  line-height: 1.5;
  font-family: Georgia, 'Times New Roman', Times, serif;

}

.footer__socials {
  display: flex;
  gap: 0.9rem;
}

.footer__social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: rgba(250, 245, 238, 0.04);
  color: rgba(250, 245, 238, 0.55);
  text-decoration: none;
  transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease, transform 0.25s ease;
}

.footer__social-btn:hover {
  background: rgba(201, 79, 44, 0.12);
  border-color: rgba(201, 79, 44, 0.45);
  color: var(--orange-dim);
  transform: translateY(-3px);
}

.footer__social-btn svg {
  width: 16px;
  height: 16px;
}

/* ─── Barra inferior ─────────────────────────────────────── */
.footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.4rem 2.5rem;
  border-top: 1px solid var(--border);
  gap: 1rem;
  flex-wrap: wrap;
}

.footer__copy {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: rgba(250, 245, 238, 0.35);
    font-family: Georgia, 'Times New Roman', Times, serif;
}

.footer__dev {
  font-size: 0.75rem;
  color: rgba(250, 245, 238, 0.25);
  font-family: Georgia, 'Times New Roman', Times, serif;
}

.footer__dev-link {
  color: var(--orange-dim);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer__dev-link:hover {
  color: var(--orange);
}

/* ─── Responsive ─────────────────────────────────────────── */
@media (max-width: 1024px) {
  .footer__inner {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem 3rem;
    padding: 4rem 2rem 3rem;
  }
}

@media (max-width: 600px) {
  .footer__inner {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    padding: 3rem 1.5rem 2.5rem;
  }

  .footer__col--brand {
    text-align: center;
  }

  .footer__col--brand .footer__logo {
    margin: 0 auto 1rem;
  }

  .footer__col--brand .footer__about {
    max-width: 100%;
    margin: 0 auto;
  }

  .footer__socials {
    justify-content: flex-start;
  }

  .footer__bottom {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.2rem 1.5rem;
    gap: 0.4rem;
  }
}
</style>
