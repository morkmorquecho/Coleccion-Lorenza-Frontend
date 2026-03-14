<template>
  <div class="home">
    <div class="carousels-wrap">

      <!-- Separadores decorativos entre carruseles -->
      <div class="sep sep--1" aria-hidden="true"></div>
      <div class="sep sep--2" aria-hidden="true"></div>

      <VerticalCarousel :slides="carousels[0]" :delay="0"    phrase="ARTE"  />
      <VerticalCarousel :slides="carousels[1]" :delay="1500" phrase="MEXICANO" class="hide-mobile" />
      <VerticalCarousel :slides="carousels[2]" :delay="3000" phrase="EN PAPEL" class="hide-mobile" />

    </div>

    <div class="btn-explorer flex justify-center">
      <DiscoverButton/>
    </div>

    <div
     data-aos="fade-down"
     data-aos-easing="linear"
     data-aos-duration="1300"
     data-aos-delay="200"
      class="phrase ">

      <PhraseComponent
        quote="El arte popular es la raíz más profunda de la identidad cultural de un pueblo"
        author="DIEGO RIVERA"
      />
    </div>

  </div>
</template>

<script>
import VerticalCarousel from '@/components/ui/VerticalCarousel.vue'
import PhraseComponent from '@/components/ui/PhraseComponent.vue';
import DiscoverButton from '@/components/ui/DiscoverButton.vue';

export default {
  name: 'HomeView',

  components: {
    VerticalCarousel,
    PhraseComponent,
    DiscoverButton,
  },

  data() {
    return {
      carousels: [
        [
          { image: '/img/alebrijes/img-1.jpg' },
          { image: '/img/alebrijes/img-2.jpg' },
          { image: '/img/alebrijes/img-3.jpg' },
        ],
        [
          { image: '/img/alebrijes/img-4.jpg' },
          { image: '/img/alebrijes/img-5.JPG' },
          { image: '/img/alebrijes/img-6.JPG' },
          { image: '/img/alebrijes/img-7.JPG' },
        ],
        [
          { image: '/img/alebrijes/img-8.jpg' },
          { image: '/img/alebrijes/img-9.JPG' },
          { image: '/img/alebrijes/img-10.JPG' },
        ],
      ]
    }
  }
}
</script>

<style scoped>
/* ✅ box-sizing para que padding/border no expandan el ancho */
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