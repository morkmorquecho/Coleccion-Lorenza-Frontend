<template>
  <div class="home">
    <div class="carousels-wrap">

      <!-- Separadores decorativos entre carruseles -->
      <div class="sep sep--1" aria-hidden="true"></div>
      <div class="sep sep--2" aria-hidden="true"></div>

      <!-- Los 3 carruseles, cada uno con sus slides y delay distinto
           para que no avancen al mismo tiempo                        -->
      <VerticalCarousel :slides="carousels[0]" :delay="0"    />
      <VerticalCarousel :slides="carousels[1]" :delay="1500" />
      <VerticalCarousel :slides="carousels[2]" :delay="3000" />

    </div>
  </div>
</template>

<script>
import VerticalCarousel from '@/components/ui/VerticalCarousel.vue'

export default {
  name: 'HomeView',

  components: {
    VerticalCarousel
  },

  data() {
    return {
      // Cada slide es un objeto con "image".
      // Cuando tengas las fotos pon la ruta aquí:
      // { image: '/img/alebrijes/alebrije-1.jpg' }
      // Con image vacío muestra fondo oscuro placeholder.
      carousels: [
        [
          { image: '' },
          { image: '' },
          { image: '' },
        ],
        [
          { image: '' },
          { image: '' },
          { image: '' },
          { image: '' },
        ],
        [
          { image: '' },
          { image: '' },
          { image: '' },
        ],
      ]
    }
  }
}
</script>

<style scoped>
.home {
  width: 100%;
  overflow: hidden;
}

.carousels-wrap {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 100vh;
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
    grid-template-rows: repeat(3, 100vh);
    height: auto;
  }
  .sep { display: none; }
}
</style>