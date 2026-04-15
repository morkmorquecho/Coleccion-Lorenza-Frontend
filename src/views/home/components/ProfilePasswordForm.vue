<template>
  <div class="field-group">
    <label class="field-label">Contraseña</label>
    <div v-if="!isEditing" class="field-row">
      <span class="field-value">••••••••</span>
      <BaseButton text="Cambiar" variant="ghost" size="small" @click="startEditing" />
    </div>
    <div v-else class="field-edit">
      <FormField
        type="password"
        v-model="formData.currentPassword"
        placeholder="Contraseña actual"
        :errors="errors.currentPassword || []"
      />

      <FormField 
        type="password" 
        v-model="formData.newPassword" 
        placeholder="Nueva contraseña"
        :errors="errors.newPassword || []"
      />

      <FormField
        type="password"
        v-model="formData.confirmPassword"
        placeholder="Confirmar contraseña"
        :errors="errors.confirmPassword || []"
      />

      <div class="edit-actions">
        <BaseButton text="Cancelar" variant="ghost" size="small" @click="cancel" />
        <BaseButton 
          text="Guardar" 
          variant="primary" 
          size="small" 
          :disabled="loading"
          @click="save" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormField from '@/components/ui/FormField.vue'

const props = defineProps({
  loading: Boolean,
  errors: Object
})

const emit = defineEmits(['save', 'cancel'])

const isEditing = ref(false)

const formData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const startEditing = () => {
  isEditing.value = true
}

const cancel = () => {
  isEditing.value = false
  formData.currentPassword = ''
  formData.newPassword = ''
  formData.confirmPassword = ''
  emit('cancel')
}

const save = () => {
  emit('save', { ...formData })
}
</script>

<style scoped>
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
.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
}
</style>