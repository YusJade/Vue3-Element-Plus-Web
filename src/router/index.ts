import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import UserLoginView from '../views/UserLoginView.vue'
import WorkSpace from '@/views/WorkSpace.vue'
import InventoryManage from '@/views/InventoryManage.vue'
import BookManage from '@/views/BookManage.vue'
import UserManage from '@/views/UserManage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/workspace',
      component: WorkSpace,
      children: [
        {
          path: '/workspace/inventory-manage',
          component: InventoryManage,
        },
        {
          path: '/workspace/book-manage',
          component: BookManage,
        },
        {
          path: '/workspace/user-manage',
          component: UserManage,
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
