import { createRouter, createWebHistory } from "vue-router"
import MainLayout from "@/layouts/MainLayout.vue"
import UserAccountView from '@/views/UserAccountView.vue'
import MessagesView from '../views/MessagesView.vue';


const routes = [

  {
    path: '/messages',
    name: 'Messages',
    component: MessagesView
  },
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: '', name: 'home', component: () => import('@/views/HomeView.vue') },
      { path: '/profile', name: 'profile', component: () => import('@/views/ProfileView.vue')},
      { path: '/messages', name: 'messages', component: () => import(/* webpackChunkName: "about" */'@/views/MessagesView.vue') },
      { path: '/room/:id', name: 'room', component: () => import('@/views/RoomView.vue') },
      { path: '/UserAccount', name: 'UserAccount', component: () => import('@/views/UserAccountView.vue') },
      { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/404View.vue') },
    ]
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router