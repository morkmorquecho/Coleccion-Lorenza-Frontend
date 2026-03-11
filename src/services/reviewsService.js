// src/services/reviewsService.js
import api from './api'

const reviewsService = {

  getReviews(params = {}) {
    // params: { piece, user, rating, rating_min, rating_max, page }
    return api.get('/reviews/', { params })
  },

  getReview(id) {
    return api.get(`/reviews/${id}/`)
  },

  createReview(data) {
    // data es FormData porque incluye photo (opcional)
    // { piece, rating, comment, photo }
    return api.post('/reviews/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  updateReview(id, data) {
    return api.patch(`/reviews/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  deleteReview(id) {
    return api.delete(`/reviews/${id}/`)
  },

}

export default reviewsService