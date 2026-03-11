// src/services/authService.js
import api from './api'

const authService = {

  login(credentials) {
    // credentials: { username, password } o { email, password }
    return api.post('/auth/login/', credentials)
  },

  register(data) {
    // data: { username, email, password, password2 }
    return api.post('/auth/register/', data)
  },

  logout(refreshToken) {
    // Invalida el refresh token en Django (lo manda a blacklist)
    return api.post('/auth/logout/', { refresh: refreshToken })
  },

  verifyEmail(token) {
    // token viene como query param desde el link del correo
    return api.get('/auth/email/verify/', { params: { token } })
  },

  resendToken(email) {
    return api.post('/auth/resend-token/', { email })
  },

  requestPasswordReset(email) {
    return api.post('/auth/password/reset/', { email })
  },

  confirmPasswordReset(data) {
    // data: { uidb64, token, new_password }
    return api.post('/auth/password/reset/confirm/', data)
  },

  loginWithGoogle(accessToken) {
    return api.post('/auth/oauth/google/', { access_token: accessToken })
  },

  loginWithFacebook(accessToken) {
    return api.post('/auth/oauth/facebook/', { access_token: accessToken })
  },

}

export default authService