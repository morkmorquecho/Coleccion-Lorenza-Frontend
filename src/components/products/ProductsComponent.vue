<template>
  <!--
    Ejemplo: página de catálogo usando ProductGrid con cols=3
    Aquí se ven 3 columnas en desktop y carousel en mobile.
    Las cards se auto-distribuyen en filas según la cantidad de productos.
  -->
  <section class="catalog">
    <ProductGrid
      :products="products"
      :cols="4"
      :gap="20"
      @add="onAdd"
    />
  </section>
</template>

<script>
import ProductGrid from './ProductGrid.vue';

export default {
  name: 'CatalogExample',
  components: { ProductGrid },

  setup() {
    // Puedes poner tantos productos como quieras;
    // el grid los distribuye automáticamente en filas de 3.
    const products = [
      { name: 'Pieza 1', section: 'Dia de muertos', priceOld: '$105', price: '$84',  image: '/img/alebrijes/img-1.jpg', video: '/video/1.mp4' },
      { name: 'Pieza 2', section: 'Dia de muertos', priceOld: '$100', price: '$80',  image: '/img/alebrijes/img-2.jpg', video: '/video/2.mp4' },
      { name: 'Pieza 3', section: 'Dia de muertos', priceOld: '$100', price: '$70',  image: '/img/alebrijes/img-3.jpg', video: '/video/3.mp4' },
      { name: 'Pieza 4', section: 'Dia de muertos', priceOld: '$140', price: '$98',  image: '/img/alebrijes/img-4.jpg', video: '/video/4.mp4' },
    ]

    function onAdd(product) {
      console.log('Agregar al carrito:', product)
    }

    return { products, onAdd }
  },
}
</script>

<style scoped>
@font-face {
  font-family: 'COM4DL';
  src: url('/fonts/COM4DL__.TTF') format('truetype');
}

.catalog {
  padding: 32px 24px;
  max-width: 1400px;
  margin: 0 auto;
  background: var(--color-background);
}

.catalog-title {
  font-family: 'COM4DL', serif;
  font-size: clamp(22px, 3vw, 36px);
  color: #1c1a17;
  font-weight: 400;
  margin: 0 0 28px;
}

@media (max-width: 767px) {
  .catalog {
    padding: 20px 0 16px;
  }

  .catalog-title {
    padding: 0 20px;
  }
}
</style>