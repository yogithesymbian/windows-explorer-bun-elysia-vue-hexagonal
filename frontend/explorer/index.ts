import { createApp } from 'vue'
import App from '@/App.vue'
import { createPinia } from 'pinia'
import { createNaiveUI } from '@/plugins/naive'
import router from '@/router'
import { container } from '@/core/di/container'

const app = createApp(App)
app.use(createPinia())
app.use(createNaiveUI())
app.use(router)

// Global provide agar bisa diinject di ViewModel
app.provide('container', container)

app.mount('#app')
