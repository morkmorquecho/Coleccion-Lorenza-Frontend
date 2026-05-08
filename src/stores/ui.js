// stores/ui.js
import { defineStore } from 'pinia'


export const useUIStore = defineStore('ui', {
  state: () => ({
    modal: {
      show:      false,
      message:   '',
      title:     '',
      animation: '',
    }
  }),

  actions: {
    showModal(message, title = 'Ocurrió un error', animation) {
      if (this.modal.show) return
      this.modal.message   = message
      this.modal.title     = title
      this.modal.animation = animation
      this.modal.show      = true  
    },

    closeModal() {
      this.modal.show      = false
      this.modal.message   = ''
      this.modal.title     = ''
      this.modal.animation = ''
    }
  }
})