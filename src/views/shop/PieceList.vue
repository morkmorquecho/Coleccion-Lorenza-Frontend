<template>
  <div class="store-view">
    <!-- Hero Header -->
    <header class="store-hero">
      <div class="hero-content">
        <!-- <span class="hero-eyebrow">Coleccion Artesanal</span> -->
        <h1 class="hero-title">Piezas unicas<br />hechas a mano</h1>
        <p class="hero-subtitle">
          Descubre el arte tradicional mexicano en cada detalle
        </p>
      </div>
      <div class="hero-stats">
        <div class="stat-item">
          <span class="stat-number">{{ filteredProducts.length }}</span>
          <span class="stat-label">Piezas</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">{{ sections.length }}</span>
          <span class="stat-label">Colecciones</span>
        </div>
      </div>
    </header>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <button 
        class="filter-toggle"
        :class="{ active: showFilters }"
        @click="showFilters = !showFilters"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="4" x2="4" y1="21" y2="14"></line>
          <line x1="4" x2="4" y1="10" y2="3"></line>
          <line x1="12" x2="12" y1="21" y2="12"></line>
          <line x1="12" x2="12" y1="8" y2="3"></line>
          <line x1="20" x2="20" y1="21" y2="16"></line>
          <line x1="20" x2="20" y1="12" y2="3"></line>
          <line x1="2" x2="6" y1="14" y2="14"></line>
          <line x1="10" x2="14" y1="8" y2="8"></line>
          <line x1="18" x2="22" y1="16" y2="16"></line>
        </svg>
        <span>Filtros</span>
        <span v-if="activeFiltersCount > 0" class="filter-badge">{{ activeFiltersCount }}</span>
      </button>

      <!-- Quick search -->
      <div class="search-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
        <input
          v-model="filters.search"
          type="text"
          placeholder="Buscar piezas..."
          class="search-input"
        />
      </div>

      <!-- Sort dropdown -->
      <div class="sort-wrapper">
        <select v-model="filters.sortBy" class="sort-select">
          <option value="">Ordenar por</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
          <option value="date-desc">Mas recientes</option>
          <option value="date-asc">Mas antiguos</option>
        </select>
      </div>
    </div>

    <!-- Expanded Filters Panel -->
    <Transition name="slide">
      <div v-if="showFilters" class="filters-panel">
        <div class="filters-grid">
          <!-- Section filter -->
          <div class="filter-group">
            <label class="filter-label">Coleccion</label>
            <div class="filter-chips">
              <button 
                v-for="section in sections" 
                :key="section.key"
                class="filter-chip"
                :class="{ active: filters.section === section.key }"
                @click="filters.section = filters.section === section.key ? '' : section.key"              
                >
                {{ section.section }}
              </button>
            </div>
          </div>

          <!-- Piece type filter -->
          <div class="filter-group">
            <label class="filter-label">Tipo de pieza</label>
            <div class="filter-chips">
              <button 
                v-for="type in pieceTypes" 
                :key="type.key"
                class="filter-chip"
                :class="{ active: filters.pieceType === type.key }"
                @click="filters.pieceType = filters.pieceType === type.key ? '' : type.key"
              >
                {{ type.type }}
              </button>
            </div>
          </div>

          <!-- Availability filter -->
          <div class="filter-group">
            <label class="filter-label">Disponibilidad</label>
            <div class="filter-chips">
              <button 
                class="filter-chip"
                :class="{ active: filters.inStock }"
                @click="filters.inStock = !filters.inStock"
              >
                En stock
              </button>
              <button 
                class="filter-chip"
                :class="{ active: filters.outOfStock }"
                @click="filters.outOfStock = !filters.outOfStock"
              >
                Agotado
              </button>
            </div>
          </div>
        </div>

        <button 
          v-if="activeFiltersCount > 0" 
          @click="clearFilters" 
          class="clear-btn"
        >
          Limpiar filtros
        </button>
      </div>
    </Transition>

    <!-- Products Grid - Hero Section -->
    <main class="products-main">
      <ProductGrid
        v-if="filteredProducts.length > 0"
        :products="filteredProducts"
        :cols="4"
        :gap="24"
        @add="onAdd"
      />

      <!-- Empty state -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
            <path d="M8 8l6 6"></path>
          </svg>
        </div>
        <h3 class="empty-title">No se encontraron piezas</h3>
        <p class="empty-subtitle">Intenta ajustar los filtros de busqueda</p>
        <button @click="clearFilters" class="empty-btn">
          Ver todas las piezas
        </button>
      </div>
    </main>

    <!-- Floating indicator -->
    <!-- <Transition name="fade">
      <div v-if="filteredProducts.length > 0" class="floating-indicator">
        <span>{{ filteredProducts.length }} piezas encontradas</span>
      </div>
    </Transition> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductGrid from '@/components/products/ProductGrid.vue'
