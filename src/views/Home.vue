<template>
  <div class="home">
    <div class="carousels-wrap">

      <!-- Separadores decorativos entre carruseles -->
      <div class="sep sep--1" aria-hidden="true"></div>
      <div class="sep sep--2" aria-hidden="true"></div>

      <VerticalCarousel :slides=carrusel1 :delay="0"    phrase="ARTE"  />
      <VerticalCarousel :slides=carrusel2 :delay="1500" phrase="MEXICANO" class="hide-mobile" />
      <VerticalCarousel :slides=carrusel3 :delay="3000" phrase="EN PAPEL" class="hide-mobile" />

    </div>

    <div class="btn-explorer flex justify-center">
      <DiscoverButton/>
    </div>

    <div
      data-aos="fade-down"
      data-aos-easing="linear"
      data-aos-duration="1300"
      data-aos-delay="200"
      class="phrase"
    >

      <PhraseComponent
        quote="El arte popular es la raíz más profunda de la identidad cultural de un pueblo"
        author="DIEGO RIVERA"
      />
    </div>

    <div class="highlithed"
      data-aos="fade-right"
      data-aos-easing="linear"
      data-aos-duration="700"
      data-aos-delay="50"
      data-aos-once="true">
          <HighlightedComponent/>
    </div>

    <div class=""
      data-aos="fade-left"
      data-aos-easing="linear"
      data-aos-duration="700"
      data-aos-delay="50"
      data-aos-once="true">
      <ColecctionComponent/>
    </div>

    <!-- <BlogCard
      image="/img/alebrijes/img-1.jpg"
      section="Día de Muertos"
      title="El arte popular es la raíz de la identidad cultural"
      excerpt="Cuando el arte y la tradición se fusionan, nace algo que trasciende generaciones..."
    /> -->

    <BlogCarousel/>

    <div class="">
      <AppFooter/>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import VerticalCarousel from '@/components/home/VerticalCarousel.vue'
import PhraseComponent from '@/components/home/PhraseComponent.vue'
import DiscoverButton from '@/components/home/DiscoverButton.vue'
import HighlightedComponent from '@/components/home/HighlightedComponent.vue'
import AppFooter from '@/components/home/AppFooter.vue'
import ColecctionComponent from '@/components/home/ColecctionComponent.vue'
import BlogCarousel from '@/components/home/BlogCarousel.vue'


const BASE = import.meta.env.VITE_R2_URL

const carrusel1 = Array.from({ length: 5 }, (_, i) => ({
  image: `${BASE}/carrusel/1/img-${i + 1}.jpg`
}))
const carrusel2 = Array.from({ length: 5 }, (_, i) => ({
  image: `${BASE}/carrusel/2/img-${i + 1}.jpg`
}))
const carrusel3 = Array.from({ length: 5 }, (_, i) => ({
  image: `${BASE}/carrusel/3/img-${i + 1}.jpg`
}))
</script>


<style scoped>
*, *::before, *::after {
  box-sizing: border-box;
}

.home {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.carousels-wrap {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 3rem;
}

.btn-explorer {
  margin-top: 3rem;
  margin-bottom: 5rem;
}

/* ✅ Contenedor de la frase: ancla el componente al ancho real de la página */
.phrase {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.highlithed {
  margin-top: 4rem;
  margin-bottom: 2rem;
}


.sep {
  position: absolute;
  top: 5%; bottom: 5%;
  width: 1px;
  pointer-events: none;
  z-index: 10;
}

.sep--1 {
  left: 33.333%;
  background: linear-gradient(to bottom, transparent, rgba(221,75,36,0.25) 20%, rgba(221,75,36,0.25) 80%, transparent);
}

.sep--2 {
  left: 66.666%;
  background: linear-gradient(to bottom, transparent, rgba(221,75,36,0.25) 20%, rgba(221,75,36,0.25) 80%, transparent);
}

@media (max-width: 768px) {
  .carousels-wrap {
    grid-template-columns: 1fr;
    height: 100vh;
  }
  .sep         { display: none; }
  .hide-mobile { display: none; }
}
</style>