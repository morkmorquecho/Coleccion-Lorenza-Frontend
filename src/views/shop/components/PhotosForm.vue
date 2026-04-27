<template>
  <div class="bulk-upload">
    <!-- ─── SECTION: PIEZAS ─────────────────────────────────────── -->
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">Agregar Fotos a las piezas</h3>
        <span class="section-badge">{{ pieces.length }} elementos</span>
      </div>

      <div class="pieces-grid">
        <div
          v-for="piece in pieces"
          :key="piece.id"
          class="piece-card"
          @click="openModal(piece)"
        >
          <div class="piece-avatar">
            <img v-if="piece.thumbnail_path" :src="piece.thumbnail_path" :alt="piece.title" />
            <div v-else class="avatar-placeholder">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          </div>
          <div class="piece-details">
            <span class="piece-title">{{ piece.title }}</span>
            <span class="piece-hint">Administrar fotos →</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── MODAL ───────────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
          <div class="modal-container">
            <!-- Modal Header -->
            <div class="modal-header">
              <div class="modal-info">
                <img
                  v-if="selectedPiece?.thumbnail_path"
                  :src="selectedPiece.thumbnail_path"
                  class="modal-avatar"
                />
                <div>
                  <span class="modal-badge">Gestión de fotos</span>
                  <h4 class="modal-title">{{ selectedPiece?.title }}</h4>
                </div>
              </div>
              <button
                @click="closeModal"
                :disabled="isUploading || isDeleting || isReordering"
                class="close-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Tabs -->
            <div class="modal-tabs">
              <button
                class="tab-btn"
                :class="{ 'tab-btn--active': activeTab === 'upload' }"
                @click="switchTab('upload')"
                :disabled="isUploading || isDeleting || isReordering"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Subir fotos
              </button>
              <button
                class="tab-btn"
                :class="{ 'tab-btn--active': activeTab === 'manage' }"
                @click="switchTab('manage')"
                :disabled="isUploading || isDeleting || isReordering"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                </svg>
                Gestionar
                <span v-if="existingPhotos.length > 0" class="tab-count">{{ existingPhotos.length }}</span>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="modal-body">

              <!-- ── TAB: UPLOAD ── -->
              <template v-if="activeTab === 'upload'">
                <div
                  v-if="photos.length === 0"
                  class="drop-area"
                  :class="{ 'drop-area--active': isDragging }"
                  @dragover.prevent="isDragging = true"
                  @dragleave="isDragging = false"
                  @drop.prevent="handleDrop"
                  @click="triggerFileInput"
                >
                  <input
                    ref="fileInput"
                    type="file"
                    multiple
                    accept="image/*"
                    webkitdirectory
                    style="display: none"
                    @change="handleFileInput"
                  />
                  <div class="drop-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p class="drop-primary">Arrastra imágenes o una carpeta</p>
                  <p class="drop-secondary">o haz clic para seleccionar · máximo 9 fotos</p>
                </div>

                <div v-else class="photos-area">
                  <div class="photos-header">
                    <span class="photos-counter">{{ photos.length }}/9 fotos</span>
                    <BaseButton
                      text="Agregar más"
                      variant="ghost"
                      size="small"
                      :disabled="photos.length >= 9"
                      @click="triggerFileInput"
                    />
                  </div>

                  <div class="photos-grid">
                    <div
                      v-for="(photo, index) in photos"
                      :key="photo.id"
                      class="photo-item"
                      :class="{
                        'photo-item--dragging': dragIndex === index,
                        'photo-item--over': dragOverIndex === index
                      }"
                      draggable="true"
                      @dragstart="onDragStart(index, $event)"
                      @dragover.prevent="onDragOver(index)"
                      @dragend="onDragEnd"
                      @drop.prevent="onDrop(index)"
                    >
                      <div class="photo-index">{{ index + 1 }}</div>
                      <img :src="photo.preview" :alt="`foto ${index + 1}`" />
                      <button class="photo-delete" @click.stop="removePhoto(index)">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                      <div class="photo-drag-handle">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="9" cy="5" r="1" fill="currentColor" />
                          <circle cx="15" cy="5" r="1" fill="currentColor" />
                          <circle cx="9" cy="12" r="1" fill="currentColor" />
                          <circle cx="15" cy="12" r="1" fill="currentColor" />
                          <circle cx="9" cy="19" r="1" fill="currentColor" />
                          <circle cx="15" cy="19" r="1" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- ── TAB: MANAGE ── -->
              <template v-else-if="activeTab === 'manage'">
                <!-- Loading state -->
                <div v-if="isLoadingPhotos" class="manage-loading">
                  <div class="spinner" />
                  <span>Cargando fotos...</span>
                </div>

                <!-- Empty state -->
                <div v-else-if="existingPhotos.length === 0" class="manage-empty">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" color="#d1d5db">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <p>Esta pieza no tiene fotos todavía</p>
                </div>

                <!-- Photos grid -->
                <div v-else class="manage-area">
                  <!-- Toolbar -->
                  <div class="manage-toolbar">
                    <div class="manage-toolbar-left">
                      <span class="photos-counter">{{ existingPhotos.length }} fotos</span>
                      <span v-if="manageMode === 'delete' && selectedForDelete.length > 0" class="selected-badge">
                        {{ selectedForDelete.length }} seleccionada{{ selectedForDelete.length !== 1 ? 's' : '' }}
                      </span>
                    </div>
                    <div class="manage-actions">
                      <button
                        class="mode-btn"
                        :class="{ 'mode-btn--active': manageMode === 'reorder' }"
                        @click="toggleMode('reorder')"
                        :disabled="isDeleting || isReordering"
                        title="Reordenar fotos"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M3 9l4-4 4 4M7 5v14M21 15l-4 4-4-4M17 19V5"/>
                        </svg>
                        Reordenar
                      </button>
                      <button
                        class="mode-btn mode-btn--danger"
                        :class="{ 'mode-btn--active': manageMode === 'delete' }"
                        @click="toggleMode('delete')"
                        :disabled="isDeleting || isReordering"
                        title="Eliminar fotos"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                        </svg>
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <!-- Mode hint -->
                  <div v-if="manageMode" class="mode-hint">
                    <template v-if="manageMode === 'delete'">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      Haz clic en las fotos que quieres eliminar
                    </template>
                    <template v-else-if="manageMode === 'reorder'">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      Arrastra las fotos para cambiar su orden
                    </template>
                  </div>

                  <!-- Existing Photos Grid -->
                  <div class="photos-grid">
                    <div
                      v-for="(photo, index) in existingPhotos"
                      :key="photo.id"
                      class="photo-item"
                      :class="{
                        'photo-item--selected': manageMode === 'delete' && selectedForDelete.includes(photo.id),
                        'photo-item--dragging': manageMode === 'reorder' && existingDragIndex === index,
                        'photo-item--over': manageMode === 'reorder' && existingDragOverIndex === index,
                        'photo-item--selectable': manageMode === 'delete',
                        'photo-item--reorderable': manageMode === 'reorder',
                      }"
                      :draggable="manageMode === 'reorder'"
                      @click="handleExistingPhotoClick(photo)"
                      @dragstart="manageMode === 'reorder' && onExistingDragStart(index, $event)"
                      @dragover.prevent="manageMode === 'reorder' && onExistingDragOver(index)"
                      @dragend="manageMode === 'reorder' && onExistingDragEnd()"
                      @drop.prevent="manageMode === 'reorder' && onExistingDrop(index)"
                    >
                      <div class="photo-index">{{ index + 1 }}</div>
                      <img :src="photo.image_path" :alt="`foto ${index + 1}`" />

                      <!-- Delete selection overlay -->
                      <div v-if="manageMode === 'delete'" class="photo-select-overlay">
                        <div class="photo-checkbox" :class="{ 'photo-checkbox--checked': selectedForDelete.includes(photo.id) }">
                          <svg v-if="selectedForDelete.includes(photo.id)" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </div>
                      </div>

                      <!-- Reorder handle -->
                      <div v-if="manageMode === 'reorder'" class="photo-drag-handle photo-drag-handle--visible">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="9" cy="5" r="1" fill="currentColor" />
                          <circle cx="15" cy="5" r="1" fill="currentColor" />
                          <circle cx="9" cy="12" r="1" fill="currentColor" />
                          <circle cx="15" cy="12" r="1" fill="currentColor" />
                          <circle cx="9" cy="19" r="1" fill="currentColor" />
                          <circle cx="15" cy="19" r="1" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <!-- Modal Footer -->
            <div class="modal-footer">
              <!-- Upload tab footer -->
              <template v-if="activeTab === 'upload'">
                <BaseButton
                  text="Limpiar todo"
                  variant="ghost"
                  :disabled="photos.length === 0 || isUploading"
                  @click="resetPhotos"
                />
                <BaseButton
                  :text="uploadButtonText"
                  :disabled="photos.length === 0 || isUploading"
                  :loading="isUploading"
                  @click="submitUpload"
                />
              </template>

              <!-- Manage tab footer -->
              <template v-else-if="activeTab === 'manage'">
                <template v-if="manageMode === 'delete'">
                  <BaseButton
                    text="Cancelar"
                    variant="ghost"
                    :disabled="isDeleting"
                    @click="cancelManageMode"
                  />
                  <BaseButton
                    :text="deleteButtonText"
                    variant="danger-outline"
                    :disabled="selectedForDelete.length === 0 || isDeleting"
                    :loading="isDeleting"
                    @click="submitBulkDelete"
                  />
                </template>
                <template v-else-if="manageMode === 'reorder'">
                  <BaseButton
                    text="Cancelar"
                    variant="ghost"
                    :disabled="isReordering"
                    @click="cancelManageMode"
                  />
                  <BaseButton
                    text="Guardar orden"
                    :disabled="!reorderChanged || isReordering"
                    :loading="isReordering"
                    @click="submitReorder"
                  />
                </template>
                <template v-else>
                  <span class="footer-hint">Selecciona una acción para comenzar</span>
                </template>
              </template>
            </div>

            <!-- Progress Bar -->
            <div v-if="isUploading || isDeleting || isReordering" class="progress-wrapper">
              <div class="progress-bar progress-bar--indeterminate" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

