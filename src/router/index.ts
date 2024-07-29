import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import UserLoginView from '../views/UserLoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/workspace',
      component: () => import('@/views/WorkSpace.vue'),
      children: [
        {
          path: 'inventory-manage',
          component: () => import('@/views/InventoryManage.vue'),
        },  
      ]
    },
    {
      path: '/',
      component: HomeView
    },
    {
      path: '/home',
      component: HomeView
    },
    {
      path: '/login',
      component: UserLoginView
    }, 
    {
      path: '/register',
      component: () => import('@/views/Register.vue'),
    },
    {
      path: '/about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
