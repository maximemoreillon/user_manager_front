<template>
  <div>

    <v-card
      class="mx-auto py-3 mt-12"
      max-width="500px">
      <v-card-title>Login</v-card-title>
      <v-form
        class="ma-5"
        @submit.prevent="login()"
        lazy-validation
        v-model="form_valid" >

        <v-row
          justify="center">
          <v-col>
            <v-text-field
              v-model="username"
              label="Username"
              :rules="InputRules"/>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col>
            <v-text-field
              v-model="password"
              type="password"
              label="Password"
              :rules="InputRules"/>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col
            class="text-center">
            <v-btn
              type="submit"
              :disabled="!form_valid || processing"
              :loading="processing">
              <v-icon>mdi-login</v-icon>
              <span class="">Login</span>
            </v-btn>
          </v-col>
        </v-row>

      </v-form>
    </v-card>





    <v-snackbar
      color="#C00000"
      dark
      v-model="snackbar" >
      {{ snackbar_text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          icon
          v-bind="attrs"
          @click="snackbar = false" >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>




  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Login',
  data(){
    return {
      form_valid: false,
      snackbar: false,
      snackbar_text: '',
      processing: false,
      username: '',
      password: '',
      InputRules: [
        v => !!v || 'This field is required',
      ],
    }
  },
  mounted(){
  },
  methods: {
    login(){
      this.processing = true
      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/auth/login`
      const body = {username: this.username, password: this.password}
      this.axios.post(url, body)
      .then( ({data: {jwt}}) => {

        // Set the authorization headers
        this.axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`

        // Set cookies
        this.$cookies.set('token', jwt, '14d', null, process.env.VUE_APP_COOKIE_DOMAIN, null, 'Strict')

        // Redirect
        this.$router.push({name: 'users'})
      })
      .catch( error => {
        console.error(error)
        if(error.response) this.snackbar_text = error.response.data
        else this.snackbar_text = 'Something went wrong'
        this.snackbar = true
      })
      .finally(() => {this.processing = false})
    },
  }

}
</script>

<style scoped>

</style>
