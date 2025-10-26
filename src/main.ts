import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate' 
import App from './App.vue'
import router from './router'
import { usuarioStore } from '@/stores/usuario'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPersist)

app.use(pinia)
app.use(router)

const usuario = usuarioStore(pinia)
usuario.hydrateAuthHeader()

app.mount('#app')