import piecesService from '@/services/piecesService'

const products = ref([])
const sections = ref([])
const pieceTypes = ref([])

onMounted(async () => {
  const res = await piecesService.getPieces()
  products.value = res.results

  const s = await piecesService.getSections()
  sections.value= s.results

  const t = await piecesService.getTypes()
  pieceTypes.value = t.results
})


// Emits
const emit = defineEmits(['add'])

// Filter options
// const sections = ['Dia de muertos', 'Muneca Lupita', 'Navidad', 'Pascua']
// const pieceTypes = ['Escultura colgante', 'Mascara', 'Escultura de sobremesa']

// UI state
const showFilters = ref(false)

// Reactive filters state
const filters = ref({
  search: '',
  section: '',
  pieceType: '',
  sortBy: '',
  inStock: false,
  outOfStock: false
})

// Active filters count
const activeFiltersCount = computed(() => {
  let count = 0
  if (filters.value.search) count++
  if (filters.value.section) count++
  if (filters.value.pieceType) count++
  if (filters.value.inStock) count++
  if (filters.value.outOfStock) count++
  return count
})

// Computed filtered products
const filteredProducts = computed(() => {
  let result = [...products.value]

  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    result = result.filter(product =>
      product.title.toLowerCase().includes(searchTerm)
    )
  }

  if (filters.value.section) {
    result = result.filter(product => product.section === filters.value.section)
  }

  if (filters.value.pieceType) {
    result = result.filter(product => product.type === filters.value.pieceType)
  }

  if (filters.value.inStock && !filters.value.outOfStock) {
    result = result.filter(product => product.quantity > 0)
  } else if (filters.value.outOfStock && !filters.value.inStock) {
    result = result.filter(product => product.quantity === 0)
  }

  if (filters.value.sortBy) {
    switch (filters.value.sortBy) {
      case 'price-asc':
        result.sort((a, b) => parseFloat(a.final_price_base.replace('$', '')) - parseFloat(b.final_price_base.replace('$', '')))
        break
      case 'price-desc':
        result.sort((a, b) => parseFloat(b.final_price_base.replace('$', '')) - parseFloat(a.final_price_base.replace('$', '')))
        break
      case 'date-asc':
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        break
      case 'date-desc':
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
    }
  }

  return result
})

// Clear all filters
const clearFilters = () => {
  filters.value = {
    search: '',
    section: '',
    pieceType: '',
    sortBy: '',
    inStock: false,
    outOfStock: false
  }
}

// Handle add to cart
const onAdd = (product) => {
  emit('add', product)
}
</script>

<style scoped>
.store-view {
  min-height: 100vh;
  background: linear-gradient(180deg, #faf8f5 0%, #fff 100%);
  padding-top: 4em;
  background: var(--color-background);
}

/* Hero Header */
.store-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 80px 48px 48px;
  max-width: 1600px;
  margin: 0 auto;
}

.hero-content {
  max-width: 600px;
}

