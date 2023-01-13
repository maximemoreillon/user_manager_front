import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import vuetify from "./plugins/vuetify"
import axios from "axios"
import VueAxios from "vue-axios"
import VueCookie from "vue-cookie"

axios.defaults.baseURL = process.env.VUE_APP_USER_MANAGER_API_URL

Vue.use(VueCookie)
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

function destroy_session() {
  delete Vue.axios.defaults.headers.common["Authorization"]
  store.commit("set_current_user", null)
  VueCookie.delete("token")
}

router.beforeEach((to, from, next) => {
  const anonymous_routes = [
    "login",
    "register",
    "password_reset",
    "activate",
    "password_update",
  ]

  const token = VueCookie.get("token")

  if (token) {
    Vue.axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    Vue.axios
      .get("/users/self")
      .then(({ data }) => {
        store.commit("set_current_user", data)
        next()
      })
      .catch((error) => {
        console.error(error)
        destroy_session()

        if (anonymous_routes.includes(to.name)) return next()

        if (to.name !== "login") next({ name: "login" })
        else next()
      })
  } else {
    destroy_session()
    if (anonymous_routes.includes(to.name)) return next()
    if (to.name !== "login") next({ name: "login" })
    else next()
  }
})

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app")
