// src/services/piecesService.js
import api from './api'

const piecesService = {

  // ── PIEZAS ──
  getPieces(params = {}) {
    // params: { type, section, featured, page }
    return api.get('/pieces/', { params })
  },

  getPiece(slug) {
    return api.get(`/pieces/${slug}/`)
  },

  createPiece(data) {
    // data es FormData porque incluye thumbnail e intro_video
    return api.post('/pieces/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  updatePiece(slug, data) {
    return api.patch(`/pieces/${slug}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  deletePiece(slug) {
    return api.delete(`/pieces/${slug}/`)
  },

  // ── FOTOS ──
  getPhotos(pieceSlug) {
    return api.get(`/pieces/${pieceSlug}/photos/`)
  },

  getPhoto(pieceSlug, id) {
    return api.get(`/pieces/${pieceSlug}/photos/${id}/`)
  },

  uploadPhoto(pieceSlug, data) {
    // data es FormData con { image_path, position }
    return api.post(`/pieces/${pieceSlug}/photos/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  bulkUploadPhotos(pieceSlug, photos, onProgress) {
    const formData = new FormData()

    photos.forEach((photo, index) => {
      formData.append('images', photo.file)
      formData.append('positions', index + 1)
    })

    return api.post(`/pieces/${pieceSlug}/photos/bulk-create/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        const progress = Math.round((e.loaded / e.total) * 100)
        onProgress?.(progress)   // ← llama el callback si existe
      }
    })
  },

  bulkDeletePhotos(pieceSlug, ids) {
    // ids: array de números [1, 2, 3]
    return api.delete(`/pieces/${pieceSlug}/photos/bulk-delete/`, {
      data: { ids }
      // En axios, DELETE con body va en `data`, no en `params`
    })
  },

  reorderPhotos(pieceSlug, photos) {
    // photos: [{ id: 1, position: 2 }, { id: 2, position: 1 }]
    return api.patch(`/pieces/${pieceSlug}/photos/reorder/`, { photos })
  },

  updatePhoto(pieceSlug, id, data) {
    return api.patch(`/pieces/${pieceSlug}/photos/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  deletePhoto(pieceSlug, id) {
    return api.delete(`/pieces/${pieceSlug}/photos/${id}/`)
  },

  // ── DESCUENTOS ──
  getDiscounts(pieceSlug) {
    return api.get(`/pieces/${pieceSlug}/discounts/`)
  },

  getDiscount(pieceSlug, id) {
    return api.get(`/pieces/${pieceSlug}/discounts/${id}/`)
  },

  // ── SECCIONES ──
  getSections() {
    return api.get('/sections/')
  },

  getSection(key) {
    return api.get(`/sections/${key}/`)
  },

  // ── TIPOS ──
  getTypes() {
    return api.get('/types/')
  },

  getType(key) {
    return api.get(`/types/${key}/`)
  },

}

export default piecesService