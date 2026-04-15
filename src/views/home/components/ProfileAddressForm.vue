<template>
  <Transition name="modal">
    <div v-if="open" class="modal-overlay" @click.self="handleClose">
      <div class="modal-card">
        <h3 class="section-title" style="margin-bottom: 1.25rem">
          {{ isEdit ? 'Editar dirección' : 'Nueva dirección' }}
        </h3>

        <div class="modal-fields">
          <FormField 
            v-model="formData.recipient_name" 
            placeholder="Nombre del destinatario"
            :errors="errors.recipient_name || []"
          />
          <FormField 
            v-model="formData.phone_number" 
            placeholder="Número de teléfono"
            :errors="errors.phone_number || []"
          />
          <FormField 
            v-model="formData.country" 
            placeholder="País"
            :errors="errors.country || []"
          />
          <FormField 
            v-model="formData.state" 
            placeholder="Estado"
            :errors="errors.state || []"
          />
          <FormField 
            v-model="formData.city" 
            placeholder="Ciudad"
            :errors="errors.city || []"
          />
          <FormField 
            v-model="formData.neighborhood" 
            placeholder="Colonia/Barrio"
            :errors="errors.neighborhood ? [errors.neighborhood] : []"
          />
          <FormField 
            v-model="formData.street" 
            placeholder="Calle"
            :errors="errors.street ? [errors.street] : []"
          />
          <div class="input-row">
            <FormField 
              v-model="formData.street_number" 
              placeholder="Número" 
              type="number"
              :errors="errors.street_number ? [errors.street_number] : []"
            />
            <FormField
              v-model="formData.apartment_number"
              placeholder="Apto/Depto (opcional)"
            />
          </div>
          <FormField 
            v-model="formData.postal_code" 
            placeholder="Código postal"
            :errors="errors.postal_code ? [errors.postal_code] : []"
          />
          <FormField
            v-model="formData.reference"
            placeholder="Referencia/Indicaciones (opcional)"
          />
        </div>

        <div class="modal-actions">
          <BaseButton text="Cancelar" variant="ghost" @click="handleClose" />
          <BaseButton
            :text="isEdit ? 'Actualizar' : 'Guardar dirección'"
            variant="primary"
            :disabled="loading"
            @click="save"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormField from '@/components/ui/FormField.vue'

const props = defineProps({
  open: Boolean,
  isEdit: Boolean,
  address: Object,
  loading: Boolean,
  errors: Object
})

const emit = defineEmits(['close', 'save'])

const REQUIRED_FIELDS = [
  'recipient_name',
  'street',
  'street_number',
  'city',
  'state',
  'postal_code',
  'phone_number'
]

const defaultForm = {
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
  apartment_number: ''
}

const formData = reactive({ ...defaultForm })

// Watch para cargar datos cuando se abre el modal con una dirección existente
watch(() => props.open, (isOpen) => {
  if (isOpen && props.address) {
    Object.assign(formData, props.address)
  } else if (isOpen && !props.address) {
    Object.assign(formData, defaultForm)
  }
})

const save = () => {
  emit('save', { ...formData })
}

const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto; 
}

.modal-card {
  width: 100%;
  max-width: 480px;
  max-height: calc(100vh - 2rem);
  background: #fffbf7;
  border-radius: 1.25rem;
  padding: 2rem 1.75rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  display: flex;          
  flex-direction: column; 
}
.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1a0e09;
  margin: 0;
}

.modal-fields {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-bottom: 0.75rem;
  overflow-y: auto;   
  padding: 1em; 
}
.input-row {
  display: flex;
  gap: 0.65rem;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
  margin-top: 1.25rem;
}
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease, transform 0.22s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.97) translateY(6px);
}
</style>