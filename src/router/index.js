// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [

  // ════════════════════════════════════════
  // RUTAS PÚBLICAS — MainLayout
  // ════════════════════════════════════════
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [

      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/HomeView.vue'),
        meta: { requiresAuth: false, layout: 'main' },
      },

      // ── COLECCIONES ──
      {
        path: 'colecciones',
        name: 'Collection',
        component: () => import('@/views/collections/CollectionsView.vue'),
        meta: { requiresAuth: false, layout: 'main' },
      },

      {
        path: 'colecciones/:name',
        name: 'Detail Collection',
        component: () => import('@/views/collections/CollectionDetailView.vue'),
        meta: { requiresAuth: false, hideFooter: true, layout: 'main' },
      },

      // {
      //   path: 'perfil',
      //   name: 'Profile',
      //   component: () => import('@/views/home/ProfileView.vue'),
      //   meta: { requiresAuth: true, layout: 'main' },
      // },

      // ── PIEZAS ──
      // {
      //   path: 'piezas',
      //   name: 'Pieces',
      //   component: () => import('@/views/pieces/PieceList.vue'),
      //   meta: { requiresAuth: false }
      //   // GET /api/v1/pieces/ — filtros: ?type=&section=&featured=&page=
      // },
      // {
      //   path: 'piezas/:slug',
      //   name: 'PieceDetail',
      //   component: () => import('@/views/pieces/PieceDetail.vue'),
      //   meta: { requiresAuth: false }
      //   // GET /api/v1/pieces/:slug/
      //   // + /pieces/:slug/photos/
      //   // + /pieces/:slug/discounts/
      //   // Si authStore.isAdmin → muestra botones editar/eliminar
      // },

      // // ── BLOG ──
      // {
      //   path: 'blog',
      //   name: 'Blog',
      //   component: () => import('@/views/blog/BlogList.vue'),
      //   meta: { requiresAuth: false }
      //   // GET /api/v1/blog/
      // },
      // {
      //   path: 'blog/:slug',
      //   name: 'BlogDetail',
      //   component: () => import('@/views/blog/BlogDetail.vue'),
      //   meta: { requiresAuth: false }
      //   // GET /api/v1/blog/:slug/
      //   // Si authStore.isAdmin → muestra botones editar/eliminar
      // },

      // ── CARRITO ──
      // {
      //   path: 'carrito',
      //   name: 'Cart',
      //   component: () => import('@/views/cart/Cart.vue'),
      //   meta: { requiresAuth: false }
      //   // El carrito vive en cartStore (Pinia), no en la API
      //   // Solo al confirmar se llama /orders/checkout/
      // },
    ],
  },

  // // ════════════════════════════════════════
  // // AUTH — AuthLayout (sin header/footer)
  // // ════════════════════════════════════════
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/auth/LoginView.vue'),
        meta: { requiresAuth: false, guestOnly: true, layout: 'auth' },
        // POST /api/v1/auth/login/
        // Incluye botones OAuth Google y Facebook
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/auth/RegisterView.vue'),
        meta: { requiresAuth: false, guestOnly: true, layout: 'auth' },
        // POST /api/v1/auth/register/
      },
      {
        path: 'email/verify',
        name: 'EmailVerify',
        component: () => import('@/views/auth/EmailVerify.vue'),
        meta: { requiresAuth: false }
        // GET /api/v1/auth/email/verify/?token=XXXX
        // Aplica para: cuenta nueva Y cambio de correo
      },
      {
        path: 'resend-token',
        name: 'ResendToken',
        component: () => import('@/views/auth/ResendToken.vue'),
        meta: { requiresAuth: false }
        // POST /api/v1/auth/resend-token/ → { email }
      },
      {
        path: 'password/reset',
        name: 'PasswordReset',
        component: () => import('@/views/auth/PasswordReset.vue'),
        meta: { requiresAuth: false, guestOnly: true }
        // POST /api/v1/auth/password/reset/ → { email }
      },
      {
        path: 'reset/password/confirm/:uidb64/:token',
        name: 'PasswordResetConfirm',
        component: () => import('@/views/auth/PasswordResetConfirm.vue'),
        meta: { requiresAuth: false, guestOnly: true }
        // POST /api/v1/auth/password/reset/confirm/ → { uidb64, token, new_password }
        // uidb64 y token llegan como query params desde el link del correo
      },
    ],
  },

  // // ════════════════════════════════════════
  // // CUENTA — requiere login
  // // ════════════════════════════════════════
    {
      path: '/cuenta',
      component: () => import('@/layouts/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [

      {
        path: '',
        name: 'Profile',
        component: () => import('@/views/home/ProfileView.vue'),
      },
  //  {
  //       path: 'email',
  //       name: 'ChangeEmail',
  //       component: () => import('@/views/account/ChangeEmail.vue'),
  //       // POST /api/v1/users/me/email/request-change → { email, password }
  //       // El link de confirmación llega al nuevo correo y va a /auth/email/verify
  //     },

  //     // ── DIRECCIONES ──
  //     {
  //       path: 'direcciones',
  //       name: 'Addresses',
  //       component: () => import('@/views/account/AddressList.vue'),
  //       // GET /api/v1/users/me/addresses/
  //     },
  //     {
  //       path: 'direcciones/nueva',
  //       name: 'AddressCreate',
  //       component: () => import('@/views/account/AddressForm.vue'),
  //       // POST /api/v1/users/me/addresses/
  //     },
  //     {
  //       path: 'direcciones/:id/editar',
  //       name: 'AddressEdit',
  //       component: () => import('@/views/account/AddressForm.vue'),
  //       // PUT/PATCH /api/v1/users/me/addresses/:id/
  //       // Mismo componente que AddressCreate, detecta el :id para saber si es editar
  //     },

  //     // ── PEDIDOS ──
  //     {
  //       path: 'pedidos',
  //       name: 'Orders',
  //       component: () => import('@/views/account/OrderList.vue'),
  //       // GET /api/v1/orders/
  //     },
  //     {
  //       path: 'pedidos/:id',
  //       name: 'OrderDetail',
  //       component: () => import('@/views/account/OrderDetail.vue'),
  //       // GET /api/v1/orders/:id/
  //       // + GET /api/v1/orders/:id/shipping-trackings/
  //       // + POST /api/v1/orders/:id/cancel/ (si aplica cancelar)
  //     },

  //     // ── FAVORITOS ──
  //     {
  //       path: 'favoritos',
  //       name: 'Wishlist',
  //       component: () => import('@/views/account/Wishlist.vue'),
  //       // GET /api/v1/users/me/wishlist/
  //       // DELETE /api/v1/users/me/wishlist/:id/
  //     },

    ]
  },

  // // ════════════════════════════════════════
  // // CHECKOUT — requiere login, layout limpio
  // // ════════════════════════════════════════
  // {
  //   path: '/checkout',
  //   component: () => import('@/layouts/CheckoutLayout.vue'),
  //   meta: { requiresAuth: true, layout: 'checkout' },
  //   children: [
  //     {
  //       path: '',
  //       name: 'Checkout',
  //       component: () => import('@/views/checkout/Checkout.vue'),
  //       // POST /api/v1/orders/checkout/ → { address, payment_method, items, coupon_code }
  //       // Retorna client_secret de Stripe
  //     },
  //     {
  //       path: 'exito',
  //       name: 'CheckoutSuccess',
  //       component: () => import('@/views/checkout/CheckoutSuccess.vue'),
  //       // Stripe redirige aquí cuando el pago es exitoso
  //     },
  //   ]
  // },

  // // ════════════════════════════════════════
  // // 404
  // // ════════════════════════════════════════
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'NotFound',
  //   component: () => import('@/views/NotFound.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, from) => {
  const token = localStorage.getItem('access_token')
  const estaLogueado = !!token

  if (to.meta.requiresAuth && !estaLogueado) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && estaLogueado) {
    return { name: 'Home' }
  }
})

export default router
