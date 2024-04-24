import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"
import MainLayout from '@/layouts/MainLayout.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'home', component: () => import('@/views/HomeView.vue') },
      { path: '/messages', name: 'messages', component: () => import(/* webpackChunkName: "about" */'@/views/MessagesView.vue') },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
