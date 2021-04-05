<template>
  <v-app>

    <v-app-bar
      app
      color="primary"
      dark>

      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2 rotating_logo"
        contain
        src="@/assets/logo.png"
        transition="scale-transition"
        width="40" />

      <v-app-bar-title>User manager</v-app-bar-title>

      <v-spacer />

      <v-btn
        icon
        @click="logout()">
        <v-icon>mdi-logout</v-icon>
      </v-btn>


    </v-app-bar>




    <!-- v-container inside main This looks correct -->
    <!-- v-container is here for padding mainly -->
    <v-main>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-main>

    <v-footer class="text-center">
      User manager - Maxime Moreillon
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