// ─── Props ───────────────────────────────────────────────────────
const props = defineProps({
  pieces: {
    type: Array,
    default: () => []
  },
  bulkUploadPhotos: {
    type: Function,
    required: true
    // (slug, photosArray, onProgress) => Promise
  },
  bulkDeletePhotos: {
    type: Function,
    required: true
    // (slug, { ids: number[] }) => Promise
  },
  reorderPhotos: {
    type: Function,
    required: true
    // (slug, { photos: { id: string, position: number }[] }) => Promise
  },
  getPhotos: {
    type: Function,
    required: true
    // (slug) => Promise<photo[]>  — cada foto: { id, url|path, position? }
  }
})

// ─── State ───────────────────────────────────────────────────────
const isModalOpen    = ref(false)
const selectedPiece  = ref(null)
const activeTab      = ref('upload')

// Upload tab
const photos         = ref([])
const isDragging     = ref(false)
const isUploading    = ref(false)
const uploadProgress = ref(0)
const fileInput      = ref(null)
const dragIndex      = ref(null)
const dragOverIndex  = ref(null)

// Manage tab
const existingPhotos       = ref([])
const isLoadingPhotos      = ref(false)
const manageMode           = ref(null)   // 'delete' | 'reorder' | null
const selectedForDelete    = ref([])
const isDeleting           = ref(false)
const isReordering         = ref(false)
const existingDragIndex    = ref(null)
const existingDragOverIndex = ref(null)
const originalOrder        = ref([])     // snapshot para detectar cambios

