import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
Vue.use(VueAxios, axios)


/*
router.beforeEach((to, from, next) => {

  console.log('beforeEach')

  // get current_user
  if(VueCookies.get("jwt")) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${VueCookies.get('jwt')}`
    axios.get(`${process.env.VUE_APP_USER_MANAGER_API_URL}/users/self`)
    .then(({data}) => { store.commit('set_current_user', data) })
    .catch(error => { console.error(error) })

    next()
  }
  else {
    delete axios.defaults.headers.common['Authorization']
    //window.location.href = process.env.VUE_APP_AUTHENTICATION_FRONT_URL;
  }

  //access_control(next)
});
*/

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
