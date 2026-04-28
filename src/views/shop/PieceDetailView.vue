<template>
  <div class="piece-detail" v-if="pieceDetail">
    <div class="detail-container">
      <!-- Left: Gallery Section -->
      <div class="gallery-section">
        <!-- Thumbnail Grid - Left Side (Desktop) -->
        <div class="thumbnail-grid-vertical">
          <button
            v-for="(item, index) in galleryItems"
            :key="index"
            class="thumbnail-item-vertical"
            :class="{ active: currentImageIndex === index, 'is-video': item.type === 'video' }"
            @click="currentImageIndex = index"
          >
            <img v-if="item.type === 'image'" :src="item.src" :alt="`${pieceDetail.title} - Image ${index + 1}`" />
            <div v-else class="video-thumb-vertical">
              <img :src="pieceDetail.thumbnail_path" :alt="`${pieceDetail.title} - Video`" />
              <div class="video-play-icon-vertical">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
            </div>
          </button>
        </div>

        <!-- Main Image/Video Container -->
        <div 
          ref="mainContainer"
          class="main-image-container"
          @mousemove="handleMouseMove"
          @mouseleave="handleMouseLeave"
          @click="handleImageClick"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <!-- Image Display -->
          <img 
            v-if="currentItem?.type === 'image'"
            :src="currentItem?.src" 
            :alt="pieceDetail.title"
            class="main-image"
          />
          <!-- Video Display -->
          <video 
            v-else-if="currentItem?.type === 'video'"
            ref="videoPlayer"
            :src="currentItem?.src" 
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
            class="main-video"
            :poster="pieceDetail.thumbnail_path"
            controlslist="nodownload nofullscreen noremoteplayback"
            disablepictureinpicture
          />
          
          <!-- Elegant Arrow Cursor -->
          <div 
            v-if="showArrow"
            class="arrow-cursor-elegant"
            :style="arrowStyle"
          >
            <div class="arrow-circle">
              <svg 
                v-if="arrowDirection === 'left'" 
                xmlns="http://www.w3.org/2000/svg" 
                width="36" 
                height="36" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="white" 
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              <svg 
                v-else 
                xmlns="http://www.w3.org/2000/svg" 
                width="36" 
                height="36" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="white" 
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          </div>

          <!-- Video Controls Overlay -->
          <div v-if="currentItem?.type === 'video'" class="video-controls">
            <button @click.stop="toggleVideoPlayback" class="video-control-btn">
              <svg v-if="isVideoPlaying" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </button>
          </div>

          <!-- Image Counter -->
          <div class="image-counter">
            {{ currentImageIndex + 1 }} / {{ galleryItems.length }}
          </div>
        </div>
      </div>

      <!-- Right: Info Section -->
      <div class="info-section">
        <!-- Type & Section Tags -->
        <div class="tags-row">
          <span class="tag tag-type">
            {{ pieceDetail.type }}
          </span>
          <span class="tag tag-section">
            {{ pieceDetail.section }}
          </span>
          <span v-if="pieceDetail.customizable" class="tag tag-custom">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
            </svg>
            Personalizable
          </span>
        </div>

        <!-- Title -->
        <h1 class="piece-title">{{ pieceDetail.title }}</h1>

        <!-- Price -->
        <div class="price-container">
          <span v-if="pieceDetail.has_discount" class="original-price font-prices">
            ${{ formatPrice(pieceDetail.original_price_base) }} MXN
          </span>
          <span class="final-price font-prices" :class="{ 'has-discount': pieceDetail.has_discount }">
            ${{ formatPrice(pieceDetail.final_price_base) }} MXN
          </span>
          <span v-if="pieceDetail.has_discount" class="discount-badge">
            -{{ pieceDetail.discount_percentage }}%
          </span>
        </div>

        <!-- Description -->
        <div class="description-block">
          <h3 class="section-title">About this piece</h3>
          <p class="description-text">{{ pieceDetail.description }}</p>
        </div>

        <!-- Specifications -->
        <div class="specs-block">
          <h3 class="section-title">Specifications</h3>
          <div class="specs-grid">
            <div class="spec-item">
              <span class="spec-label">Width</span>
              <span class="spec-value">{{ pieceDetail.width }} cm</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Height</span>
              <span class="spec-value">{{ pieceDetail.height }} cm</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Length</span>
              <span class="spec-value">{{ pieceDetail.length }} cm</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Weight</span>
              <span class="spec-value">{{ pieceDetail.weight }} kg</span>
            </div>
          </div>
        </div>

        <!-- Availability -->
        <div class="availability-block">
          <div class="stock-indicator" :class="pieceDetail.quantity > 0 ? 'in-stock' : 'out-stock'">
            <span class="stock-dot"></span>
            <span v-if="pieceDetail.quantity > 0">
              {{ pieceDetail.quantity }} {{ pieceDetail.quantity === 1 ? 'piece' : 'pieces' }} available
            </span>
            <span v-else>Out of stock</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="actions-block">
          <button class="btn-primary" 
            :disabled="pieceDetail.quantity === 0"
            @click.stop="handleAdd"
          >

            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            Añadir a la cesta
          </button>
          <button class="btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </button>
        </div>

        <!-- Featured Badge -->
        <div v-if="pieceDetail.featured" class="featured-indicator">
          <span class="featured-line"></span>
          <span class="featured-text">Pieza Destacada</span>
          <span class="featured-line"></span>
        </div>
      </div>
    </div>

    <!-- Thumbnails Horizontal para Mobile -->
   
  </div>
  <div v-else class="loading">
    Cargando...
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import piecesService from '@/services/piecesService'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const pieceDetail = ref(null)
const photos = ref(null)
const route = useRoute()