// ─── Computed ────────────────────────────────────────────────────
const uploadButtonText = computed(() => {
  if (isUploading.value) return 'Subiendo...'
  const count = photos.value.length
  if (count === 0) return 'Subir fotos'
  return `Subir ${count} foto${count !== 1 ? 's' : ''}`
})

const deleteButtonText = computed(() => {
  const count = selectedForDelete.value.length
  if (isDeleting.value) return 'Eliminando...'
  if (count === 0) return 'Eliminar seleccionadas'
  return `Eliminar ${count} foto${count !== 1 ? 's' : ''}`
})

const reorderChanged = computed(() => {
  if (existingPhotos.value.length !== originalOrder.value.length) return false
  return existingPhotos.value.some((p, i) => p.id !== originalOrder.value[i])
})

// ─── Modal ───────────────────────────────────────────────────────
function openModal(piece) {
  selectedPiece.value = piece
  photos.value        = []
  activeTab.value     = 'upload'
  manageMode.value    = null
  isModalOpen.value   = true
}

function closeModal() {
  if (isUploading.value || isDeleting.value || isReordering.value) return
  isModalOpen.value = false
  resetPhotos()
  existingPhotos.value    = []
  selectedForDelete.value = []
  manageMode.value        = null
}

// ─── Tabs ────────────────────────────────────────────────────────
async function switchTab(tab) {
  if (activeTab.value === tab) return
  activeTab.value  = tab
  manageMode.value = null
  selectedForDelete.value = []

  if (tab === 'manage') {
    await loadExistingPhotos()
  }
}

