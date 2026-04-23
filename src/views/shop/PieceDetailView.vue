<template>
  <div class="piece-detail">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <a href="#" class="breadcrumb-link">Home</a>
      <span class="breadcrumb-separator">/</span>
      <a href="#" class="breadcrumb-link">{{ piece.section }}</a>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">{{ piece.title }}</span>
    </nav>

    <div class="detail-container">
      <!-- Left: Gallery Section -->
      <div class="gallery-section">
        <!-- Main Image -->
        <div 
          class="main-image-container"
          @mousemove="handleMouseMove"
          @mouseleave="handleMouseLeave"
          @click="handleImageClick"
        >
          <img 
            :src="currentImage" 
            :alt="piece.title"
            class="main-image"
          />
          
          <!-- Navigation Arrow Cursor -->
          <div 
            v-if="showArrow"
            class="arrow-cursor"
            :style="arrowStyle"
          >
            <svg 
              v-if="arrowDirection === 'left'" 
              xmlns="http://www.w3.org/2000/svg" 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <svg 
              v-else 
              xmlns="http://www.w3.org/2000/svg" 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>

          <!-- Image Counter -->
          <div class="image-counter">
            {{ currentImageIndex + 1 }} / {{ galleryImages.length }}
          </div>
        </div>

        <!-- Thumbnail Grid -->
        <div class="thumbnail-grid">
          <button
            v-for="(img, index) in galleryImages"
            :key="index"
            class="thumbnail-item"
            :class="{ active: currentImageIndex === index }"
            @click="currentImageIndex = index"
          >
            <img :src="img" :alt="`${piece.title} - Image ${index + 1}`" />
          </button>
        </div>
      </div>

      <!-- Right: Info Section -->
      <div class="info-section">
        <!-- Type & Section Tags -->
        <div class="tags-row">
          <span class="tag tag-type">{{ piece.type }}</span>
          <span class="tag tag-section">{{ piece.section }}</span>
          <span v-if="piece.customizable" class="tag tag-custom">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
            </svg>
            Customizable
          </span>
        </div>

        <!-- Title -->
        <h1 class="piece-title">{{ piece.title }}</h1>

        <!-- Price -->
        <div class="price-container">
          <span v-if="piece.has_discount" class="original-price">
            ${{ formatPrice(piece.original_price_base) }} MXN
          </span>
          <span class="final-price" :class="{ 'has-discount': piece.has_discount }">
            ${{ formatPrice(piece.final_price_base) }} MXN
          </span>
          <span v-if="piece.has_discount" class="discount-badge">
            -{{ piece.discount_percentage }}%
          </span>
        </div>

        <!-- Description -->
        <div class="description-block">
          <h3 class="section-title">About this piece</h3>
          <p class="description-text">{{ piece.description }}</p>
        </div>

        <!-- Specifications -->
        <div class="specs-block">
          <h3 class="section-title">Specifications</h3>
          <div class="specs-grid">
            <div class="spec-item">
              <span class="spec-label">Width</span>
              <span class="spec-value">{{ piece.width }} m</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Height</span>
              <span class="spec-value">{{ piece.height }} m</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Length</span>
              <span class="spec-value">{{ piece.length }} m</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Weight</span>
              <span class="spec-value">{{ piece.weight }} kg</span>
            </div>
          </div>
        </div>

        <!-- Availability -->
        <div class="availability-block">
          <div class="stock-indicator" :class="piece.quantity > 0 ? 'in-stock' : 'out-stock'">
            <span class="stock-dot"></span>
            <span v-if="piece.quantity > 0">
              {{ piece.quantity }} {{ piece.quantity === 1 ? 'piece' : 'pieces' }} available
            </span>
            <span v-else>Out of stock</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="actions-block">
          <button class="btn-primary" :disabled="piece.quantity === 0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            Add to Cart
          </button>
          <button class="btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </button>
        </div>

        <!-- Video Preview -->
        <div v-if="piece.intro_video" class="video-block">
          <h3 class="section-title">See it in action</h3>
          <div class="video-container">
            <video 
              :src="piece.intro_video" 
              controls 
              preload="metadata"
              class="intro-video"
              :poster="piece.thumbnail_path"
            />
          </div>
        </div>

        <!-- Featured Badge -->
        <div v-if="piece.featured" class="featured-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          Featured Piece
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  piece: {
    type: Object,
    default: () => ({
      id: 10010,
      title: "Monarca",
      slug: "monarca",
      description: "A stunning handcrafted alebrije inspired by the majestic monarch butterfly. Each piece is meticulously painted with vibrant colors and intricate patterns that represent the spirit of Mexican folk art. This wall art piece brings life and cultural richness to any space.",
      thumbnail_path: "https://pub-6420ef6d244f406e90e09d644afccd2e.r2.dev/pieces/thumbnails/590650e6b32b446286c600ded024e92d.jpg",
      intro_video: "https://pub-6420ef6d244f406e90e09d644afccd2e.r2.dev/pieces/intro-video/bde20179f61042488ad132a8af0931b2.mp4",
      quantity: 2,
      width: "1.00",
      height: "1.00",
      length: "0.99",
      weight: "1.00",
      customizable: true,
      featured: true,
      type: "WALL ART",
      section: "DAY OF THE DEAD",
      created_at: "2026-04-22T07:53:50.675021-06:00",
      has_discount: true,
      discount_percentage: 15,
      final_price_base: 1190.0,
      original_price_base: 1400.0
    })
  }
})

