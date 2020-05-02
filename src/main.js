import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
//import {access_control} from '@moreillon/vue_access_control'

Vue.use(VueCookies)
Vue.use(VueAxios, axios)


router.beforeEach((to, from, next) => {

  // get current_user
  if(VueCookies.get("jwt")) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${VueCookies.get('jwt')}`
    axios.post(`${process.env.VUE_APP_AUTHENTICATION_API_URL}/whoami`)
    .then(response => {
      store.commit('set_current_user', response.data)
    })
    .catch(error => {
      console.log(error)
    })

    next()
  }
  else {
    delete axios.defaults.headers.common['Authorization']
    window.location.href = process.env.VUE_APP_AUTHENTICATION_FRONT_URL;
  }

  //access_control(next)
});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
