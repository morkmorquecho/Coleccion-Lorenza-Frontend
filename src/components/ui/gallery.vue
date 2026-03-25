<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue';

const activeIndex = ref<number | null>(null);
const colCount = ref(typeof window !== 'undefined' ? (window.innerWidth >= 768 ? 4 : 2) : 4);

const SCALE_ACTIVE = 2.4;
const SCALE_SHRINK = 0.55;

const props = withDefaults(defineProps<Props>(), {
  title: "DIA DE MUERTOS",
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
const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

interface Props {
  title?: string;
  photos?: { top: string[]; bottom: string[] };
}

// Agrupa las imágenes en filas según colCount
const rows = computed(() => {
  const c = colCount.value;
  const result = [];
  for (let i = 0; i < visibleImages.value.length; i += c) {
    result.push(visibleImages.value.slice(i, i + c));
  }
  return result;
});

const activeRow = computed(() =>
  activeIndex.value !== null ? Math.floor(activeIndex.value / colCount.value) : null
);
const activeCol = computed(() =>
  activeIndex.value !== null ? activeIndex.value % colCount.value : null
);

function handleClick(flatIndex: number) {
  activeIndex.value = activeIndex.value === flatIndex ? null : flatIndex;
}

// Solo toca flex-grow del item. El layout hace el resto solo.
function getItemStyle(rowIndex: number, colIndex: number) {
  if (activeRow.value !== rowIndex) return {};
  if (colIndex === activeCol.value) return { flexGrow: SCALE_ACTIVE };
  return { flexGrow: SCALE_SHRINK };
}

function appendBatch() {
  const batch = sourceImages.value.map((src) => ({ src, uid: uidCounter++ }));
  visibleImages.value.push(...batch);
}

function handleResize() {
  colCount.value = window.innerWidth >= 768 ? 4 : 2;
  activeIndex.value = null;
}

onMounted(async () => {
  appendBatch();
  appendBatch();
  appendBatch();

  window.addEventListener('resize', handleResize);

  await nextTick();

  observer = new IntersectionObserver(
    (entries) => { if (entries[0].isIntersecting) appendBatch(); },
    { rootMargin: '600px' }
  );
  if (sentinel.value) observer.observe(sentinel.value);
});

function getFlatIndex(rowIndex: number, colIndex: number) {
  return rowIndex * colCount.value + colIndex;
}

onUnmounted(() => {
  observer?.disconnect();
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <section class="main-wrapper">

    <div class="title-container">
      <h1 class="hero-title">{{ title }}</h1>
    </div>

    <div class="gallery-container">
      <div class="image-rows">
        <div
          v-for="(row, rowIndex) in rows"
          :key="rowIndex"
          class="image-row"
        >
          <div
            v-for="(item, colIndex) in row"
            :key="item.uid"
            class="image-card"
            :style="getItemStyle(rowIndex, colIndex)"
            @click="handleClick(rowIndex * colCount + colIndex)"
          >
            <img :src="item.src" alt="" loading="lazy" />
          </div>
        </div>
      </div>

      <div ref="sentinel" class="scroll-sentinel" />
    </div>

  </section>
</template>

<style scoped>
.main-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: var(--color-background-2);
}

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
  color: #dd4b24;
  font-family: 'Editorial', serif;
  font-size: clamp(3rem, 11vw, 13rem);
  line-height: 1;
  letter-spacing: -0.02em;
  white-space: nowrap;

  opacity: 0;
  clip-path: inset(0 50% 0 50%);
  animation: titleReveal 2s cubic-bezier(0.77, 0, 0.175, 1) forwards;
}

@keyframes titleReveal {
  0% {
    opacity: 0;
    clip-path: inset(0 50% 0 50%);
  }
  30% {
    opacity: 1;
  }
  100% {
    clip-path: inset(0 0% 0 0%);
    opacity: 1;
  }
}

.gallery-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 4em;
  padding: 0 3.6rem;
  box-sizing: border-box;
}

/* Contenedor vertical de filas */
.image-rows {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .image-rows {
    gap: 7.5rem;
  }
}

/* Cada fila es un flex horizontal */
.image-row {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .image-row {
    gap: 7.5rem;
  }
}

.image-card {
  flex: 1 1 0%;
  min-width: 0;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background-color: #f3f3f3;
  cursor: pointer;

  transition: flex-grow 1.4s cubic-bezier(0.4, 0, 0.2, 1);

  /* 🔥 animación elegante */
  opacity: 0;
  transform: translateY(40px) scale(0.96);
  animation: imageReveal 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 2s; /* respeta el timing del título */
}

/* 👇 esto hace que no todas entren al mismo tiempo */
.image-card:nth-child(1) { animation-delay: 2.05s; }
.image-card:nth-child(2) { animation-delay: 2.1s; }
.image-card:nth-child(3) { animation-delay: 2.15s; }
.image-card:nth-child(4) { animation-delay: 2.2s; }

@keyframes imageReveal {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.image-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.scroll-sentinel {
  height: 100px;
  width: 100%;
}
</style>