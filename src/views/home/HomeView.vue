<template>
  <div class="home">
    <div class="carousels-wrap">

      <!-- Separadores decorativos entre carruseles -->
      <div class="sep sep--1" aria-hidden="true"></div>
      <div class="sep sep--2" aria-hidden="true"></div>

      <HomeVerticalCarousel :slides=carrusel1 :delay="0"    phrase="ARTE"  />
      <HomeVerticalCarousel :slides=carrusel2 :delay="1500" phrase="MEXICANO" class="hide-mobile" />
      <HomeVerticalCarousel :slides=carrusel3 :delay="3000" phrase="EN PAPEL" class="hide-mobile" />

    </div>

    <div class="btn-explorer flex justify-center">
      <HomeDiscoverButton/>
    </div>

    <div
      data-aos="fade-down"
      data-aos-easing="linear"
      data-aos-duration="1300"
      data-aos-delay="200"
      class="phrase"
    >

      <HomePhrase
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
          <HomeFeaturedPieces/>
    </div>

    <div class=""
      data-aos="fade-left"
      data-aos-easing="linear"
      data-aos-duration="1200"
      data-aos-delay="50"
      data-aos-offset="200"
      data-aos-once="true">
      <CollectionsGrid :items="collections" />
    </div>

     <!-- <BlogCard
      image="/img/alebrijes/img-1.jpg"
      section="Día de Muertos"
      title="El arte popular es la raíz de la identidad cultural"
      excerpt="Cuando el arte y la tradición se fusionan, nace algo que trasciende generaciones..."
    />  -->

  <div
    data-aos="fade-down"
    data-aos-easing="linear"
    data-aos-offset="500"
    data-aos-duration="1000"
    data-aos-delay="800"
    data-aos-once="true"
  >
      <HomeBlogPreview/>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import cmsService from '@/services/cmsService'
import HomeVerticalCarousel from './components/HomeVerticalCarousel.vue'
import HomePhrase from './components/HomePhrase.vue'
import HomeDiscoverButton from './components/HomeDiscoverButton.vue'
import HomeFeaturedPieces from './components/HomeFeaturedPieces.vue'
import AppFooter from '@/components/AppFooter.vue'
import CollectionsGrid from '@/components/collection/CollectionsGrid.vue'
import HomeBlogPreview from './components/HomeBlogPreview.vue'

import BlogCard from '@/components/blog/BlogCard.vue'
const collections = ref([])

onMounted(async () => {
  const res = await cmsService.getCollections({ featured: true})
  collections.value = res.results
})

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
  /* margin-top: 5.8rem; */
}

.btn-explorer {
  margin-top: 3rem;
  margin-bottom: 5rem;
}

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
    /* margin-top: 3.3rem; */
  }
  .sep         { display: none; }
  .hide-mobile { display: none; }
}
</style>