async function loadExistingPhotos() {
  if (!selectedPiece.value) return
  isLoadingPhotos.value = true
  try {
    const result = await props.getPhotos(selectedPiece.value.slug)
    existingPhotos.value = [...result]
    originalOrder.value  = result.map(p => p.id)
  } catch (err) {
    existingPhotos.value = []
  } finally {
    isLoadingPhotos.value = false
  }
}

// ─── Manage Mode ─────────────────────────────────────────────────
function toggleMode(mode) {
  if (manageMode.value === mode) {
    cancelManageMode()
    return
  }
  manageMode.value        = mode
  selectedForDelete.value = []

  if (mode === 'reorder') {
    originalOrder.value = existingPhotos.value.map(p => p.id)
  }
}

function cancelManageMode() {
  if (manageMode.value === 'reorder') {
    // restaurar orden original
    const orderMap = new Map(originalOrder.value.map((id, i) => [id, i]))
    existingPhotos.value = [...existingPhotos.value].sort(
      (a, b) => orderMap.get(a.id) - orderMap.get(b.id)
    )
  }
  manageMode.value        = null
  selectedForDelete.value = []
}

// ─── Delete ──────────────────────────────────────────────────────
function handleExistingPhotoClick(photo) {
  if (manageMode.value !== 'delete') return
  const idx = selectedForDelete.value.indexOf(photo.id)
  if (idx === -1) {
    selectedForDelete.value.push(photo.id)
  } else {
    selectedForDelete.value.splice(idx, 1)
  }
}

async function submitBulkDelete() {
  if (!selectedPiece.value || selectedForDelete.value.length === 0) return
  isDeleting.value = true
  try {
    await props.bulkDeletePhotos(
      selectedPiece.value.slug,
      { ids: selectedForDelete.value }
    )
    existingPhotos.value    = existingPhotos.value.filter(p => !selectedForDelete.value.includes(p.id))
    originalOrder.value     = existingPhotos.value.map(p => p.id)
    selectedForDelete.value = []
    manageMode.value        = null
  } catch (err) {
    // Error handled by parent
  } finally {
    isDeleting.value = false
  }
}

// ─── Reorder (existing photos drag & drop) ───────────────────────
function onExistingDragStart(index, e) {
  existingDragIndex.value = index
  e.dataTransfer.effectAllowed = 'move'
}

function onExistingDragOver(index) {
  existingDragOverIndex.value = index
}

function onExistingDragEnd() {
  existingDragIndex.value     = null
  existingDragOverIndex.value = null
}

function onExistingDrop(toIndex) {
  const fromIndex = existingDragIndex.value
  if (fromIndex === null || fromIndex === toIndex) return

  const newPhotos = [...existingPhotos.value]
  const [moved]   = newPhotos.splice(fromIndex, 1)
  newPhotos.splice(toIndex, 0, moved)
  existingPhotos.value = newPhotos

  existingDragIndex.value     = null
  existingDragOverIndex.value = null
}

async function submitReorder() {
  if (!selectedPiece.value || !reorderChanged.value) return
  isReordering.value = true
  try {
    const payload = {
      photos: existingPhotos.value.map((p, index) => ({
        id:       String(p.id),
        position: index + 1
      }))
    }
    await props.reorderPhotos(selectedPiece.value.slug, payload)
    originalOrder.value = existingPhotos.value.map(p => p.id)
    manageMode.value    = null
  } catch (err) {
    // Error handled by parent
  } finally {
    isReordering.value = false
  }
}

