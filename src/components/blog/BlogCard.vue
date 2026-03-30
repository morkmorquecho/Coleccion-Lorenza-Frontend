<template>
  <article class="blog-card" :class="{ 'is-hovered': hovered }" @mouseenter="hovered = true" @mouseleave="hovered = false">
    <div class="card-image-wrap">
      <img :src="image" :alt="title" class="card-image" />
      <div class="image-overlay" />
    </div>
    <div class="card-body">
      <span class="card-section">{{ section }}</span>
      <h2 class="card-title">{{ title }}</h2>
      <p class="card-excerpt">{{ excerpt }}</p>
    </div>
  </article>
</template>

<script setup>
import { ref } from 'vue'
defineProps({
  image: { type: String, required: true },
  section: { type: String, default: 'Cultura' },
  title: { type: String, required: true },
  excerpt: { type: String, required: true }
})
const hovered = ref(false)
</script>

<style scoped>
@font-face {
  font-family: 'COM4DL';
  src: url('/fonts/COM4DL__.TTF') format('truetype');
  font-weight: normal;
  font-style: normal;
}

.blog-card {
  font-family: 'COM4DL', Georgia, serif;
  display: flex;
  flex-direction: column;
  background: var(--color-principal);
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  width: 100%;
  max-width: 420px;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.blog-card:hover {
  transform: translateY(-4px);
}

/* ── Image ── */
.card-image-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition:
    transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    filter 0.65s ease;
  filter: saturate(1) brightness(1);
}

.blog-card:hover .card-image {
  transform: scale(1.06);
  filter: saturate(1.1) brightness(1.03) sepia(0.18);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 94, 31, 0);
  mix-blend-mode: overlay;
  transition: background 0.65s ease;
  pointer-events: none;
}


.blog-card:hover .image-overlay {
  background: rgba(255, 94, 31, 0.22);
}

/* ── Body ── */
.card-body {
  padding: 20px 0 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-section {
  font-family: 'COM4DL', Georgia, serif;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #ff5e1f;
  transition: color 0.4s ease;
  line-height: 1;
}

.blog-card:hover .card-section {
  color: #ff5e1f;
}

.card-title {
  font-family: 'COM4DL', Georgia, serif;
  font-size: clamp(18px, 2.2vw, 22px);
  font-weight: 700;
  line-height: 1.3;
  color: #1a1008;
  margin: 0;
  transition: color 0.4s ease;
}

.blog-card:hover .card-title {
  color: #ff5e1f;
}

.card-excerpt {
  font-family: 'COM4DL', Georgia, serif;
  font-size: 14px;
  line-height: 1.65;
  color: #6b5e52;
  margin: 0;
  display: -webkit-box;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.4s ease;
}

.blog-card:hover .card-excerpt {
  color: #e04a10;
}
</style>