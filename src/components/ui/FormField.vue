<template>
  <div class="field-group">
    <!-- SELECT -->
    <select
      v-if="options"
      v-bind="$attrs"
      class="login-input"
      :class="[
        { 'input--error': errors?.length },
        { 'input--has-value': modelValue }
      ]"
      :value="modelValue"
      required
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <!-- Placeholder real -->
      <option value="" disabled hidden>
        {{ placeholder }}
      </option>

      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>

    <!-- INPUT -->
    <input
      v-else
      v-bind="$attrs"
      class="login-input"
      :class="{ 'input--error': errors?.length }"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />

    <!-- ERRORES -->
    <transition name="field-error">
      <ul v-if="errors?.length" class="error-list" role="alert">
        <li v-for="msg in errors" :key="msg" class="error-item">
          <svg class="error-icon" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 5v3.5M8 11h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          {{ msg }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  errors: Array,
  placeholder: String,
  options: Array,
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.login-input {
  width: 100%;
  padding: .9rem 1.25rem;
  background: rgba(255, 255, 255, .7);
  border: 1px solid rgba(255, 255, 255, .25);
  border-radius: .75rem;
  color: #1a0e09;
  font-size: .95rem;
  outline: none;
  transition: all 0.25s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .05);
}

/* Placeholder visual en select */
select.login-input:invalid {
  color: #9ca3af;
}

/* Cuando ya seleccionaron algo */
.input--has-value {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(221, 75, 36, 0.5);
  font-weight: 500;
}

/* Focus elegante */
.login-input:focus {
  border-color: rgba(221, 75, 36, .4);
  box-shadow: 0 0 0 3px rgba(221, 75, 36, .15);
  transform: scale(1.01);
}

/* Error */
.input--error {
  border-color: rgba(221, 75, 36, 0.6) !important;
  box-shadow: 0 0 0 3px rgba(221, 75, 36, 0.12) !important;
  background: rgba(255, 245, 242, 0.8) !important;
}

/* Flecha custom */
select.login-input {
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%239ca3af' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

/* ERRORES */
.error-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.error-item {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  font-size: 0.78rem;
  color: #c43e1d;
  font-weight: 500;
  line-height: 1.4;
  padding-left: 0.1rem;
}

.error-icon {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
  margin-top: 1px;
  color: #dd4b24;
}

/* Animación errores */
.field-error-enter-active {
  transition: all 0.2s ease;
}
.field-error-leave-active {
  transition: all 0.15s ease;
}
.field-error-enter-from,
.field-error-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>