// ─── Upload tab helpers ──────────────────────────────────────────
function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileInput(e) {
  addFiles(Array.from(e.target.files))
  e.target.value = ''
}

function handleDrop(e) {
  isDragging.value = false
  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
  addFiles(files)
}

function addFiles(files) {
  const remainingSlots = 9 - photos.value.length
  const filesToAdd     = files.slice(0, remainingSlots)

  filesToAdd.forEach(file => {
    photos.value.push({
      id:      crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file)
    })
  })
}

function removePhoto(index) {
  URL.revokeObjectURL(photos.value[index].preview)
  photos.value.splice(index, 1)
}

function resetPhotos() {
  photos.value.forEach(p => URL.revokeObjectURL(p.preview))
  photos.value = []
}

function onDragStart(index, e) {
  dragIndex.value = index
  e.dataTransfer.effectAllowed = 'move'
}

function onDragOver(index)  { dragOverIndex.value = index }
function onDragEnd()        { dragIndex.value = null; dragOverIndex.value = null }

function onDrop(toIndex) {
  const fromIndex = dragIndex.value
  if (fromIndex === null || fromIndex === toIndex) return
  const arr = [...photos.value]
  const [moved] = arr.splice(fromIndex, 1)
  arr.splice(toIndex, 0, moved)
  photos.value   = arr
  dragIndex.value = null
  dragOverIndex.value = null
}

async function submitUpload() {
  if (!selectedPiece.value || photos.value.length === 0) return
  isUploading.value  = true
  uploadProgress.value = 0
  try {
    await props.bulkUploadPhotos(
      selectedPiece.value.slug,
      photos.value,
      (progress) => { uploadProgress.value = progress }
    )
    setTimeout(() => closeModal(), 800)
  } catch (err) {
    // Error handled by parent
  } finally {
    isUploading.value  = false
    uploadProgress.value = 0
  }
}

</script>

<style scoped>
/* ─── Base ─────────────────────────────────────────────────────── */
.bulk-upload {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* ─── Section (Piezas) ─────────────────────────────────────────── */
.section {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 1.25rem;
  padding: 1.75rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1a0e09;
  margin: 0;
  text-transform: uppercase;
}

.section-badge {
  font-size: 0.75rem;
  color: #9ca3af;
}

.pieces-grid {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.piece-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  margin-top: 0.2rem;
}

.piece-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
}

.piece-avatar {
  width: 60px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background-color: #f3f4f6;
}

.piece-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.piece-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.piece-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
}

.piece-hint {
  font-size: 0.7rem;
  color: #9ca3af;
  transition: color 0.15s ease;
}

.piece-card:hover .piece-hint {
  color: var(--color-primary);
}

/* ─── Modal ─────────────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  padding: 1rem;
}

.modal-container {
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 680px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.modal-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
  background-color: #f3f4f6;
}

.modal-badge {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
}

.modal-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 50%;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.close-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ─── Tabs ──────────────────────────────────────────────────────── */
.modal-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid #f3f4f6;
  padding: 0 1.5rem;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.75rem 0.25rem;
  margin-right: 1.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #9ca3af;
  border: none;
  background: transparent;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
  bottom: -1px;
}

.tab-btn:hover {
  color: #374151;
}

