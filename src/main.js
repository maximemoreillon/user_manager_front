import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
import vuetify from './plugins/vuetify';

Vue.use(VueCookies)
Vue.use(VueAxios, axios)

Vue.config.productionTip = false



const identity_check = () => {

  Vue.axios.get(`${process.env.VUE_APP_USER_MANAGER_API_URL}/users/self`)
  .then( ({data}) => {
    store.commit('set_current_user', data)
   })
  .catch( error => {
    store.commit('set_current_user', null)
    console.error(error)
   })

}

router.beforeEach((to, from, next) => {

  const token = Vue.$cookies.get("token")

  if(token) {
    Vue.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    identity_check()
    next()
  }
  else {
    delete Vue.axios.defaults.headers.common['Authorization']
    if (to.name !== 'login') next({ name: 'login' })
    else next()
  }
})


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
