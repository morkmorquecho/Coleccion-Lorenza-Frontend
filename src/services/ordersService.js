// src/services/ordersService.js
import api from './api'

const ordersService = {

  // ── ÓRDENES ──
  getOrders(params = {}) {
    // params: { created_at, date, page }
    return api.get('/orders/', { params })
  },

  getOrder(id) {
    return api.get(`/orders/${id}/`)
  },

  cancelOrder(id) {
    // Si está pending → cancela PaymentIntent en Stripe
    // Si está paid → genera reembolso en Stripe
    return api.post(`/orders/${id}/cancel/`)
  },

  consultCoupon(params) {
    return api.get('orders/coupons/validate/', { params })
  },
  
  // ── CHECKOUT ──
  checkout(data) {
    // data viene directo de cartStore.toCheckoutPayload() + dirección + método de pago
    // { address, payment_method, items: [{ piece, quantity }], coupon_code }
    // Retorna { client_secret } para completar el pago con Stripe en el front
    return api.post('/orders/checkout/', data)
  },

  // ── SHIPPING TRACKING ──
  getShippingTrackings(params = {}) {
    // Lista general de todos los trackings del usuario
    return api.get('/shipping-trackings/', { params })
  },

  getShippingTracking(id) {
    return api.get(`/shipping-trackings/${id}/`)
  },

  getOrderShippingTrackings(orderPk) {
    // Trackings de una orden específica
    return api.get(`/orders/${orderPk}/shipping-trackings/`)
  },

  getOrderShippingTracking(orderPk, id) {
    return api.get(`/orders/${orderPk}/shipping-trackings/${id}/`)
  },

  getUsdRate(){
    return api.get('usd-mxn-rate/')
  },

}

export default ordersService