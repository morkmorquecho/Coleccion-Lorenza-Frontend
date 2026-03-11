// src/services/blogService.js
import api from './api'

const blogService = {

  getPosts(params = {}) {
    // params: { page }
    return api.get('/blog/', { params })
  },

  getPost(slug) {
    return api.get(`/blog/${slug}/`)
  },

  createPost(data) {
    // data es FormData porque incluye cover_image
    // { title, slug, content, cover_image, status, published_at, pieces[] }
    return api.post('/blog/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  updatePost(slug, data) {
    return api.patch(`/blog/${slug}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  deletePost(slug) {
    return api.delete(`/blog/${slug}/`)
  },

}

export default blogService
