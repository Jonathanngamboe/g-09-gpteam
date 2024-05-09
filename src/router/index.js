import { createRouter, createWebHashHistory } from "vue-router"
import MainLayout from "@/layouts/MainLayout.vue"
import UserAccountView from '@/views/UserAccountView.vue'
import AddPropertyView from '@/views/AddPropertyView.vue'
import MessagesView from '../views/MessagesView.vue';
import EditUserInformationsView from '@/views/EditUserInformationsView.vue'


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
      { path: '/messages', name: 'messages', component: () => import(/* webpackChunkName: "about" */'@/views/MessagesView.vue') },
      { path: '/room/:id', name: 'room', component: () => import('@/views/RoomView.vue') },
      { path: "/Add-Room", name: "Add-Room", component: AddPropertyView },
      { path: "/My-account", name: "My-account", component: UserAccountView },
      { path: "/EditUserInformations", name: "EditUserInformations", component: EditUserInformationsView },
      { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/404View.vue') },
      { path: '/room-booking-summary', name: 'room-booking-summary', component: () => import('@/views/RoomBookingSummaryView.vue') },   
    ]
  },
  




  
  
  
  
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router