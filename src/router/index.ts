import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/dashboard', component: Dashboard },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Route Guard: Users can not access to the Dashboard page if they don't logged in
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.path !== '/' && !authStore.token) {
    next('/')
  } else {
    next()
  }
})

export default router
