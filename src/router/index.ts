import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import UserLoginView from '../views/UserLoginView.vue'
import WorkSpace from '@/views/WorkSpace.vue'
import InventoryManage from '@/views/InventoryManage.vue'
import BookManage from '@/views/BookManage.vue'
import UserManage from '@/views/UserManage.vue'
import BorrowRecordManage from '@/views/BorrowRecordManage.vue'
import PermissionManage from '@/views/PermissionManage.vue'
import CategoryManage from '@/views/CategoryManage.vue'
import AdminLogin from '@/views/AdminLogin.vue'
import { useAdminStore } from '@/stores/admin'
import OverdueManage from '@/views/OverdueManage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'admin-login',
      path: '/admin-login',
      component: AdminLogin,
    },
    {
      name: 'workspace',
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
        {
          path: '/workspace/borrow-record-manage',
          component: BorrowRecordManage,
        },
        {
          path: '/workspace/permission-manage',
          component: PermissionManage,
        },
        {
          path: '/workspace/category-manage',
          component: CategoryManage,
        },
        {
          path: '/workspace/overdue-manage',
          component: OverdueManage,
        },
      ],
      beforeEnter: (to, from) => {
        if (!useAdminStore().isLogined) {
          return '/admin-login'
        }
      }
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
