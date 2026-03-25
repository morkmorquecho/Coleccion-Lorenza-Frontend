<template>
  <section class="w-full h-screen overflow-hidden relative bg-neutral-100">
    <!-- Background Typography -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <h1 class="text-[10vw] font-black tracking-tight text-black/80 select-none">
        HANNAH MODELS
      </h1>
    </div>

    <!-- Grid Container -->
    <div
      ref="scrollContainer"
      class="h-full overflow-y-scroll no-scrollbar"
      @scroll="handleScroll"
    >
      <div
        ref="grid"
        class="grid grid-cols-4 gap-10 p-20"
      >
        <div
          v-for="(img, index) in displayedImages"
          :key="index"
          class="aspect-[3/4] overflow-hidden"
        >
          <img
            :src="img.src"
            :alt="img.alt"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>

    <!-- Bottom Filters -->
    <div class="absolute bottom-10 left-20 flex gap-4">
      <button class="bg-black text-white px-4 py-2 text-sm">OVERVIEW</button>
      <button class="border border-black px-4 py-2 text-sm">MENSWEAR</button>
      <button class="border border-black px-4 py-2 text-sm">COMMERCIAL</button>
    </div>

    <!-- Contact Button -->
    <div class="absolute bottom-10 right-20">
      <button class="border border-black px-6 py-2 text-sm">CONTACT</button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const BASE_IMAGES = [
  { src: '/img/alebrijes/img-1.jpg', alt: 'Altar de muertos' },
  { src: '/img/alebrijes/img-2.jpg', alt: 'Catrina retrato' },
  { src: '/img/alebrijes/img-3.jpg', alt: 'Procesión nocturna' },
  { src: '/img/alebrijes/img-4.jpg', alt: 'Calavera de azúcar' },
  { src: '/img/alebrijes/img-5.JPG', alt: 'Textil bordado' },
  { src: '/img/alebrijes/img-6.JPG', alt: 'Catrina vestimenta' },
  { src: '/img/alebrijes/img-7.JPG', alt: 'Panteón iluminado' },
  { src: '/img/alebrijes/img-8.jpg', alt: 'Flores cempasúchil' },
]

const displayedImages = ref([...BASE_IMAGES, ...BASE_IMAGES])
const scrollContainer = ref(null)

const handleScroll = () => {
  const el = scrollContainer.value
  if (!el) return

  const scrollBottom = el.scrollTop + el.clientHeight

  // Cuando llega al final → duplica contenido
  if (scrollBottom >= el.scrollHeight - 200) {
    displayedImages.value.push(...BASE_IMAGES)
  }

  // Cuando sube mucho → evita crecimiento infinito
  if (displayedImages.value.length > 64) {
    displayedImages.value.splice(0, BASE_IMAGES.length)
    el.scrollTop -= el.scrollHeight / 4
  }
}

onMounted(() => {
  const el = scrollContainer.value
  el.scrollTop = el.scrollHeight / 4
})
</script>

<style>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
  