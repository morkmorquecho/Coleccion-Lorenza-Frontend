<template>
  <div class="profile-page">
      <ModalComponent
        v-model="showModal"
        :title="modalTitle"
        :subtitle="modalMessage"
        :show-cancel="modalShowCancel"
        confirm-text="Confirmar"
        cancel-text="Cancelar"
        @confirm="onModalConfirm"
        @close="onModalClose"
      >
      <template #lottie>
        <LottiePlayer :path="animationPath" />
      </template>
    </ModalComponent>

    <div class="blob blob--br"></div>
    <div class="blob blob--tl"></div>

    <div class="profile-wrapper">
      <!-- Cabecera de cuenta -->
      <div class="profile-header glass-card">
        <div class="avatar-circle">
          {{ userInitials }}
        </div>
        <div>
          <h2 class="profile-name">{{ user.username }}</h2>
          <p class="profile-email">{{ user.email }}</p>
        </div>
      </div>

      <!-- Sección: Datos de cuenta -->
      <section class="glass-card">
        <h3 class="section-title">Datos de la cuenta</h3>

        <ProfileEmailForm 
          :current-email="user.email"
          :loading="loadingEmail"
          :errors="emailFieldErrors"
          @save="onSaveEmail"
        />

        <div class="divider"></div>

        <ProfilePasswordForm 
          :loading="loadingPassword"
          :errors="passwordFieldErrors"
          @save="onSavePassword" 
        />
      </section>

      <!-- Sección: Direcciones -->
      <section class="glass-card">
        <ProfileAddressList
          :addresses="addresses"
          :loading="loadingAddresses"
          @add="openAddressModal"
          @edit="openAddressModal"
          @delete="deleteAddress"
          @set-default="setDefault"
        />
      </section>

      <PhotosForm
        v-if="authStore.isAdmin"
        :pieces="pieces"
        :bulk-upload-photos="bulkUploadPhotos"
        :bulk-delete-photos="bulkDeletePhotos"
        :reorder-photos="reorderPhotos"
        :get-photos="getPhotos"
      />

      <!-- Cerrar sesión -->
      <section class="glass-card">
        <div class="logout-row">
          <div>
            <p class="field-label">Sesión activa</p>
            <p class="field-value">Cerrar tu cuenta en este dispositivo</p>
          </div>
          <BaseButton text="Cerrar sesión" variant="danger-outline" @click="logout" />
        </div>
      </section>
    </div>

    <!-- Modal: Agregar / Editar dirección -->
    <ProfileAddressForm
      :open="addressModalOpen"
      :is-edit="isEditingAddress"
      :address="selectedAddress"
      :loading="loadingAddresses"
      :errors="addressFieldErrors"
      @close="closeAddressModal"
      @save="onSaveAddress"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFormHandler } from '@/composables/useFormHandler'
import { useAuthStore } from '@/stores/auth'
import authService from '@/services/authService'
import userService from '@/services/userService'
import ModalComponent from '@/components/ui/ModalComponent.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import LottiePlayer from '@/components/ui/LottiePlayer.vue'
import ProfileEmailForm from './components/ProfileEmailForm.vue'
import ProfilePasswordForm from './components/ProfilePasswordForm.vue'
import ProfileAddressList from './components/ProfileAddressList.vue'
import ProfileAddressForm from './components/ProfileAddressForm.vue'
import piecesService from '@/services/piecesService'
import PhotosForm from '../shop/components/PhotosForm.vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

const router = useRouter()
const authStore = useAuthStore()

// ── Modal configuration ─────────────────────────────────────────────────────────
const showModal = ref(false)
const modalMessage = ref('')
const modalTitle = ref('')
const animationPath = ref('')
const modalShowCancel = ref(false)
const modalConfirmCallback = ref(null)

const pieces = ref([])

const ANIMATIONS = {
  success: '/animations/burro.json',
  error: '/animations/quetzal.json',
}

function showError(msg) {
  modalMessage.value = msg
  modalTitle.value = 'Error'
  animationPath.value = ANIMATIONS.error
  modalShowCancel.value = false
  modalConfirmCallback.value = null
  showModal.value = true
}

function showSuccess(msg, title = 'Éxito') {
  modalMessage.value = msg
  modalTitle.value = title
  animationPath.value = ANIMATIONS.success
  modalShowCancel.value = false
  modalConfirmCallback.value = null
  showModal.value = true
}

