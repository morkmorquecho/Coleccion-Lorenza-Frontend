<template>
  <div class="profile-page">
    <ModalComponent
      v-model="showModal"
      title="Actualizacion de correo pendiente"
      subtitle="Necesitas Revisar la bandeja de entrada del nuevo correo para terminar la solicitud"
      @close="onModalClose"
    >
      <template #lottie>
        <div ref="lottieContainer" style="width:100%;height:100%;"></div>
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

        <!-- Editar correo -->
        <div class="field-group">
          <label class="field-label">Correo electrónico</label>
          <div v-if="!editing.email" class="field-row">
            <span class="field-value">{{ user.email }}</span>
            <BaseButton 
              text="Editar" 
              variant="ghost"
              size="small"
              @click="editing.email = true"
            />
          </div>
          <div v-else class="field-edit">
            <input
              class="profile-input"
              type="email"
              v-model="forms.email"
              placeholder="nuevo@correo.com"
            />
            <input
              class="profile-input"
              type="password"
              v-model="forms.emailPassword"
              placeholder="Contraseña"
            />
            <div class="edit-actions">
              <BaseButton 
                text="Cancelar" 
                variant="ghost"
                size="small"
                @click="editing.email = false"
              />
              <BaseButton 
                text="Guardar" 
                variant="primary"
                size="small"
                @click="saveEmail"
              />
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Cambiar contraseña -->
        <div class="field-group">
          <label class="field-label">Contraseña</label>
          <div v-if="!editing.password" class="field-row">
            <span class="field-value">••••••••</span>
            <BaseButton 
              text="Cambiar" 
              variant="ghost"
              size="small"
              @click="editing.password = true"
            />
          </div>
          <div v-else class="field-edit">
            <input
              class="profile-input"
              type="password"
              v-model="forms.currentPassword"
              placeholder="Contraseña actual"
            />
            <input
              class="profile-input"
              type="password"
              v-model="forms.newPassword"
              placeholder="Nueva contraseña"
            />
            <input
              class="profile-input"
              type="password"
              v-model="forms.confirmPassword"
              placeholder="Confirmar contraseña"
            />
            <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
            <div class="edit-actions">
              <BaseButton 
                text="Cancelar" 
                variant="ghost"
                size="small"
                @click="cancelPassword"
              />
              <BaseButton 
                text="Guardar" 
                variant="primary"
                size="small"
                @click="savePassword"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Sección: Direcciones -->
      <section class="glass-card">
        <div class="section-header">
          <h3 class="section-title">Mis direcciones</h3>
          <BaseButton 
            text="+ Agregar" 
            variant="primary"
            size="small"
            :disabled="loadingAddresses"
            @click="openAddressModal()"
          />
        </div>

        <div v-if="loadingAddresses" class="loading-state">
          <p>Cargando direcciones...</p>
        </div>

        <div v-else-if="addresses.length === 0" class="empty-state">
          <p>No tienes direcciones guardadas.</p>
        </div>

        <div v-else class="address-list">
          <div
            v-for="address in addresses"
            :key="address.id"
            class="address-card"
            :class="{ 'address-card--default': address.is_default }"
          >
            <div class="address-card__top">
              <div class="address-card__info">
                <p class="address-name">{{ address.recipient_name }}</p>
                <p class="address-detail">
                  {{ address.street }} #{{ address.street_number }}, {{ address.neighborhood }},
                  {{ address.city }}, {{ address.state }} {{ address.postal_code }}
                </p>
                <p class="address-phone">{{ address.phone_number }}</p>
              </div>
              <span v-if="address.is_default" class="badge-default">Principal</span>
            </div>
            <div class="address-card__actions">
              <BaseButton
                v-if="!address.is_default"
                text="Marcar como principal"
                variant="ghost"
                size="xsmall"
                @click="setDefault(address.id)"
              />
              <BaseButton
                text="Editar"
                variant="ghost"
                size="xsmall"
                @click="openAddressModal(address)"
              />
              <BaseButton
                text="Eliminar"
                variant="danger-ghost"
                size="xsmall"
                @click="deleteAddress(address.id)"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Cerrar sesión -->
      <section class="glass-card">
        <div class="logout-row">
          <div>
            <p class="field-label">Sesión activa</p>
            <p class="field-value">Cerrar tu cuenta en este dispositivo</p>
          </div>
          <BaseButton 
            text="Cerrar sesión" 
            variant="danger-outline"
            @click="logout"
          />
        </div>
      </section>
    </div>

    <!-- Modal: Agregar / Editar dirección -->
    <Transition name="modal">
      <div v-if="modal.open" class="modal-overlay" @click.self="closeModal">
        <div class="modal-card">
          <h3 class="section-title" style="margin-bottom: 1.25rem">
            {{ modal.isEdit ? 'Editar dirección' : 'Nueva dirección' }}
          </h3>

          <div class="modal-fields">
            <input
              class="profile-input"
              v-model="modal.form.recipient_name"
              placeholder="Nombre del destinatario"
            />
            <input
              class="profile-input"
              v-model="modal.form.phone_number"
              placeholder="Número de teléfono"
            />
            <select class="profile-input" v-model="modal.form.country">
              <option value="mexico">México</option>
            </select>
            <input class="profile-input" v-model="modal.form.state" placeholder="Estado" />
            <input class="profile-input" v-model="modal.form.city" placeholder="Ciudad" />
            <input
              class="profile-input"
              v-model="modal.form.neighborhood"
              placeholder="Colonia/Barrio"
            />
            <input class="profile-input" v-model="modal.form.street" placeholder="Calle" />
            <div class="input-row">
              <input
                class="profile-input"
                v-model="modal.form.street_number"
                placeholder="Número"
                type="number"
              />
              <input
                class="profile-input"
                v-model="modal.form.apartment_number"
                placeholder="Apto/Depto (opcional)"
              />
            </div>
            <input
              class="profile-input"
              v-model="modal.form.postal_code"
              placeholder="Código postal"
            />
            <input
              class="profile-input"
              v-model="modal.form.reference"
              placeholder="Referencia/Indicaciones (opcional)"
            />
          </div>

          <p v-if="errors.address" class="field-error">{{ errors.address }}</p>

          <div class="modal-actions">
            <BaseButton 
              text="Cancelar" 
              variant="ghost"
              @click="closeModal"
            />
            <BaseButton 
              :text="modal.isEdit ? 'Actualizar' : 'Guardar dirección'" 
              variant="primary"
              @click="saveAddress"
            />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import authService from '@/services/authService'
