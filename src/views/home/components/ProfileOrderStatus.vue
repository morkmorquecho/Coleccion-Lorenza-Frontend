<template>
  <div class="orders-container">
    <!-- Header -->
    <header class="orders-header">
      <div class="header-top">
        <h3 class="header-title">Mis pedidos</h3>
        <span class="header-count">{{ filteredShipments.length }}</span>
      </div>

      <div class="search-wrapper">
        <svg
          class="search-icon"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar pedido..."
          class="search-input"
        />
      </div>
    </header>

    <!-- Filters -->
    <nav class="filters-nav">
      <button
        v-for="filter in filters"
        :key="filter.value"
        class="filter-chip"
        :class="{ active: activeFilter === filter.value }"
        @click="handleFilterChange(filter.value)"
      >
        {{ filter.label }}
        <span class="chip-count">{{ getCountByStatus(filter.value) }}</span>
      </button>
    </nav>

    <!-- Content wrapper with overlay -->
    <div class="content-wrapper" :class="{ 'has-overlay': modalLoading }">
      <!-- Loading Overlay (solo visible al hacer clic) -->
      <LoadingOverlay 
        v-if="modalLoading"
        :loading="modalLoading"
        :min-display-time="500"
        :show-message="true"
        :speed="1"
      />

      <!-- Inner content -->
      <div class="content-inner" :class="{ 'blurred': modalLoading }">
        <!-- Empty State -->
        <div v-if="displayedShipments.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p class="empty-title">Sin pedidos</p>
          <p class="empty-text">
            {{
              searchQuery
                ? 'No hay resultados para esa búsqueda'
                : activeFilter !== 'all'
                  ? 'No hay pedidos con este estado'
                  : 'Aún no realizaste ningún pedido'
            }}
          </p>
        </div>

        <!-- Orders List -->
        <div v-else class="orders-list">
          <article
            v-for="order in paginatedShipments"
            :key="order.id"
            class="order-card"
            @click="openModal(order.id)"
            tabindex="0"
            role="button"
            :aria-label="`Ver detalles del pedido del ${formatDate(order.created_at)}`"
            @keydown.enter="openModal(order.id)"
          >
            <div class="order-left">
              <span class="status-dot" :class="getStatusClass(order.status)" />
              <div class="order-info">
                <span class="order-date">{{ formatDate(order.created_at) }}</span>
                <span class="order-meta">
                  <span v-if="order.items_count"
                    >{{ order.items_count }} artículo{{ order.items_count !== 1 ? 's' : '' }}</span
                  >
                  <span v-if="order.coupon_usage?.length" class="coupon-dot">· Cupón aplicado</span>
                </span>
              </div>
            </div>

            <div class="order-right">
              <span class="order-total">{{ formatPrice(order.total) }}</span>
              <span class="order-badge" :class="getStatusClass(order.status)">{{
                getStatusLabel(order.status)
              }}</span>
            </div>
          </article>
        </div>

        <!-- Pagination -->
        <footer v-if="totalPages > 1" class="pagination-footer">
          <button
            class="page-btn"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
            aria-label="Página anterior"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <span class="pagination-label">{{ currentPage }} / {{ totalPages }}</span>

          <button
            class="page-btn"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
            aria-label="Página siguiente"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </footer>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <OrderDetailModal
    v-model="showModal"
    :shipment="selectedShipment"
    :loading="modalLoading"
    @cancel="handleCancel"
    @message="handleMessage"
  />
</template>

<script setup>
import { ref, computed, watch,nextTick  } from 'vue'
import OrderDetailModal from './OrderDetailModal.vue'
import LoadingOverlay from '@/components/ui/LoadingOverlay.vue'
import ordersService from '@/services/ordersService'
import { useCurrency } from '@/composables/useCurrency'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()

const { formatPrice } = useCurrency()

const props = defineProps({
  shipments: { type: Array, default: () => [] },
})

const showModal = ref(false)
const modalLoading = ref(false)
const selectedShipment = ref(null)

const searchQuery = ref('')
const activeFilter = ref('all')
const currentPage = ref(1)
const pageSize = 8

