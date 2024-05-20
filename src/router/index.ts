import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ScreenShotView from '../views/ScreenShotView.vue'
import TermsAndConditionsView from '../views/TermsAndConditionsView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView
    },
    {
      path: '/screenshot',
      component: ScreenShotView
    },
    {
      path: '/terms-and-conditions',
      component: TermsAndConditionsView
    }
  ]
})

export default router
