import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'

Vue.use(VueCookies)
Vue.use(VueAxios, axios)


router.beforeEach((to, from, next) => {

  if(Vue.$cookies.get("jwt")) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${Vue.$cookies.get('jwt')}`
    next();
  }
  else {
    delete axios.defaults.headers.common['Authorization']
    window.location.href = "https://authentication.maximemoreillon.com/";
  }

});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
