<template>
  <button 
    class="w-full flex items-center justify-center gap-3 px-6 py-3 
           bg-white/60 hover:bg-white/80 transition-colors 
           border border-white/20 rounded-xl shadow-inner
           text-gray-800 font-medium text-sm"
    @click="$emit('click')"
  >
    <slot name="icon"></slot>
    <span>
      <slot name="text"></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
defineEmits(['click']);
</script>