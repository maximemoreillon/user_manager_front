import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'user_details',
    component: () => import('../views/UserDetails.vue')
  },
  {
    path: '/user_list',
    name: 'user_list',
    component: () => import('../views/UserList.vue')
  },
  {
    path: '/create_user',
    name: 'create_user',
    component: () => import('../views/CreateUser.vue')
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
