import Vue from 'vue'
import VueRouter from 'vue-router'

import Users from '../views/Users.vue'
import User from '../views/User.vue'
import Info from '../views/Info.vue'

Vue.use(VueRouter)

const routes = [

  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/Register.vue'),
  },
  {
    path: '/users',
    name: 'users',
    component: Users,
  },
  {
    path: '/users/:user_id',
    name: 'user',
    component: User,
  },
  {
    path: '/password_update',
    name: 'password_update',
    component: () => import('@/views/PasswordUpdate.vue'),
  },
  {
    path: '/password_reset',
    name: 'password_reset',
    component: () => import('@/views/PasswordResetRequest.vue'),
  },
  {
    path: '/activate',
    name: 'activate',
    component: () => import('@/views/Activate.vue'),
  },
  {
    path: '/info',
    name: 'info',
    component: Info,
  },
  {
    // will match everything
    path: '*', redirect: {name :'user', params: {user_id: 'self'}}
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
