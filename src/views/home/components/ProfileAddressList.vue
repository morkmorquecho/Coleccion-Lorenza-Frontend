<template>
  <div>
    <div class="section-header">
      <h3 class="section-title">Mis direcciones</h3>
      <BaseButton
        text="+ Agregar"
        variant="primary"
        size="small"
        :disabled="loading"
        @click="$emit('add')"
      />
    </div>

    <div v-if="loading" class="loading-state">
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
            :disabled="loading"
            @click="$emit('set-default', address.id)"
          />
          <BaseButton
            text="Editar"
            variant="ghost"
            size="xsmall"
            :disabled="loading"
            @click="$emit('edit', address)"
          />
          <BaseButton
            text="Eliminar"
            variant="danger-ghost"
            size="xsmall"
            :disabled="loading"
            @click="$emit('delete', address.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'

defineProps({
  addresses: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['add', 'edit', 'delete', 'set-default'])
</script>

<style scoped>
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
  margin: 0;
}
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
</style>