onMounted(async () => {
  pieceDetail.value = await piecesService.getPiece(route.params.slug)
  const response = await piecesService.getPhotos(route.params.slug)
  photos.value = response.results
})

const galleryItems = computed(() => {
  if (!pieceDetail.value) return []

  const items = []

  // 1. Thumbnail siempre primero
  items.push({ type: 'image', src: pieceDetail.value.thumbnail_path })

  // 2. Video en segunda posición si existe
  if (pieceDetail.value.intro_video) {
    items.push({ type: 'video', src: pieceDetail.value.intro_video })
  }

  // 3. Resto de fotos ordenadas por position
  if (photos.value && photos.value.length > 0) {
    const sortedPhotos = [...photos.value].sort((a, b) => a.position - b.position)
    sortedPhotos.forEach(photo => {
      items.push({ type: 'image', src: photo.image_path })
    })
  }

  return items
})

const currentImageIndex = ref(0)
const currentItem = computed(() => galleryItems.value[currentImageIndex.value])
const videoPlayer = ref(null)
const isVideoPlaying = ref(true)
const mainContainer = ref(null)

// Video playback control
function toggleVideoPlayback() {
  if (videoPlayer.value) {
    if (videoPlayer.value.paused) {
      videoPlayer.value.play()
      isVideoPlaying.value = true
    } else {
      videoPlayer.value.pause()
      isVideoPlaying.value = false
    }
  }
}

// Watch for video item changes
watch(currentImageIndex, async (newIndex) => {
  if (galleryItems.value[newIndex]?.type === 'video') {
    await nextTick()
    if (videoPlayer.value) {
      videoPlayer.value.play()
      isVideoPlaying.value = true
    }
  }
})

// Arrow cursor logic
const showArrow = ref(false)
const arrowDirection = ref('right')
const mouseX = ref(0)
const mouseY = ref(0)

const arrowStyle = computed(() => ({
  left: `${mouseX.value}px`,
  top: `${mouseY.value}px`
}))

