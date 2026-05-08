<script setup>
import { computed, onMounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import ModalComponent from '@/components/ui/ModalComponent.vue'
import LottiePlayer from './components/ui/LottiePlayer.vue'
import CartDrawer from './components/cart/CartDrawer.vue'
import { useCurrencyStore } from '@/stores/currency'
import ordersService from './services/ordersService'

const currencyStore = useCurrencyStore()
const ui = useUIStore()

const showModal = computed({
  get: () => ui.modal.show,
  set: (val) => { ui.modal.show = val }
})

onMounted(async () => {
  const data = await ordersService.getUsdRate()
  currencyStore.setRate(data.usd_to_mxn)
})

function handleModalAction() {
  ui.modal._callback?.confirm?.()
  ui.closeModal()
}

function handleModalCancel() {
  ui.modal._callback?.cancel?.()
  ui.closeModal()
}
</script>

<template>
  <ModalComponent
    v-model="showModal"
    :title="ui.modal.title"
    :subtitle="ui.modal.message"
    :confirm-text="ui.modal.buttonText || 'Confirmar'"
    :cancel-text="ui.modal.cancelText"
    :show-cancel="ui.modal.showCancelButton"
    @confirm="handleModalAction"
    @close="ui.closeModal()"
  >
    <template v-if="ui.modal.animation" #lottie>
      <LottiePlayer :path="ui.modal.animation" />
    </template>
  </ModalComponent>

  <RouterView v-slot="{ Component, route }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="route.meta.layout + currencyStore.currency" />
    </Transition>
  </RouterView>

  <CartDrawer />

</template>