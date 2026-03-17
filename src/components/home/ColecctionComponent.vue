<template>
  <section class="collections-section">
    <CollectionsGrid :items="collections" />
  </section>
</template>

<script setup>
import CollectionsGrid from '../shared/CollectionsGrid.vue';
const collections = [
  {
    name: "Colección Dasher",
    image: "/img/alebrijes/img-10.JPG",
    description:
      "Ligereza y estilo para el día a día. La Colección Dasher combina materiales naturales con una silueta urbana."
  },
  {
    name: "Colección Varsity",
    image: "/img/alebrijes/img-11.jpg",
    description:
      "Inspirada en el ritmo de la ciudad. La Colección Varsity redefine el calzado casual."
  },
  {
    name: "Colección Terralux",
    image: "/img/alebrijes/img-9.JPG",
    description:
      "Para quienes van más allá del asfalto. La Colección Terralux ofrece tracción y durabilidad."
  }
]
</script>

<style scoped>

.collections-section{
  width:100%;
}

/* título */
.collections-title{
  max-width:1500px;
  margin:0 auto 28px auto;
  padding:0 24px;

  font-family:'COM4DL', serif;
  font-size:clamp(2rem,3vw,2.6rem);
  font-weight:400;
  letter-spacing:-0.02em;

  color:#111;
}

</style>