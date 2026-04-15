// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import AOS from "aos"
import "aos/dist/aos.css"
import '@/assets/forms.css'
import { setupInterceptors } from '@/services/api' 

const app = createApp(App)
const pinia = createPinia()

AOS.init()
app.use(pinia) 
app.use(router)         
setupInterceptors(pinia) 

app.mount('#app')