const statusMap = {
  pending: { label: 'Pendiente', class: 'pending' },
  paid: { label: 'Pagado', class: 'pending' },
  shipped: { label: 'En camino', class: 'shipped' },
  delivered: { label: 'Entregado', class: 'delivered' },
  cancelled: { label: 'Cancelado', class: 'cancelled' },
  canceled: { label: 'Cancelado', class: 'cancelled' },
}

const filters = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'shipped', label: 'En camino' },
  { value: 'delivered', label: 'Entregados' },
  { value: 'cancelled', label: 'Cancelados' },
]

const filteredShipments = computed(() => {
  if (!props.shipments) return []
  let result = props.shipments
  if (activeFilter.value !== 'all') {
    result = result.filter((o) => {
      const s = o.status?.toLowerCase()
      if (activeFilter.value === 'pending') return s === 'pending' || s === 'paid'
      if (activeFilter.value === 'cancelled') return s === 'cancelled' || s === 'canceled'
      return s === activeFilter.value
    })
  }
  return result
})

const displayedShipments = computed(() => {
  let result = filteredShipments.value
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (o) => formatDate(o.created_at).toLowerCase().includes(q) || String(o.total).includes(q),
    )
  }
  return result
})

const totalPages = computed(() => Math.ceil(displayedShipments.value.length / pageSize))
const startIndex = computed(() => (currentPage.value - 1) * pageSize)
const paginatedShipments = computed(() =>
  displayedShipments.value.slice(startIndex.value, startIndex.value + pageSize),
)

watch(searchQuery, () => {
  currentPage.value = 1
})

function getCountByStatus(v) {
  if (!props.shipments) return 0
  if (v === 'all') return props.shipments.length
  return props.shipments.filter((o) => {
    const s = o.status?.toLowerCase()
    if (v === 'pending') return s === 'pending' || s === 'paid'
    if (v === 'cancelled') return s === 'cancelled' || s === 'canceled'
    return s === v
  }).length
}

function getStatusLabel(s) {
  return statusMap[s?.toLowerCase()]?.label || s
}
function getStatusClass(s) {
  return statusMap[s?.toLowerCase()]?.class || 'pending'
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function handleFilterChange(v) {
  const scrollY = window.scrollY  // ← guarda posición actual
  activeFilter.value = v
  currentPage.value = 1
  nextTick(() => {
    window.scrollTo({ top: scrollY, behavior: 'instant' })  // ← restaura
  })
}

function goToPage(p) {
  if (p >= 1 && p <= totalPages.value) currentPage.value = p
}

async function openModal(shipmentId) {
  // Activar loading overlay al hacer clic
  modalLoading.value = true
  showModal.value = true
  selectedShipment.value = []
  
  try {
    await new Promise((r) => setTimeout(r, 400))
    selectedShipment.value = await ordersService.getShippingTracking(shipmentId)
  } catch {
    showModal.value = false
  } finally {
    modalLoading.value = false
  }
}

function showConfirm(msg, title = '¿Estás seguro?') {
  return new Promise((resolve) => {
    uiStore.showModal(msg, title, '/animations/quetzal.json', {
      showActionButton: true,
      buttonText:       'Confirmar',
      showCancelButton: true,
      cancelText:       'Cancelar',
      onConfirm: () => resolve(true),
      onCancel:  () => resolve(false),
    })
  })
}

async function handleCancel(shipment) {
  const confirmed = await showConfirm('¿Seguro que quieres cancelar tu pedido?', 'Cancelar pedido')
  if(!confirmed) return
  try {
    await ordersService.cancelOrder(shipment.order.id)
    uiStore.showModal('Su pedido sera rembolzado y la orden fue cancelada','Orden cancelada', '/animations/mariachi.json')
  } catch (error) {
    uiStore.showModal('Error al cancelar el pedido', 'Intentalo de nuevo mas tarde')
  }
}

function handleMessage(shipment) {
  console.log('Message', shipment?.order?.id)
}
</script>

<style scoped>
.orders-container {
  font-family: 'Inter', system-ui, sans-serif;
  max-width: 600px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 1.25rem;
  position: relative;
}

/* Content wrapper */
.content-wrapper {
  position: relative;
  min-height: 400px;
}


/* LoadingOverlay positioning */
.content-wrapper :deep(.loading-overlay) {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 11;
  background: transparent;
  min-height: auto;
}

.content-wrapper :deep(.loading-container) {
  min-height: 400px;
}

/* Inner content blur effect */
.content-inner.blurred {
  filter: blur(2px);
  pointer-events: none;
}

/* Header */
.orders-header {
  margin-bottom: 1.5rem;
}

.header-top {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1rem;
}

.header-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1a0e09;
  margin: 0;
  text-transform: uppercase;
}

