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

      <v-toolbar-title>Account manager</v-toolbar-title>

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
        dense
        nav >



        <v-list-item
          v-for="(item, index) in nav"
          :key="`nav_item_${index}`"
          :to="item.to"
          exact>
          <v-list-item-icon>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <template v-if="current_user_is_admin">
          <v-subheader>Admin</v-subheader>

          <v-list-item
            v-for="(item, index) in nav_admin"
            :key="`nav_item_admin_${index}`"
            :to="item.to"
            exact>
            <v-list-item-icon>
              <v-icon>{{item.icon}}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{item.title}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>




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

import CurrentUser from '@/mixins/CurrentUser.js'

export default {
  name: 'App',
  mixins: [
    CurrentUser
  ],
  data: () => ({
    drawer: null,
    nav: [
      {title: 'Profile', icon: 'mdi-account', to: {name: 'user', params: {user_id: 'self'}}},
      {title: 'Info', icon: 'mdi-information-outline', to: {name: 'info', params: {}}},
    ],
    nav_admin: [
      {title: 'Users', icon: 'mdi-account-multiple', to: {name: 'users', params: {}}},
    ],
  }),
  methods: {
    logout(){

      delete this.axios.defaults.headers.common['Authorization']
      this.$cookie.delete('token')
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
