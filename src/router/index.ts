import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserLoginView from '../views/UserLoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
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
      component: () => import('@/views/UserRegisterView.vue'), 
      children: [
        {
          path: '#',
          name: 'input-name-gender',
          component: () => import('@/views/NameGenderInputBox.vue')
        },
        {
          path: '##',
          name: 'input-email-phone',
          component: () => import('@/views/EmailPhoneInputBox.vue')
        },
        {
          path: '###',
          name: 'input-username-password',
          component: () => import('@/views/UsernamePasswordInputBox.vue')
        },
      ]
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