// Gallery images (simulated - in production these would come from API)
const galleryImages = computed(() => {
  const baseImages = [props.piece.thumbnail_path]
  // Simulate 9 gallery images
  for (let i = 1; i < 9; i++) {
    baseImages.push(props.piece.thumbnail_path)
  }
  return baseImages
})

const currentImageIndex = ref(0)
const currentImage = computed(() => galleryImages.value[currentImageIndex.value])

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
  
  mouseX.value = event.clientX - rect.left - 16
  mouseY.value = event.clientY - rect.top - 16
  
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
      : galleryImages.value.length - 1
  } else {
    currentImageIndex.value = currentImageIndex.value < galleryImages.value.length - 1 
      ? currentImageIndex.value + 1 
      : 0
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

.piece-detail {
  min-height: 100vh;
  background: linear-gradient(180deg, #faf8f5 0%, #f5f0e8 100%);
  padding: 2rem 4rem 4rem;
  font-family: 'Inter', sans-serif;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.875rem;
}

.breadcrumb-link {
  color: #8b7355;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: #c4501a;
}

.breadcrumb-separator {
  color: #c9bfb0;
}

.breadcrumb-current {
  color: #2d2a26;
  font-weight: 500;
  text-transform: capitalize;
}

/* Main Container */
.detail-container {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 4rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Gallery Section */
.gallery-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image-container {
  position: relative;
  aspect-ratio: 1;
  border-radius: 1.5rem;
  overflow: hidden;
  background: #e8e2d9;
  cursor: none;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 20px 40px -10px rgba(139, 115, 85, 0.15);
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

.arrow-cursor {
  position: absolute;
  pointer-events: none;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  color: #2d2a26;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.1s ease-out;
  z-index: 10;
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

/* Thumbnail Grid */
.thumbnail-grid {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 0.5rem;
}

.thumbnail-item {
  aspect-ratio: 1;
  border: 2px solid transparent;
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #e8e2d9;
  padding: 0;
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.thumbnail-item:hover img,
.thumbnail-item.active img {
  opacity: 1;
}

.thumbnail-item.active {
  border-color: #c4501a;
  box-shadow: 0 0 0 2px rgba(196, 80, 26, 0.2);
}

/* Info Section */
.info-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 0.5rem;
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
  gap: 0.35rem;
  padding: 0.35rem 0.85rem;
  border-radius: 2rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tag-type {
  background: #2d2a26;
  color: #fff;
}

.tag-section {
  background: #e8e2d9;
  color: #5c5347;
}

.tag-custom {
  background: linear-gradient(135deg, #c4501a 0%, #e07a3a 100%);
  color: #fff;
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
}

.btn-primary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  background: linear-gradient(135deg, #2d2a26 0%, #3d3a36 100%);
  color: #fff;
  border: none;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(45, 42, 38, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(45, 42, 38, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
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

/* Video */
.video-block {
  padding-top: 0.5rem;
  border-top: 1px solid #e8e2d9;
}

.video-container {
  border-radius: 1rem;
  overflow: hidden;
  background: #2d2a26;
}

.intro-video {
  width: 100%;
  display: block;
}

/* Featured Badge */
.featured-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #fef3e2 0%, #fde8cc 100%);
  border: 1px solid #f5d5a8;
  border-radius: 1rem;
  color: #b8860b;
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: auto;
}

/* Responsive */
@media (max-width: 1200px) {
  .piece-detail {
    padding: 1.5rem 2rem 3rem;
  }
  
  .detail-container {
    gap: 3rem;
  }
  
  .thumbnail-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 900px) {
  .detail-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .piece-title {
    font-size: 2.5rem;
  }
  
  .thumbnail-grid {
    grid-template-columns: repeat(9, 1fr);
  }
}

@media (max-width: 600px) {
  .piece-detail {
    padding: 1rem 1rem 2rem;
  }
  
  .piece-title {
    font-size: 2rem;
  }
  
  .thumbnail-grid {
    grid-template-columns: repeat(5, 1fr);
  }
  
  .specs-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .final-price {
    font-size: 1.5rem;
  }
}
</style>