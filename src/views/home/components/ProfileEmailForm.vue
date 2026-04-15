<template>
  <div class="field-group">
    <label class="field-label">Correo electrónico</label>
    <div v-if="!isEditing" class="field-row">
      <span class="field-value">{{ currentEmail }}</span>
      <BaseButton text="Editar" variant="ghost" size="small" @click="startEditing" />
    </div>
    <div v-else class="field-edit">
      <FormField
        type="email"
        v-model="formData.email"
        placeholder="nuevo@correo.com"
        :errors="errors.email || []"
      />

      <FormField
        type="password"
        v-model="formData.password"
        placeholder="Contraseña"
        :errors="errors.password || []"
      />
      <div class="edit-actions">
        <BaseButton 
          text="Cancelar" 
          variant="ghost" 
          size="small" 
          @click="cancel" 
        />
        <BaseButton 
          text="Guardar" 
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
  currentEmail: String,
  loading: Boolean,
  errors: Object
})

const emit = defineEmits(['save', 'cancel'])

const isEditing = ref(false)

const formData = reactive({
  email: '',
  password: ''
})

const startEditing = () => {
  isEditing.value = true
}

const cancel = () => {
  isEditing.value = false
  formData.email = ''
  formData.password = ''
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