function showConfirm(msg, title = '¿Estás seguro?') {
  return new Promise((resolve) => {
    modalMessage.value = msg
    modalTitle.value = title
    animationPath.value = ANIMATIONS.error
    modalShowCancel.value = true
    modalConfirmCallback.value = resolve
    showModal.value = true
  })
}

function onModalConfirm() {
  modalConfirmCallback.value?.(true)
  modalConfirmCallback.value = null
}

function onModalClose() {
  modalConfirmCallback.value?.(false)
  modalConfirmCallback.value = null
}
// ── User data ──────────────────────────────────────────────────────────────────
const user = computed(() => authStore.user)

const userInitials = computed(() => {
  if (!user.value?.username) return ''
  return user.value.username
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

// ── Email change with useFormHandler ───────────────────────────────────────────
const { 
  loading: loadingEmail, 
  fieldErrors: emailFieldErrors, 
  handleSubmit: handleEmailSubmit 
} = useFormHandler({ showError })

const onSaveEmail = async ({ email, password }) => {
  await handleEmailSubmit(async () => {

    const errors = {}

    if (!email) errors.email = ['El correo es requerido']
    if (!password) errors.password = ['La contraseña es requerida']

    if (Object.keys(errors).length) {
      throw { context: errors }
    }

    await userService.requestEmailChange({ email, password })

    showSuccess(
      'Revisa tu correo para completar el cambio',
      'Actualización pendiente'
    )
  })
}

// ── Password change with useFormHandler ────────────────────────────────────────
const { 
  loading: loadingPassword, 
  fieldErrors: passwordFieldErrors, 
  handleSubmit: handlePasswordSubmit 
} = useFormHandler()

const onSavePassword = async ({ currentPassword, newPassword, confirmPassword }) => {
  await handlePasswordSubmit(async () => {
    const errors = {}

    if (!currentPassword) errors.currentPassword = ['Requerida']
    if (!newPassword) errors.newPassword = ['Requerida']
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = ['No coinciden']
    }

    if (Object.keys(errors).length) {
      throw { type: 'field_errors', context: errors }
    }


    await authService.changePassword({
      current_password: currentPassword,
      new_password: newPassword,
      confirm_new_password: confirmPassword,
    })

    showSuccess('Contraseña actualizada correctamente')
  })
}
// ── Addresses ──────────────────────────────────────────────────────────────────
const addresses = ref([])

const fetchAddresses = async () => {
  try {
    loadingAddresses.value = true
    const response = await userService.getAddresses()
    addresses.value = response.results || []
  } catch (error) {
    showError('Ocurrió un problema cargando las direcciones, recarga la pagina o vuelvelo a intentar mas tarde')
    addresses.value = []
  } finally {
    loadingAddresses.value = false
  }
}

onMounted(async () => {
  fetchAddresses()

  const res = await piecesService.getPieces()
  pieces.value = res.results
})

// ── Address Modal with useFormHandler ──────────────────────────────────────────
const addressModalOpen = ref(false)
const isEditingAddress = ref(false)
const selectedAddress = ref(null)
const { 
  loading: loadingAddresses, 
  fieldErrors: addressFieldErrors, 
  handleSubmit: handleAddressSubmit 
} = useFormHandler()

const openAddressModal = (address = null) => {
  if (address) {
    isEditingAddress.value = true
    selectedAddress.value = { ...address }
  } else {
    isEditingAddress.value = false
    selectedAddress.value = null
  }
  addressModalOpen.value = true
}

const closeAddressModal = () => {
  addressModalOpen.value = false
  selectedAddress.value = null
}

const onSaveAddress = async (addressData) => {
  await handleAddressSubmit(async () => {

    const requiredFields = [
      'recipient_name',
      'street',
      'street_number',
      'city',
      'state',
      'postal_code',
      'phone_number'
    ]

    const errors = {}

    requiredFields.forEach(field => {
      if (!addressData[field]) {
        errors[field] = ['Este campo es requerido']
      }
    })

    if (Object.keys(errors).length) {
      throw { type: 'field_errors', context: errors }
    }

    if (isEditingAddress.value) {
      await userService.updateAddress(selectedAddress.value.id, addressData)

      const idx = addresses.value.findIndex(a => a.id === selectedAddress.value.id)
      addresses.value[idx] = { ...addresses.value[idx], ...addressData }
      cartStore.clearCart()

      showSuccess('Dirección actualizada correctamente')
    } else {
      const response = await userService.createAddress(addressData)
      addresses.value.push(response)
      cartStore.clearCart()

      showSuccess('Dirección creada correctamente')
    }

    closeAddressModal()
  })

}

// ── Address operations with useFormHandler ─────────────────────────────────────
const setDefault = async (id) => {
  loadingAddresses.value = true
  await handleAddressSubmit(async () => {
    await userService.setDefaultAddress(id)
    addresses.value.forEach((a) => (a.is_default = a.id === id))
    cartStore.clearCart()    
    showSuccess('Dirección principal actualizada')
  })
  loadingAddresses.value = false
}

const deleteAddress = async (id) => {
  const confirmed = await showConfirm('¿Estás seguro de que deseas eliminar esta dirección?', 'Eliminar dirección')
  if (!confirmed) return

  loadingAddresses.value = true
  await handleAddressSubmit(async () => {
    await userService.deleteAddress(id)
    addresses.value = addresses.value.filter((a) => a.id !== id)
    cartStore.clearCart()
    showSuccess('Dirección eliminada correctamente')
  })
  loadingAddresses.value = false
}

// ── Logout ─────────────────────────────────────────────────────────────────────
const logout = async () => {
  try {
    await authService.logout(authStore.refreshToken)
  } catch (e) {
    console.warn('Error cerrando sesión en backend')
  } finally {
    authStore.clearSession()
    router.push({ name: 'Login' })
  }
}


// BULK CREATE PHOTOS Y DEMAS
async function bulkUploadPhotos(pieceSlug, photos, onProgress) {
  try {
    await piecesService.bulkUploadPhotos(pieceSlug, photos, onProgress)

    showSuccess('Fotos subidas correctamente')
  } catch (error) {
    showError('Error al subir las fotos, intentalo mas tarde')
  }
}

async function bulkDeletePhotos(pieceSlug, payload) {
  const confirmed = await showConfirm(
    '¿Seguro que quieres eliminar las fotos seleccionadas?',
    'Eliminar fotos'
  )

  if (!confirmed) return

  try {
    await piecesService.bulkDeletePhotos(pieceSlug, payload.ids)

    showSuccess('Fotos eliminadas correctamente')
  } catch (error) {
    showError('Error al eliminar las fotos, intentalo mas tarde')
  }
}

async function reorderPhotos(pieceSlug, payload) {
  try {
    await piecesService.reorderPhotos(pieceSlug, payload.photos)


  } catch (error) {
    showError('Error al reordenar las fotos, intentalo mas tarde')
  }
}

async function getPhotos(pieceSlug) {
  try {
    const res = await piecesService.getPhotos(pieceSlug)
    return res.results ?? res
  } catch (error) {
    showError('Error al cargar las fotos, intentalo mas tarde')
    return []
  }
}

</script>

<style scoped>
/* ── Página ── */
.profile-page {
  flex: 1;
  display: flex;
  justify-content: center;
  background: var(--color-background-2);
  padding: 2rem 1rem;
  position: relative;
  overflow: hidden;
  min-height: 100%;
}

/* ── Blobs ── */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}
.blob--br {
  bottom: -2.5rem;
  right: -2.5rem;
  width: 12rem;
  height: 12rem;
  background: color-mix(in srgb, var(--color-primary) 15%, transparent);
}
.blob--tl {
  top: -2.5rem;
  left: -2.5rem;
  width: 16rem;
  height: 16rem;
  background: color-mix(in srgb, var(--color-primary) 7%, transparent);
}

/* ── Wrapper ── */
.profile-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 620px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 7em;
}

/* ── Glass card base ── */
.glass-card {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 1.25rem;
  padding: 1.75rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

/* ── Cabecera de perfil ── */
.profile-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}
.avatar-circle {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 16px color-mix(in srgb, var(--color-primary) 30%, transparent);
}
.profile-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a0e09;
  margin: 0;
}
.profile-email {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.2rem 0 0;
}

/* ── Sección ── */
.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1a0e09;
  margin: 0 0 1.25rem;
  text-transform: uppercase;
}

/* ── Campos ── */
.field-label {
  font-size: 1rem;
  font-weight: 700;
  color: #1a0e09;
  margin: 0 0 1.25rem;
  text-transform: uppercase;
}

.field-value {
  font-size: 0.95rem;
  color: #374151;
}
.divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
  margin: 1.25rem 0;
}

/* ── Logout ── */
.logout-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
</style>