function handleMouseMove(event) {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = event.clientX - rect.left
  const centerX = rect.width / 2
  
  mouseX.value = event.clientX - rect.left
  mouseY.value = event.clientY - rect.top
  
  arrowDirection.value = x < centerX ? 'left' : 'right'
  showArrow.value = true
}

function handleMouseLeave() {
  showArrow.value = false
}

function handleImageClick() {
  if (arrowDirection.value === 'left') {
    currentImageIndex.value = currentImageIndex.value > 0 
      ? currentImageIndex.value - 1 
      : galleryItems.value.length - 1
  } else {
    currentImageIndex.value = currentImageIndex.value < galleryItems.value.length - 1 
      ? currentImageIndex.value + 1 
      : 0
  }
}

// Touch swipe logic for mobile
let touchStartX = 0
let touchEndX = 0
const minSwipeDistance = 50

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX
}

function handleTouchMove(event) {
  touchEndX = event.touches[0].clientX
}

function handleTouchEnd() {
  const swipeDistance = touchEndX - touchStartX
  
  if (Math.abs(swipeDistance) > minSwipeDistance) {
    if (swipeDistance > 0) {
      currentImageIndex.value = currentImageIndex.value > 0 
        ? currentImageIndex.value - 1 
        : galleryItems.value.length - 1
    } else {
      currentImageIndex.value = currentImageIndex.value < galleryItems.value.length - 1 
        ? currentImageIndex.value + 1 
        : 0
    }
  }
  
  touchStartX = 0
  touchEndX = 0
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

const cartStore = useCartStore()

function handleAdd() {
  if (pieceDetail.value.quantity === 0) return
  
  // Agregar al carrito
  cartStore.addItem({
    id: pieceDetail.value.id,
    slug: pieceDetail.value.slug,
    title: pieceDetail.value.title,
    thumbnail_path: pieceDetail.value.thumbnail_path,
    final_price_base: pieceDetail.value.final_price_base
  }, 1)
  
  // ABRIR EL CARRITO AUTOMÁTICAMENTE
  cartStore.openCart()
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

.piece-detail {
  min-height: 100vh;
  background: var(--color-background);
  padding: 2rem 4rem 4rem;
  font-family: 'Inter', sans-serif;
  margin-top: 6em;
}

/* Main Container */
.detail-container {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 4rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Gallery Section with horizontal layout */
.gallery-section {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

/* Vertical Thumbnail Grid - Left Side (Desktop only) */
.thumbnail-grid-vertical {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 80px;
  flex-shrink: 0;
}

.thumbnail-item-vertical {
  width: 80px;
  height: 80px;
  border: 2px solid transparent;
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #e8e2d9;
  padding: 0;
  flex-shrink: 0;
}

.thumbnail-item-vertical img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.thumbnail-item-vertical:hover img,
.thumbnail-item-vertical.active img {
  opacity: 1;
}

.thumbnail-item-vertical.active {
  border-color: #c4501a;
  box-shadow: 0 0 0 2px rgba(196, 80, 26, 0.2);
}

/* Video Thumbnail Vertical */
.video-thumb-vertical {
  position: relative;
  width: 100%;
  height: 100%;
}

.video-thumb-vertical img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-play-icon-vertical {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 28px;
  height: 28px;
  background: rgba(196, 80, 26, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: all 0.2s ease;
}

.thumbnail-item-vertical.is-video:hover .video-play-icon-vertical {
  background: #c4501a;
  transform: translate(-50%, -50%) scale(1.1);
}

.thumbnail-item-vertical.is-video.active .video-play-icon-vertical {
  background: #c4501a;
}

/* Horizontal Thumbnail Grid - Mobile only */
.thumbnail-grid-horizontal {
  display: none;
  gap: 0.5rem;
  margin-top: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: thin;
}

.thumbnail-item-horizontal {
  width: 70px;
  height: 70px;
  flex-shrink: 0;
  border: 2px solid transparent;
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #e8e2d9;
  padding: 0;
}

.thumbnail-item-horizontal img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.thumbnail-item-horizontal:hover img,
.thumbnail-item-horizontal.active img {
  opacity: 1;
}

.thumbnail-item-horizontal.active {
  border-color: #c4501a;
  box-shadow: 0 0 0 2px rgba(196, 80, 26, 0.2);
}

.video-thumb-horizontal {
  position: relative;
  width: 100%;
  height: 100%;
}

.video-thumb-horizontal img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-play-icon-horizontal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background: rgba(196, 80, 26, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: all 0.2s ease;
}

/* Main Image Container */
.main-image-container {
  flex: 1;
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: 1.5rem;
  overflow: hidden;
  background: #e8e2d9;
  cursor: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 20px 40px -10px rgba(139, 115, 85, 0.15);
  width: 80%;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.main-image-container:hover .main-image {
  transform: scale(1.02);
}

.main-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #2d2a26;
}

/* Hide default video controls */
.main-video::-webkit-media-controls {
  display: none !important;
}

.main-video::-webkit-media-controls-enclosure {
  display: none !important;
}

/* Elegant Arrow Cursor */
.arrow-cursor-elegant {
  position: absolute;
  pointer-events: none;
  z-index: 10;
}

.arrow-circle {
  width: 56px;
  height: 56px;
  background:var(--color-primary);
  backdrop-filter: blur(8px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.arrow-circle svg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* Custom video controls */
.video-controls {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  z-index: 10;
}

.video-control-btn {
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
}

.video-control-btn:hover {
  background: rgba(196, 80, 26, 0.9);
  transform: scale(1.05);
}

.image-counter {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: #2d2a26;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Right Info Section */
.info-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Tags */
.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  transition: all 0.2s ease;
}

.tag-type {
  background: linear-gradient(135deg, #2d2a26 0%, #3d3a36 100%);
  color: #fff;
  box-shadow: 0 2px 8px rgba(45, 42, 38, 0.2);
}

.tag-section {
  background: linear-gradient(135deg, #f5f0e8 0%, #e8e2d9 100%);
  color: #5c5347;
  border: 1px solid #d9d0c3;
}

.tag-custom {
  background: linear-gradient(135deg, #c4501a 0%, #e07a3a 100%);
  color: #fff;
  box-shadow: 0 2px 8px rgba(196, 80, 26, 0.25);
  animation: subtle-glow 3s ease-in-out infinite;
}

@keyframes subtle-glow {
  0%, 100% { box-shadow: 0 2px 8px rgba(196, 80, 26, 0.25); }
  50% { box-shadow: 0 2px 12px rgba(196, 80, 26, 0.4); }
}

/* Title */
.piece-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 3.5rem;
  font-weight: 600;
  color: #2d2a26;
  text-transform: capitalize;
  line-height: 1.1;
  margin: 0;
}

/* Price */
.price-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.original-price {
  font-size: 1.1rem;
  color: #8b7355;
  text-decoration: line-through;
}

.final-price {
  font-size: 2rem;
  font-weight: 600;
  color: #2d2a26;
}

.final-price.has-discount {
  color: #c4501a;
}

.discount-badge {
  background: #c4501a;
  color: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Section Titles */
.section-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d2a26;
  margin: 0 0 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Description */
.description-block {
  padding-top: 0.5rem;
  border-top: 1px solid #e8e2d9;
}

.description-text {
  font-size: 1rem;
  line-height: 1.7;
  color: #5c5347;
  margin: 0;
}

/* Specifications */
.specs-block {
  padding-top: 0.5rem;
  border-top: 1px solid #e8e2d9;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.spec-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(139, 115, 85, 0.08);
}

.spec-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8b7355;
}

.spec-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d2a26;
}

/* Availability */
.availability-block {
  padding-top: 0.5rem;
}

.stock-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.stock-indicator.in-stock {
  background: #e8f5e9;
  color: #2e7d32;
}

.stock-indicator.out-stock {
  background: #ffebee;
  color: #c62828;
}

.stock-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.in-stock .stock-dot {
  background: #4caf50;
}

.out-stock .stock-dot {
  background: #ef5350;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Actions */
.actions-block {
  display: flex;
  gap: 0.75rem;
  padding-top: 0.5rem;
  flex-wrap: wrap;
}

.btn-primary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #c4501a 0%, #e07a3a 100%);
  color: #fff;
  border: none;
  border-radius: 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(196, 80, 26, 0.35);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(196, 80, 26, 0.45);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  background: #fff;
  border: 2px solid #e8e2d9;
  border-radius: 1rem;
  color: #8b7355;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  border-color: #c4501a;
  color: #c4501a;
  background: #fef7f4;
}

/* Featured Indicator */
.featured-indicator {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e8e2d9;
}

.featured-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #c9bfb0 50%, transparent 100%);
}

.featured-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #8b7355;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .piece-detail {
    padding: 1rem 2rem 2rem;
  }
  
  .detail-container {
    gap: 2rem;
  }
  
  .piece-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .piece-detail {
    padding: 1rem;
    margin-top: 5em;
  }
  
  .detail-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  /* Ocultar thumbnails verticales en móvil */
  .thumbnail-grid-vertical {
    display: none;
  }
  
  /* Mostrar thumbnails horizontales en móvil */
  .thumbnail-grid-horizontal {
    display: flex;
  }
  
  /* La imagen ocupa 100% en móvil */
  .main-image-container {
    width: 100%;
    cursor: grab;
  }
  
  .main-image-container:active {
    cursor: grabbing;
  }
  
  .arrow-cursor-elegant {
    display: none;
  }
  
  .piece-title {
    font-size: 2rem;
  }
  
  .final-price {
    font-size: 1.5rem;
  }
  
  .specs-grid {
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  
  .spec-item {
    padding: 0.75rem;
  }
  
  .spec-value {
    font-size: 1rem;
  }
  
  .btn-primary {
    padding: 0.875rem 1rem;
    font-size: 0.85rem;
  }
  
  .btn-secondary {
    width: 48px;
    height: 48px;
  }
}

@media (max-width: 480px) {
  .specs-grid {
    grid-template-columns: 1fr;
  }
  
  .tags-row {
    gap: 0.35rem;
  }
  
  .tag {
    padding: 0.35rem 0.75rem;
    font-size: 0.65rem;
  }
  
  .piece-title {
    font-size: 1.75rem;
  }
  
  .description-text {
    font-size: 0.9rem;
  }
}


@media (min-width: 769px) {
  .thumbnail-grid-vertical {
    max-height: 37rem; /* Ajusta este valor según la altura de .main-image-container */
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    padding-right: 4px; /* Espacio para el scrollbar */
    margin-top: 0.5rem;
    -ms-overflow-style: none;  /* IE y Edge */
    scrollbar-width: none;  /* Firefox */
  }
  
  /* Personalizar scrollbar */
  .thumbnail-grid-vertical::-webkit-scrollbar {
    display: none;  /* Chrome, Safari, Edge */
    width: 0;
    background: transparent;
  }
  
  .thumbnail-grid-vertical::-webkit-scrollbar-track {
    background: #e8e2d9;
    border-radius: 4px;
  }
  
  .thumbnail-grid-vertical::-webkit-scrollbar-thumb {
    background: #c4501a;
    border-radius: 4px;
  }
  
  /* Asegurar que todos los thumbnails (incluyendo videos) tengan el mismo tamaño */
  .thumbnail-item-vertical,
  .video-thumb-vertical {
    width: 80px;
    height: 80px;
    position: relative;
    flex-shrink: 0;
  }
  
  /* Forzar que las imágenes dentro de video-thumb-vertical ocupen todo el contenedor */
  .video-thumb-vertical img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
  }
  
  /* Mantener el ícono de play centrado */
  .video-play-icon-vertical {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }
}
</style>