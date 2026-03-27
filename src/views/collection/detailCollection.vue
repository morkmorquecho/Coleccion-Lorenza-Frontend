<template>
  <Gallery :title="title" :photos="photos" />
</template>

<script setup>
import { ref, onMounted  } from 'vue'
import cmsService from '@/services/cmsService';
import Gallery from '@/components/ui/gallery.vue';
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

.collections-section{
  width:100%;
  margin-top: 2.5em;
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