<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-30 flex items-center justify-center bg-stone-950/30 backdrop-blur-sm p-4"
        @click.self="close"
      >
        <div
          class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          role="dialog"
          aria-modal="true"
        >
          <!-- Header - Fixed -->
          <header
            class="shrink-0 flex items-center justify-between px-6 py-5 border-b border-orange-100"
          >
            <div class="flex items-center gap-3">
              <div
                :class="[
                  'flex items-center justify-center w-10 h-10 rounded-xl transition-colors',
                  statusStyles.bg,
                ]"
              >
                <component :is="statusIcon" :class="['w-5 h-5', statusStyles.icon]" />
              </div>
              <div>
                <h2 class="text-base font-semibold text-stone-800" style="font-family: Georgia">
                  {{ shipment ? `Orden #${shipment.order.id}` : 'Cargando...' }}
                </h2>
                <p class="text-xs text-stone-500">
                  {{ shipment ? formatDate(shipment.created_at) : '' }}
                </p>
              </div>
            </div>
            <button
              @click="close"
              :disabled="cancelling"
              class="modal-close"
              aria-label="Cerrar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </header>

          <!-- Scrollable Content Area -->
          <div class="flex-1 overflow-y-auto scroll-smooth">
            <!-- Loading Skeleton principal -->
            <div v-if="loading" class="p-6 space-y-4">
              <div class="flex gap-2">
                <div class="h-6 w-20 bg-orange-100 rounded-full animate-pulse" />
                <div class="h-6 w-16 bg-orange-100 rounded-full animate-pulse" />
              </div>
              <div class="h-20 bg-orange-50 rounded-xl animate-pulse" />
              <div class="grid grid-cols-2 gap-3">
                <div class="h-16 bg-orange-50 rounded-xl animate-pulse" />
                <div class="h-16 bg-orange-50 rounded-xl animate-pulse" />
              </div>
              <div class="h-24 bg-orange-50 rounded-xl animate-pulse" />
              <div class="h-12 bg-orange-100 rounded-xl animate-pulse" />
            </div>

            <!-- Cancel Loading Overlay -->
            <div 
              v-else-if="cancelling" 
              class="flex flex-col items-center justify-center min-h-100 p-8"
            >
              <div class="relative w-20 h-20 mb-4">
                <div class="absolute inset-0 rounded-full border-4 border-orange-100"></div>
                <div class="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
              </div>
              <p class="text-stone-600 font-medium">Cancelando orden...</p>
              <p class="text-sm text-stone-400 mt-1">Por favor espera un momento</p>
            </div>

            <!-- Content -->
            <div v-else-if="shipment" class="p-6 space-y-5">
              <!-- Status Badges -->
              <div class="flex items-center gap-2 flex-wrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full',
                    statusStyles.badge,
                  ]"
                >
                  {{ statusLabel }}
                </span>
                <span
                  class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-stone-100 text-stone-600"
                >
                  {{ carrierLabel }}
                </span>
              </div>

              <!-- Tracking -->
              <div class="p-4 bg-orange-50/70 rounded-xl border border-orange-100">
                <p class="text-[11px] font-medium uppercase tracking-wider text-stone-500 mb-2">
                  Numero de seguimiento
                </p>
                <div
                  v-if="shipment.tracking_number && shipment.status !== 'pending'"
                  class="flex items-center gap-2 flex-wrap"
                >
                  <code
                    class="flex-1 min-w-0 text-sm font-mono font-semibold text-stone-800 break-all"
                  >
                    {{ shipment.tracking_number }}
                  </code>
                  <div class="flex gap-1.5">
                    <a
                      v-if="shipment.tracking_url"
                      :href="shipment.tracking_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <ExternalLinkIcon class="w-3.5 h-3.5" />
                      Rastrear
                    </a>
                    <button
                      @click="copyTracking"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-orange-200 text-stone-700 rounded-lg hover:bg-orange-50 transition-colors"
                    >
                      <CheckIcon v-if="copied" class="w-3.5 h-3.5 text-emerald-500" />
                      <CopyIcon v-else class="w-3.5 h-3.5" />
                      {{ copied ? 'Copiado' : 'Copiar' }}
                    </button>
                  </div>
                </div>
                <div v-else class="flex items-center gap-2 text-sm text-stone-500">
                  <ClockIcon class="w-4 h-4 shrink-0" />
                  <span>En proceso de asignacion</span>
                </div>
              </div>

              <!-- Dates -->
              <div class="grid grid-cols-2 gap-3">
                <div class="p-3 bg-orange-50/50 rounded-xl border border-orange-100">
                  <p class="text-[11px] font-medium uppercase tracking-wider text-stone-500 mb-1">
                    Enviado
                  </p>
                  <p class="text-sm font-medium text-stone-800">
                    {{ shipment.shipped_at ? formatDate(shipment.shipped_at) : '—' }}
                  </p>
                </div>
                <div class="p-3 bg-orange-50/50 rounded-xl border border-orange-100">
                  <p class="text-[11px] font-medium uppercase tracking-wider text-stone-500 mb-1">
                    Entregado
                  </p>
                  <p
                    :class="[
                      'text-sm font-medium',
                      shipment.delivered_at ? 'text-emerald-600' : 'text-stone-800',
                    ]"
                  >
                    {{ shipment.delivered_at ? formatDate(shipment.delivered_at) : '—' }}
                  </p>
                </div>
              </div>

              <!-- Items -->
              <div>
                <p class="text-[11px] font-medium uppercase tracking-wider text-stone-500 mb-3">
                  Piezas del pedido
                </p>
                <div class="space-y-2">
                  <div
                    v-for="item in shipment.order.items"
                    :key="item.id"
                    class="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-orange-50/50 transition-colors"
                  >
                    <img
                      v-if="item.piece.thumbnail_path"
                      :src="item.piece.thumbnail_path"
                      :alt="item.piece.title"
                      class="w-11.125 h-18 rounded-lg object-cover bg-orange-100 shrink-0"
                    />
                    <div
                      v-else
                      class="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0"
                    >
                      <ImageIcon class="w-4 h-4 text-orange-400" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-stone-800 truncate">
                        {{ item.piece.title }}
                      </p>
                      <p class="text-xs text-stone-500">Cantidad: {{ item.quantity }}</p>
                    </div>
                    <p
                      class="text-sm font-semibold font-prices text-stone-800 tabular-nums shrink-0"
                    >
                      {{ formatPrice(item.price_snapshot) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Total -->
              <div
                class="flex items-center justify-between p-4 rounded-xl"
                style="background: var(--color-primary)"
              >
                <span class="text-sm font-medium text-orange-100"> Total del pedido </span>
                <span class="text-lg font-bold font-prices text-white tabular-nums">
                  {{ formatPrice(shipment.order.total) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Actions - Fixed Footer -->
          <footer
            v-if="shipment && !cancelling"
            class="shrink-0 flex gap-3 px-6 py-4 border-t border-orange-100 bg-orange-50/30"
          >
            <button
              v-if="shipment.order.can_be_cancelled"
              @click="handleCancel"
              :disabled="cancelling"
              class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XIcon class="w-4 h-4" />
              Cancelar
            </button>
            <button
              @click="$emit('message', shipment)"
              :disabled="cancelling"
              class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageIcon class="w-4 h-4" />
              Mensaje al artista
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, h, type FunctionalComponent } from 'vue'
import { X, Truck, Clock, Copy, Check, ExternalLink, MessageSquare, Image } from 'lucide-vue-next'
import { useCurrency } from '@/composables/useCurrency'

const { formatPrice } = useCurrency()

interface OrderItem {
  id: number
  quantity: number
  price_snapshot: number
  piece: {
    title: string
    thumbnail_path?: string
  }
}

interface Order {
  id: number
  total: number
  can_be_cancelled: boolean
  items: OrderItem[]
}

interface Shipment {
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  carrier: string
  tracking_number?: string
  tracking_url?: string
  created_at: string
  shipped_at?: string
  delivered_at?: string
  order: Order
}

const props = defineProps<{
  modelValue: boolean
  shipment?: Shipment | null
  loading?: boolean
  cancelling?: boolean 
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  cancel: [shipment: Shipment]
  message: [shipment: Shipment]
}>()

const copied = ref(false)

const XIcon = X
const TruckIcon = Truck
const ClockIcon = Clock
const CopyIcon = Copy
const CheckIcon = Check
const ExternalLinkIcon = ExternalLink
const MessageIcon = MessageSquare
const ImageIcon = Image

const statusConfig = {
  pending: {
    label: 'Pendiente',
    icon: ClockIcon,
    bg: 'bg-amber-100',
    icon_color: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700',
  },
  paid: {
    label: 'Pagado',
    icon: ClockIcon,
    bg: 'bg-orange-100',
    icon_color: 'text-orange-600',
    badge: 'bg-orange-100 text-orange-700',
  },
  shipped: {
    label: 'Enviado',
    icon: TruckIcon,
    bg: 'bg-orange-100',
    icon_color: 'text-orange-600',
    badge: 'bg-orange-100 text-orange-700',
  },
  delivered: {
    label: 'Entregado',
    icon: CheckIcon,
    bg: 'bg-emerald-100',
    icon_color: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  cancelled: {
    label: 'Cancelado',
    icon: XIcon,
    bg: 'bg-stone-100',
    icon_color: 'text-stone-500',
    badge: 'bg-stone-100 text-stone-600',
  },
}

const carrierMap: Record<string, string> = {
  dhl: 'DHL',
  fedex: 'FedEx',
  ups: 'UPS',
  estafeta: 'Estafeta',
}

const currentStatus = computed(() => {
  const status = props.shipment?.status?.toLowerCase() as keyof typeof statusConfig
  return statusConfig[status] || statusConfig.pending
})

const statusLabel = computed(() => currentStatus.value.label)
const statusIcon = computed(() => currentStatus.value.icon)
const statusStyles = computed(() => ({
  bg: currentStatus.value.bg,
  icon: currentStatus.value.icon_color,
  badge: currentStatus.value.badge,
}))

const carrierLabel = computed(() => {
  const carrier = props.shipment?.carrier?.toLowerCase()
  return carrier ? carrierMap[carrier] || carrier.toUpperCase() : 'N/A'
})

function close() {
  if (!props.cancelling) {
    emit('update:modelValue', false)
  }
}

function formatDate(dateString: string): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function copyTracking() {
  if (!props.shipment?.tracking_number) return
  try {
    await navigator.clipboard.writeText(props.shipment.tracking_number)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    console.error('Failed to copy tracking number')
  }
}

async function handleCancel() {
  if (!props.shipment) return
  emit('cancel', props.shipment)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}

/* Estilos para el scroll personalizado (opcional) */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: var(--color-primary) #fed7aa;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #fed7aa;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #f97316;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #ea580c;
}

/* Animación para el spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 0.8s linear infinite;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  color: #6b5b52;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #dd4b24;
  transform: rotate(90deg);
}

</style>