<template>
  <div class="absolute inset-0 z-0">
    <vue-particles id="tsparticles" :options="options" />
  </div>
</template>

<script setup>
import { ref } from "vue";

const options = ref({
  fullScreen: false,
  background: {
    color: "transparent",
  },
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        area: 800,
      },
    },
    color: {
      value: "#dd4b24",
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.35,
      random: true,
    },
    size: {
      value: { min: 1, max: 3 },
    },
    move: {
      enable: true,
      speed: 0.7,
      direction: "none",
      outModes: {
        default: "out",
      },
    },
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "repulse",
      },
    },
    modes: {
      repulse: {
        distance: 80,
      },
    },
  },
});
</script>