import Vue from 'vue'
import VueRouter from 'vue-router'

import Users from '../views/Users.vue'
import User from '../views/User.vue'
import CreateUser from '../views/CreateUser.vue'
import Info from '../views/Info.vue'

import Login from '../views/Login.vue'


Vue.use(VueRouter)

const routes = [

  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/users',
    name: 'users',
    component: Users,
  },
  {
    path: '/users/new',
    name: 'create_user',
    component: CreateUser,

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
    path: '*', redirect: {name :'users'}
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
