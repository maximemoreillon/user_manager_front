import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'

Vue.use(VueCookies)
Vue.use(VueAxios, axios)

Vue.config.productionTip = false



// function destroy_session(to, next){
//   delete Vue.axios.defaults.headers.common['Authorization']
//   store.commit('set_current_user', null)
//   Vue.$cookies.remove('token')
//   if (to.name !== 'login') next({ name: 'login' })
//   else next()
// }
//
// router.beforeEach((to, from, next) => {
//
//   const token = Vue.$cookies.get("token")
//
//   if(token) {
//     Vue.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
//     Vue.axios.get(`${process.env.VUE_APP_USER_MANAGER_API_URL}/users/self`)
//     .then( ({data}) => {
//       store.commit('set_current_user', data)
//       next()
//      })
//     .catch( error => {
//       console.error(error)
//       destroy_session(to, next)
//      })
//   }
//   else destroy_session(to, next)
// })


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