import { useAuthStore } from '@/stores/auth'
import userService from '@/services/userService'
import { useRouter } from 'vue-router'
import ModalComponent from '@/components/ui/ModalComponent.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import lottie from 'lottie-web'

const router = useRouter()
const authStore = useAuthStore()

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

const lottieContainer = ref(null)
let anim = null
const addresses = ref([])
const loadingAddresses = ref(false)
const showModal = ref(false)

const fetchAddresses = async () => {
  try {
    loadingAddresses.value = true
    const response = await userService.getAddresses()
    addresses.value = response.results || []
  } catch (error) {
    console.error('Error cargando direcciones:', error)
    addresses.value = []
  } finally {
    loadingAddresses.value = false
  }
}

onMounted(() => {
  fetchAddresses()
})

  watch(showModal, async (val) => {
    if (val) {
      await nextTick()
      if (!lottieContainer.value) return
      if (typeof lottie !== 'undefined') {
        anim = lottie.loadAnimation({
          container: lottieContainer.value,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: '/animations/Quetzal.json'
        })
      }
    } else {
      if (anim) {
        anim.destroy()
        anim = null
      }
    }
  })

const onModalClose = () => {
  showModal.value = false
}

const editing = ref({ email: false, password: false })
const errors = ref({ password: '', address: '' })

