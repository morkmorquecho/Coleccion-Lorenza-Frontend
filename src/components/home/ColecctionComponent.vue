<template>
  <section class="collections-section">
    <CollectionsGrid :items="collections" />
  </section>
</template>

<script setup>
import { ref, onMounted  } from 'vue'
import CollectionsGrid from '../shared/CollectionsGrid.vue';
import cmsService from '@/services/cmsService';

const collections = ref([])

onMounted(async () => {
  const res = await cmsService.getCollections({ featured: true })
  collections.value = res.results
})

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