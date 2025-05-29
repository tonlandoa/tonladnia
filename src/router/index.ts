import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import HomePage from '../pages/HomePage.vue'
import BalancePage from '../pages/BalancePage.vue'
import FrinedsPage from '../pages/FriendsPage.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/balance', name: 'Balance', component: BalancePage },
  { path: '/friends', name: 'Frieds', component: FrinedsPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
