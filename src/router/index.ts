import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import HomePage from '../pages/HomePage.vue'
import BalancePage from '../pages/BalancePage.vue'
import MiniGamePage from '@/pages/MiniGamePage.vue'
import MyNftPage from '../pages/MyNftPage.vue'
import MintPage from '../pages/MintPage.vue'
import FrinedsPage from '../pages/FriendsPage.vue'
import TasksPage from '@/pages/tasksPage.vue'
import SpinPage from '@/pages/SpinPage.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/mint', name: 'Mint', component: MintPage },
  { path: '/my_nft', name: 'My_Nft', component: MyNftPage },
  { path: '/balance', name: 'Balance', component: BalancePage },
  { path: '/spin', name: 'Spin', component: SpinPage },
  { path: '/friends', name: 'Frieds', component: FrinedsPage },
  { path: '/tasks', name: 'Tasks', component: TasksPage },
  { path: '/MiniGame', name: 'MiniGame', component: MiniGamePage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
