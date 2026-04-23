<template>
  <section class="collections-section">
    <CollectionsGrid :items="collections" />
  </section>
</template>

<script setup>
import { ref, onMounted  } from 'vue'
import cmsService from '@/services/cmsService';
import CollectionsGrid from '@/components/collection/CollectionsGrid.vue';

const collections = ref([])

onMounted(async () => {
  const res = await cmsService.getCollections()
  collections.value = res.results
})


</script>

<style scoped>

.collections-section{
  width:100%;
  margin-top: 4.5em;
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

@media (max-width: 768px) {
  .collections-section {
    margin-top: 0;
  }
}

</style>