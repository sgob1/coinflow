import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('../views/MainView.vue')
    },
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/',
      name: 'balance',
      component: () => import('../views/BalanceView.vue')
    },
    {
      path: '/',
      name: 'account',
      component: () => import('../views/AccountView.vue')
    }
  ]
})

export default router
