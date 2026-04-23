<template>
  <div class="wrapper-gallery">
      <CollectionGallery :title="title" :photos="photos" />
  </div>
</template>

<script setup>
import { ref, onMounted  } from 'vue'
import cmsService from '@/services/cmsService';
import CollectionGallery from './components/CollectionGallery.vue';
import { useRoute } from 'vue-router'

const route = useRoute()
const photos = ref([])
const title = ref('')

onMounted(async () => {
  const res = await cmsService.getCollection(route.params.name)

  title.value = res.name
  photos.value = res.images.map(img => img.image_path)
  console.log(photos.value)
})


</script>

<style scoped>

.wrapper-gallery {
  background: var(--color-background-2);
  padding-top: 10em; /* Ajusta este valor según necesites */
  min-height: 100vh;
}


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