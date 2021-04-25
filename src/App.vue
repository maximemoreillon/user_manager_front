<template>
  <v-app>

    <v-app-bar
      app
      color="#444444"
      dark
      clipped-left>

      <v-app-bar-nav-icon
        v-if="$store.state.current_user"
        @click="drawer = !drawer" />


      <v-img
        alt="Logo"
        class="shrink mr-2 rotating_logo"
        contain
        src="@/assets/logo.png"
        transition="scale-transition"
        width="40" />

        <!-- class="text-no-wrap" to prevent ellipsis (vuetify bug) -->
      <v-app-bar-title>User manager</v-app-bar-title>

      <v-spacer />

      <v-btn
        v-if="$store.state.current_user"
        icon
        @click="logout()">
        <v-icon>mdi-logout</v-icon>
      </v-btn>

    </v-app-bar>

    <v-navigation-drawer
      clipped
      app
      v-if="$store.state.current_user"
      v-model="drawer">

      <v-list
        nav >
        <v-list-item
          v-for="item in nav"
          :key="item.label"
          :to="item.to"
          link
          exact >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.label }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>




    <!-- v-container inside main This looks correct -->
    <!-- v-container is here for padding mainly -->
    <v-main class="grey lighten-4">
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-main>

    <v-footer>
      <v-col
        class="text-center"
        cols="12" >
        User manager - Maxime Moreillon
      </v-col>


    </v-footer>

  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    drawer: null,
    nav: [
      {label: 'Users', icon: 'mdi-account-multiple', to: {name: 'users', params: {}}},
      {label: 'Profile', icon: 'mdi-account', to: {name: 'user', params: {user_id: 'self'}}},
      {label: 'Info', icon: 'mdi-information-outline', to: {name: 'info', params: {}}},
    ]
  }),
  methods: {
    logout(){

      delete this.axios.defaults.headers.common['Authorization']
      this.$cookies.remove('token')
      this.$router.push({name: 'login'})
    }
  },
  computed: {

  }

};
</script>

<style>
.rotating_logo {
  animation-name: rotating_logo;
  animation-duration: 60s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes rotating_logo {
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);}
}

</style>
