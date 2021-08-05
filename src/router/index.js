import Vue from 'vue'
import VueRouter from 'vue-router'

import Users from '../views/Users.vue'
import User from '../views/User.vue'
import Info from '../views/Info.vue'



Vue.use(VueRouter)

const routes = [

  // {
  //   path: '/login',
  //   name: 'login',
  //   component: Login,
  // },
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