.tab-btn--active {
  color: var(--color-primary, #2563eb);
  border-bottom-color: var(--color-primary, #2563eb);
}

.tab-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.tab-count {
  background: #e5e7eb;
  color: #6b7280;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
}

.tab-btn--active .tab-count {
  background: color-mix(in srgb, var(--color-primary, #2563eb) 15%, white);
  color: var(--color-primary, #2563eb);
}

/* ─── Modal Body ────────────────────────────────────────────────── */
.modal-body {
  padding: 1.5rem;
  min-height: 240px;
}

/* ─── Drop Area ─────────────────────────────────────────────────── */
.drop-area {
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  padding: 2.5rem 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.drop-area:hover,
.drop-area--active {
  border-color: var(--color-primary);
  background-color: #eff6ff;
}

.drop-icon {
  color: #9ca3af;
  margin-bottom: 0.75rem;
  transition: color 0.2s ease;
}

.drop-area:hover .drop-icon,
.drop-area--active .drop-icon {
  color: var(--color-primary);
}

.drop-primary {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin: 0 0 0.25rem 0;
}

.drop-secondary {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
}

/* ─── Photos Area (upload) ──────────────────────────────────────── */
.photos-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.photos-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.photos-counter {
  font-size: 0.75rem;
  color: #6b7280;
}

/* ─── Photos Grid (shared) ──────────────────────────────────────── */
.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
}

.photo-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: grab;
  border: 2px solid transparent;
  transition: all 0.15s ease;
  background-color: #f9fafb;
}

.photo-item:active {
  cursor: grabbing;
}

.photo-item--dragging {
  opacity: 0.4;
  transform: scale(0.95);
}

.photo-item--over {
  border-color: var(--color-primary);
  transform: scale(1.02);
}

/* Delete mode styles */
.photo-item--selectable {
  cursor: pointer;
}

.photo-item--selectable:hover {
  border-color: #ef4444;
}

.photo-item--selected {
  border-color: #ef4444 !important;
  opacity: 0.85;
}

/* Reorder mode styles */
.photo-item--reorderable {
  cursor: grab;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.photo-index {
  position: absolute;
  top: 0.25rem;
  left: 0.25rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
  pointer-events: none;
  z-index: 2;
}

.photo-delete {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 4px;
  color: white;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s ease;
  z-index: 2;
}

.photo-item:hover .photo-delete {
  opacity: 1;
}

.photo-delete:hover {
  background: #ef4444;
}

.photo-drag-handle {
  position: absolute;
  bottom: 0.25rem;
  right: 0.25rem;
  color: rgba(255, 255, 255, 0.7);
  opacity: 0;
  transition: opacity 0.15s ease;
  pointer-events: none;
  z-index: 2;
}

.photo-item:hover .photo-drag-handle {
  opacity: 1;
}

.photo-drag-handle--visible {
  opacity: 1 !important;
}

/* Delete selection overlay */
.photo-select-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 0.25rem;
  z-index: 2;
}

.photo-checkbox {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.photo-checkbox--checked {
  background: #ef4444;
  border-color: #ef4444;
}

/* ─── Manage area ───────────────────────────────────────────────── */
.manage-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 160px;
  color: #9ca3af;
  font-size: 0.875rem;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e5e7eb;
  border-top-color: var(--color-primary, #2563eb);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.manage-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 160px;
  color: #9ca3af;
  font-size: 0.875rem;
}

.manage-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.manage-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.manage-toolbar-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.selected-badge {
  font-size: 0.7rem;
  font-weight: 600;
  background: #fee2e2;
  color: #ef4444;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
}

.manage-actions {
  display: flex;
  gap: 0.5rem;
}

.mode-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #fff;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s ease;
}

.mode-btn:hover:not(:disabled) {
  background: #f9fafb;
  color: #374151;
  border-color: #d1d5db;
}

.mode-btn--active {
  background: #eff6ff;
  color: var(--color-primary, #2563eb);
  border-color: var(--color-primary, #2563eb);
}

.mode-btn--danger.mode-btn--active {
  background: #fee2e2;
  color: #ef4444;
  border-color: #ef4444;
}

.mode-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.mode-hint {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #6b7280;
  background: #f9fafb;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
}

/* ─── Modal Footer ──────────────────────────────────────────────── */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #f3f4f6;
}

.footer-hint {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-right: auto;
}

/* ─── Progress Bar ──────────────────────────────────────────────── */
.progress-wrapper {
  height: 3px;
  background-color: #f3f4f6;
  border-radius: 0 0 16px 16px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: var(--color-primary);
  transition: width 0.3s ease;
}

.progress-bar--indeterminate {
  width: 40% !important;
  animation: indeterminate 1.2s ease-in-out infinite;
}

@keyframes indeterminate {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}

/* ─── Transitions ───────────────────────────────────────────────── */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.2s ease;
}

.modal-fade-enter-from .modal-container {
  transform: scale(0.95) translateY(-10px);
}

.modal-fade-leave-to .modal-container {
  transform: scale(0.95) translateY(10px);
}
</style>