.header-count {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-primary);
  background: #fff7ed;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
}

/* Search */
.search-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: #d1806b;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.625rem 1rem 0.625rem 2.5rem;
  font-size: 0.875rem;
  border: 1px solid #ffe4d0;
  border-radius: 0.625rem;
  background: #fffaf7;
  color: #7c2d12;
  outline: none;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
  box-sizing: border-box;
}

.search-input::placeholder {
  color: #d1806b;
  opacity: 0.7;
}

.search-input:focus {
  border-color: #f97316;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.08);
}

/* Filters */
.filters-nav {
  display: flex;
  gap: 0.375rem;
  margin-bottom: 1.25rem;
  overflow-x: auto;
  padding-bottom: 0.125rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.filters-nav::-webkit-scrollbar {
  display: none;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4375rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1px solid #ffe4d0;
  border-radius: 999px;
  background: transparent;
  color: #9a3412;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.filter-chip:hover {
  background: #fff7ed;
  border-color: #fdba74;
}

.filter-chip.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.chip-count {
  font-size: 0.6875rem;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.08);
  padding: 0.0625rem 0.375rem;
  border-radius: 999px;
}

.filter-chip.active .chip-count {
  background: rgba(255, 255, 255, 0.2);
}

/* Empty */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3.5rem 1rem;
  text-align: center;
  gap: 0.5rem;
}

.empty-icon {
  color: #fdba74;
  margin-bottom: 0.75rem;
}

.empty-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #7c2d12;
  margin: 0;
}

.empty-text {
  font-size: 0.875rem;
  color: #c2410c;
  opacity: 0.65;
  margin: 0;
}

/* Orders */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.order-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  border: 1px solid #ffe4d0;
  border-radius: 0.75rem;
  background: #fff;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s;
  gap: 1rem;
}

.order-card:hover {
  background: #fffaf7;
  border-color: #fdba74;
}

.order-card:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.order-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.pending {
  background: #fb923c;
}
.status-dot.shipped {
  background: #f97316;
}
.status-dot.delivered {
  background: #22c55e;
}
.status-dot.cancelled {
  background: #d4d4d4;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 0.1875rem;
  min-width: 0;
}

.order-date {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1c0e07;
  white-space: nowrap;
}

.order-meta {
  font-size: 0.75rem;
  color: #c2410c;
  opacity: 0.7;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.coupon-dot {
  color: #ea580c;
  opacity: 1;
}

.order-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  flex-shrink: 0;
}

.order-total {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #ea580c;
  letter-spacing: -0.01em;
}

.order-badge {
  font-size: 0.6875rem;
  font-weight: 500;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  white-space: nowrap;
}

.order-badge.pending {
  background: #fff7ed;
  color: #ea580c;
}
.order-badge.shipped {
  background: #ffedd5;
  color: #c2410c;
}
.order-badge.delivered {
  background: #dcfce7;
  color: #16a34a;
}
.order-badge.cancelled {
  background: #f5f5f5;
  color: #a3a3a3;
}

/* Pagination */
.pagination-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid #ffe4d0;
}

.pagination-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #c2410c;
  min-width: 3rem;
  text-align: center;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #ffe4d0;
  background: transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  color: #c2410c;
  transition: all 0.15s;
}

.page-btn:hover:not(:disabled) {
  background: #f97316;
  border-color: #f97316;
  color: #fff;
}

.page-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 480px) {
  .orders-container {
    padding: 1.25rem;
  }
  .filter-chip-label {
    display: none;
  }
  .order-card {
    padding: 0.75rem;
  }
}
</style>