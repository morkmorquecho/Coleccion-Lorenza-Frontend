<template>
  <div ref="container" style="width:100%;height:100%"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import lottie from 'lottie-web'

const props = defineProps({
  path: String
})

const container = ref(null)
let anim = null

onMounted(() => {
  anim = lottie.loadAnimation({
    container: container.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: props.path
  })
})

onBeforeUnmount(() => {
  anim?.destroy()
})
</script>