<template>
  <RouterView v-slot="{ Component, route }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="route.meta.layout" />
    </Transition>
  </RouterView>
</template>

