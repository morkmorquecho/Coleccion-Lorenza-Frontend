// src/services/userService.js
import api from './api'

const userService = {

  // ── DIRECCIONES ──
  getAddresses(params = {}) {
    return api.get('/users/me/addresses/', {params})
  },

  getAddress(id) {
    return api.get(`/users/me/addresses/${id}/`)
  },

  createAddress(data) {
    return api.post('/users/me/addresses/', data)
  },

  updateAddress(id, data) {
    return api.patch(`/users/me/addresses/${id}/`, data)
  },

  deleteAddress(id) {
    return api.delete(`/users/me/addresses/${id}/`)
  },

  setDefaultAddress(id) {
    return api.patch(`/users/me/addresses/${id}/set-default/`)
  },

  // ── WISHLIST ──
  getWishlist() {
    return api.get('/users/me/wishlist/')
  },

  addToWishlist(pieceId) {
    return api.post('/users/me/wishlist/', { piece_id: pieceId })
  },

  removeFromWishlist(id) {
    return api.delete(`/users/me/wishlist/${id}/`)
  },

  // ── EMAIL ──
  requestEmailChange(data) {
    // data: { email, password }
    return api.post('/users/me/email/request-change', data)
  },

}

export default userService