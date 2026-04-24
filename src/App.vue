<script setup>
import { computed } from 'vue'
import { useUIStore } from '@/stores/ui'
import ModalComponent from '@/components/ui/ModalComponent.vue'
import LottiePlayer from './components/ui/LottiePlayer.vue'
import CartDrawer from './components/cart/CartDrawer.vue'
const ui = useUIStore()

const showModal = computed({
  get: () => ui.modal.show,
  set: (val) => { ui.modal.show = val }
})
</script>

<template>
  <ModalComponent
    v-model="showModal"
    :title="ui.modal.title"
    :subtitle="ui.modal.message"
    @close="ui.closeModal()"
  >
    <template v-if="ui.modal.animation" #lottie>
      <LottiePlayer :path="ui.modal.animation" />
    </template>
  </ModalComponent>

  <RouterView v-slot="{ Component, route }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="route.meta.layout" />
    </Transition>
  </RouterView>

  <CartDrawer />

</template>