const forms = ref({
  email: '',
  emailPassword: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const saveEmail = async () => {
  if (!forms.value.email || !forms.value.emailPassword) return
  const payload = {
    email: forms.value.email,
    password: forms.value.emailPassword,
  }
  forms.value.email = ''
  forms.value.emailPassword = ''
  editing.value.email = false
  try {
    await userService.requestEmailChange(payload)
    showModal.value = true
  } catch (error) {
    console.log('error.context:', error.context)
    errors.value = error.context || {}
  }
}

const savePassword = () => {
  errors.value.password = ''
  if (forms.value.newPassword !== forms.value.confirmPassword) {
    errors.value.password = 'Las contraseñas no coinciden.'
    return
  }
  if (forms.value.newPassword.length < 6) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres.'
    return
  }
  // await authService.changePassword(forms.value)
  cancelPassword()
}

const cancelPassword = () => {
  editing.value.password = false
  forms.value.currentPassword = ''
  forms.value.newPassword = ''
  forms.value.confirmPassword = ''
  errors.value.password = ''
}

// ── Direcciones ──────────────────────────────
const modal = ref({
  open: false,
  isEdit: false,
  editId: null,
  form: {
    recipient_name: '',
    country: 'mexico',
    state: '',
    city: '',
    postal_code: '',
    neighborhood: '',
    street: '',
    street_number: '',
    phone_number: '',
    reference: '',
    apartment_number: '',
  },
})

const openAddressModal = (address = null) => {
  errors.value.address = ''
  if (address) {
    modal.value = {
      open: true,
      isEdit: true,
      editId: address.id,
      form: {
        recipient_name: address.recipient_name,
        country: address.country,
        state: address.state,
        city: address.city,
        postal_code: address.postal_code,
        neighborhood: address.neighborhood,
        street: address.street,
        street_number: address.street_number,
        phone_number: address.phone_number,
        reference: address.reference,
        apartment_number: address.apartment_number,
      },
    }
  } else {
    modal.value = {
      open: true,
      isEdit: false,
      editId: null,
      form: {
        recipient_name: '',
        country: 'mexico',
        state: '',
        city: '',
        postal_code: '',
        neighborhood: '',
        street: '',
        street_number: '',
        phone_number: '',
        reference: '',
        apartment_number: '',
      },
    }
  }
}

const closeModal = () => {
  modal.value.open = false
}

const saveAddress = async () => {
  const f = modal.value.form
  if (
    !f.recipient_name ||
    !f.street ||
    !f.street_number ||
    !f.city ||
    !f.state ||
    !f.postal_code ||
    !f.phone_number
  ) {
    errors.value.address = 'Los campos obligatorios no pueden estar vacíos.'
    return
  }
  try {
    if (modal.value.isEdit) {
      await userService.updateAddress(modal.value.editId, f)
      const idx = addresses.value.findIndex((a) => a.id === modal.value.editId)
      addresses.value[idx] = { ...addresses.value[idx], ...f }
    } else {
      const response = await userService.createAddress(f)
      addresses.value.push(response)
    }
    closeModal()
  } catch (error) {
    console.error('Error guardando dirección:', error)
    errors.value.address = 'Error al guardar la dirección. Intenta de nuevo.'
  }
}

const setDefault = async (id) => {
  try {
    await userService.setDefaultAddress(id)
    addresses.value.forEach((a) => (a.is_default = a.id === id))
  } catch (error) {
    console.error('Error al establecer dirección por defecto:', error)
  }
}

const deleteAddress = async (id) => {
  try {
    await userService.deleteAddress(id)
    addresses.value = addresses.value.filter((a) => a.id !== id)
  } catch (error) {
    console.error('Error al eliminar dirección:', error)
  }
}

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
  margin-top: 4.5em;
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
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}
.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1a0e09;
  margin: 0 0 1.25rem;
}

/* ── Campos ── */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.field-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.field-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.field-value {
  font-size: 0.95rem;
  color: #374151;
}
.field-edit {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}
.field-error {
  font-size: 0.82rem;
  color: var(--color-primary);
  margin: 0;
}
.divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
  margin: 1.25rem 0;
}

/* ── Inputs ── */
.profile-input {
  width: 100%;
  padding: 0.8rem 1.1rem;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 0.75rem;
  color: #1a0e09;
  font-size: 0.92rem;
  outline: none;
  transition:
    box-shadow 0.2s,
    border-color 0.2s;
  box-sizing: border-box;
}
.profile-input::placeholder {
  color: #9ca3af;
}
.profile-input:focus {
  border-color: color-mix(in srgb, var(--color-primary) 40%, transparent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 12%, transparent);
}
.profile-input[type='number'] {
  font-family: inherit;
}

/* ── Edit actions ── */
.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
}

/* ── Direcciones ── */
.address-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
.address-card {
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 0.85rem;
  padding: 1rem 1.15rem;
  background: rgba(255, 255, 255, 0.5);
  transition: border-color 0.2s;
}
.address-card--default {
  border-color: color-mix(in srgb, var(--color-primary) 35%, transparent);
  background: color-mix(in srgb, var(--color-primary) 3%, transparent);
}
.address-card__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
}
.address-card__info {
  flex: 1;
}
.address-name {
  font-weight: 700;
  font-size: 0.92rem;
  color: #1a0e09;
  margin: 0 0 0.2rem;
}
.address-detail {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}
.address-phone {
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0.3rem 0 0;
}
.address-card__actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.85rem;
  flex-wrap: wrap;
}
.badge-default {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  padding: 0.25rem 0.6rem;
  border-radius: 99px;
  white-space: nowrap;
  flex-shrink: 0;
}
.empty-state {
  text-align: center;
  color: #9ca3af;
  font-size: 0.92rem;
  padding: 1rem 0;
}
.loading-state {
  text-align: center;
  color: #9ca3af;
  font-size: 0.92rem;
  padding: 2rem 0;
}

/* ── Input row (modal) ── */
.input-row {
  display: flex;
  gap: 0.65rem;
}
.input-row .profile-input {
  flex: 1;
}

/* ── Modal ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.modal-card {
  width: 100%;
  max-width: 480px;
  background: #fffbf7;
  border-radius: 1.25rem;
  padding: 2rem 1.75rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}
.modal-fields {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-bottom: 0.75rem;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
  margin-top: 1.25rem;
}

/* ── Transición modal ── */
.modal-enter-active,
.modal-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.22s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.97) translateY(6px);
}
</style>