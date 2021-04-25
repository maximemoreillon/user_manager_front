<template>
  <v-app>

    <v-app-bar
      app
      color="#444444"
      dark>

      <v-img
        alt="Logo"
        class="shrink mr-2 rotating_logo"
        contain
        src="@/assets/logo.png"
        transition="scale-transition"
        width="40" />

        <!-- class="text-no-wrap" to prevent ellipsis (vuetify bug) -->
      <v-app-bar-title class="text-no-wrap">User manager</v-app-bar-title>

      <v-spacer />

      <v-btn
        v-if="$store.state.current_user"
        icon
        @click="logout()">
        <v-icon>mdi-logout</v-icon>
      </v-btn>


    </v-app-bar>




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
