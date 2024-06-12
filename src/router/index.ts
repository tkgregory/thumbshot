import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ScreenShotView from '../views/ScreenShotView.vue'
import TermsAndConditionsView from '../views/TermsAndConditionsView.vue'
import SignInView from '../views/SignInView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView
    },
    {
      path: '/screenshot/:boardId',
      component: ScreenShotView
    },
    {
      path: '/terms-and-conditions',
      component: TermsAndConditionsView
    },
    {
      path: '/sign-in',
      component: SignInView
    },
    {
      path: '/boards/:boardId',
      component: HomeView
    }
  ]
})

export default router
