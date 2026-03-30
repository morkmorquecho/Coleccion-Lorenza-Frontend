<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

const activeIndex = ref<number | null>(null)
const colCount = ref(typeof window !== 'undefined' ? (window.innerWidth >= 768 ? 4 : 2) : 4)

const SCALE_ACTIVE = 2.4
const SCALE_SHRINK = 0.55

interface Props {
  title: string
  photos: string[]
}

const props = defineProps<Props>()

const baseImages = [
  '/img/alebrijes/img-1.jpg',
  '/img/alebrijes/img-2.jpg',
  '/img/alebrijes/img-3.jpg',
  '/img/alebrijes/img-4.jpg',
  '/img/alebrijes/img-5.JPG',
  '/img/alebrijes/img-6.JPG',
  '/img/alebrijes/img-7.JPG',
  '/img/alebrijes/img-8.jpg',
  '/img/alebrijes/img-9.JPG',
  '/img/alebrijes/img-10.JPG',
  '/img/alebrijes/img-11.jpg',
  '/img/alebrijes/img-1.jpg',
]

// Usa props.photos si llega con datos, si no cae a baseImages
const sourceImages = computed(() => props.photos)

const visibleImages = ref<{ src: string; uid: number }[]>([])
let uidCounter = 0
const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null
let imageObserver: IntersectionObserver | null = null
let animationsAllowed = false

const rows = computed(() => {
  const c = colCount.value
  const result: { src: string; uid: number }[][] = []
  for (let i = 0; i < visibleImages.value.length; i += c) {
    result.push(visibleImages.value.slice(i, i + c))
  }
  return result
})

const activeRow = computed(() =>
  activeIndex.value !== null ? Math.floor(activeIndex.value / colCount.value) : null,
)
const activeCol = computed(() =>
  activeIndex.value !== null ? activeIndex.value % colCount.value : null,
)

function handleClick(flatIndex: number) {
  activeIndex.value = activeIndex.value === flatIndex ? null : flatIndex
}

function getItemStyle(rowIndex: number, colIndex: number) {
  if (activeRow.value !== rowIndex) return {}
  if (colIndex === activeCol.value) return { flexGrow: SCALE_ACTIVE }
  return { flexGrow: SCALE_SHRINK }
}

// Observa SOLO las cards que aún no tienen la clase in-view
function setupImageObserver() {
  imageObserver?.disconnect()
  imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          imageObserver?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.2 },
  )

  document.querySelectorAll('.image-card:not(.in-view)').forEach((el) => {
    imageObserver?.observe(el)
  })
}

function appendBatch() {
  const batch = sourceImages.value.map((src) => ({ src, uid: uidCounter++ }))
  visibleImages.value.push(...batch)

  // Re-observar tras cada batch (cubre infinite scroll también)
  nextTick(() => {
    if (animationsAllowed) setupImageObserver()
  })
}

function resetAndLoad() {
  visibleImages.value = []
  uidCounter = 0
  appendBatch()
  appendBatch()
  appendBatch()
}

function handleResize() {
  colCount.value = window.innerWidth >= 768 ? 4 : 2
  activeIndex.value = null
}

onMounted(async () => {
  // Si los datos ya están disponibles (ej. baseImages o props.photos síncrono)
  if (sourceImages.value.length) {
    resetAndLoad()
  }

  window.addEventListener('resize', handleResize)

  await nextTick()

  window.scrollTo({
    top: window.innerHeight * 0.17,
    behavior: 'instant',
  })

  // Sentinel para infinite scroll
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) appendBatch()
    },
    { rootMargin: '600px' },
  )
  if (sentinel.value) observer.observe(sentinel.value)

  // El texto tarda 2s en aparecer, esperamos 3s adicionales (total 5000ms)
  setTimeout(() => {
    animationsAllowed = true
    setupImageObserver()
  }, 1950)
})

onUnmounted(() => {
  observer?.disconnect()
  imageObserver?.disconnect()
  window.removeEventListener('resize', handleResize)
})

// Reacciona cuando props.photos llega de forma asíncrona (ej. fetch del padre)
watch(
  () => props.photos,
  (newPhotos) => {
    if (newPhotos?.length && visibleImages.value.length === 0) {
      resetAndLoad()
    }
  },
  { immediate: true },
)
</script>

<template>
  <section class="main-wrapper">
    <div class="title-container">
      <h1 class="hero-title uppercase">{{ props.title }}</h1>
    </div>

    <div class="gallery-container">
      <div class="image-rows">
        <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="image-row">
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
  font-family: 'Editorial', 'COM4DL', serif;
  font-size: clamp(3rem, 11vw, 13rem);
  line-height: 1;
  letter-spacing: -0.01em;
  white-space: nowrap;
  padding-left: 0.06em;
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

  opacity: 0;
  transform: translateY(40px) scale(0.96);
}

.image-card.in-view {
  animation: imageReveal 3.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

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
