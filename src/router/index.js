import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue'),
  },
  {
    path: '/users',
    name: 'user_list',
    component: () => import('../views/UserList.vue'),
    alias: '/user_list',
  },
  {
    path: '/users/create',
    name: 'create_user',
    component: () => import('../views/CreateUser.vue'),
    alias: '/create_user',
  },
  {
    path: '/users/:user_id',
    name: 'user_details',
    component: () => import('../views/UserDetails.vue'),
    alias: '/user',
  },


  // Redirect all the remaining to the user's profile page
  {
    path: '*',
    redirect: { name :'user_details', params: {user_id: 'self'}}
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
