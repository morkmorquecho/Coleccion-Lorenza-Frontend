<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue';

interface Props {
  title?: string;
  photos?: { top: string[]; bottom: string[] };
}

const props = withDefaults(defineProps<Props>(), {
  title: "HANNAH MILES",
});

const baseImages = [
  "img/alebrijes/img-1.jpg", "img/alebrijes/img-2.jpg", "img/alebrijes/img-3.jpg",
  "img/alebrijes/img-4.jpg", "img/alebrijes/img-5.JPG", "img/alebrijes/img-6.JPG",
  "img/alebrijes/img-7.JPG", "img/alebrijes/img-8.jpg", "img/alebrijes/img-9.JPG",
  "img/alebrijes/img-10.JPG", "img/alebrijes/img-11.jpg", "img/alebrijes/img-1.jpg",
];

const sourceImages = computed(() => {
  if (props.photos) return [...props.photos.top, ...props.photos.bottom];
  return baseImages;
});

const visibleImages = ref<{ src: string; uid: number }[]>([]);
let uidCounter = 0;

function appendBatch() {
  const batch = sourceImages.value.map((src) => ({ src, uid: uidCounter++ }));
  visibleImages.value.push(...batch);
}

const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(async () => {
  appendBatch();
  appendBatch();
  appendBatch();

  await nextTick();

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) appendBatch();
    },
    { rootMargin: '600px' }
  );

  if (sentinel.value) observer.observe(sentinel.value);
});

onUnmounted(() => observer?.disconnect());
</script>

<template>
  <section class="main-wrapper">

    <div class="title-container">
      <h1 class="hero-title">
        {{ title }}
      </h1>
    </div>

    <div class="gallery-container">
      <div class="image-grid">
        <div
          v-for="item in visibleImages"
          :key="item.uid"
          class="image-card"
        >
          <img :src="item.src" alt="" loading="lazy" />
        </div>
      </div>

      <div ref="sentinel" class="scroll-sentinel" />
    </div>

  </section>
</template>

<style scoped>
/* 1. Estructura General */
.main-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: var(--background); /* Asegúrate de tener definida esta variable o usa un color hex */
}

/* 2. Título (Capa fija) */
.title-container {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  user-select: none;
  z-index: 1;
}

.hero-title {
  color: #dd4b24; /* El tono terracota que definimos */
  font-family: 'Editorial', serif; /* O la fuente que estés usando */
  font-size: clamp(3rem, 11vw, 13rem);
  line-height: 1;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

/* 3. Contenedor de Galería (Centrado Manual) */
.gallery-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1400px;
  
  /* Tu centrado manual crítico */
  margin-left: auto;
  margin-right: auto;
  
  margin-top: 3.5em;
  padding: 0 1rem;
  box-sizing: border-box;
}

/* 4. Grid Responsivo */
.image-grid {
  display: grid;
  /* 2 columnas por defecto (móvil) */
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem; /* gap-6 */
}

/* Breakpoint para Desktop (equivalente a md: de Tailwind) */
@media (min-width: 768px) {
  .image-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 2.5rem; /* gap-10 */
  }
}

/* 5. Tarjetas e Imágenes */
.image-card {
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background-color: #f3f3f3; /* Placeholder visual mientras carga */
}

.image-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 6. Sentinel */
.scroll-sentinel {
  height: 100px;
  width: 100%;
}
</style>