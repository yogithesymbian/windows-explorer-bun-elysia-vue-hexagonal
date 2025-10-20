import { createRouter, createWebHistory } from 'vue-router'
import ExplorerPage from '@presentation/pages/ExplorerPage.vue'

const routes = [
  { 
    path: '/', 
    name: 'explorer', 
    component: ExplorerPage 
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