.hero-eyebrow {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #c4501a;
  margin-bottom: 16px;
  padding: 6px 16px;
  background: rgba(196, 80, 26, 0.08);
  border-radius: 100px;
}

.hero-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 400;
  line-height: 1.1;
  color:  var(--color-primary);
  margin: 0 0 16px 0;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 24px 32px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-number {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 2rem;
  font-weight: 500;
  color: #1a1a1a;
}

.stat-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #999;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #eee;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 48px;
  max-width: 1600px;
  margin: 0 auto;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1a1a1a;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-toggle:hover,
.filter-toggle.active {
  background:  var(--color-primary);
  color: #fff;
  border-color:  var(--color-primary);
}

.filter-toggle svg {
  opacity: 0.7;
}

.filter-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #fff;
  background: #c4501a;
  border-radius: 100px;
}

.search-wrapper {
  flex: 1;
  max-width: 400px;
  position: relative;
}

.search-wrapper svg {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  font-size: 0.9rem;
  color: #1a1a1a;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 100px;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #1a1a1a;
  box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.05);
}

.search-input::placeholder {
  color: #aaa;
}

.sort-wrapper {
  margin-left: auto;
}

.sort-select {
  padding: 12px 40px 12px 20px;
  font-size: 0.875rem;
  color: #1a1a1a;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 100px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  transition: all 0.2s ease;
}

.sort-select:focus {
  outline: none;
  border-color: #1a1a1a;
}

/* Filters Panel */
.filters-panel {
  padding: 24px 48px 32px;
  max-width: 1600px;
  margin: 0 auto;
  background: rgba(250, 248, 245, 0.5);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #999;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-chip {
  padding: 8px 16px;
  font-size: 0.85rem;
  color: #666;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-chip:hover {
  border-color: #1a1a1a;
  color: #1a1a1a;
}

.filter-chip.active {
  background: var(--color-primary);
  color: #fff;
  border-color: #1a1a1a;
  border-color: var(--color-primary);
}

.clear-btn {
  margin-top: 24px;
  padding: 10px 24px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #c4501a;
  background: transparent;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: opacity 0.2s ease;
}

.clear-btn:hover {
  opacity: 0.7;
}

/* Products Main */
.products-main {
  padding: 48px;
  max-width: 1600px;
  margin: 0 auto;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 24px;
  text-align: center;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  background: rgba(196, 80, 26, 0.05);
  border-radius: 50%;
  margin-bottom: 24px;
}

.empty-icon svg {
  color: #c4501a;
  opacity: 0.5;
}

.empty-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.75rem;
  font-weight: 400;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.empty-subtitle {
  font-size: 1rem;
  color: #999;
  margin: 0 0 32px 0;
}

.empty-btn {
  padding: 14px 32px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
  background: #1a1a1a;
  border: none;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.empty-btn:hover {
  background: #333;
  transform: translateY(-1px);
}

/* Floating Indicator */
.floating-indicator {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #fff;
  background: #1a1a1a;
  border-radius: 100px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

/* Responsive */
@media (max-width: 1200px) {
  .store-hero {
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
    padding: 60px 32px 40px;
  }

  .hero-stats {
    align-self: flex-start;
  }

  .filter-bar {
    padding: 16px 32px;
    flex-wrap: wrap;
  }

  .filters-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .products-main {
    padding: 32px;
  }
}

@media (max-width: 768px) {
  .store-hero {
    padding: 48px 20px 32px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .filter-bar {
    padding: 16px 20px;
    gap: 12px;
  }

  .search-wrapper {
    order: -1;
    flex: 1 1 100%;
    max-width: none;
  }

  .sort-wrapper {
    margin-left: 0;
    flex: 1;
  }

  .sort-select {
    width: 100%;
  }

  .filters-panel {
    padding: 20px;
  }

  .filters-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .products-main {
    padding: 24px 20px;
  }

  .floating-indicator {
    bottom: 20px;
    font-size: 0.8rem;
    padding: 10px 20px;
  }
}
</style>
