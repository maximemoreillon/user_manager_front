<template>
  <div class="login">



    <v-form
      class="mt-4"
      @submit.prevent="login()"
      lazy-validation
      v-model="form_valid" >

      <v-row justify="center">
        <v-col cols=4>
          <v-text-field
            v-model="username"
            label="Username"
            :rules="InputRules"/>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols=4>
          <v-text-field
            v-model="password"
            type="password"
            label="Password"
            :rules="InputRules"/>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col
          cols=4
          class="text-center">
          <v-btn
            class="mr-4"
            type="submit"
            :disabled="!form_valid || processing"
            :loading="processing"
            @click="login()">
            <v-icon>mdi-login</v-icon>
            <span class="mr-2">Login</span>
          </v-btn>
        </v-col>
      </v-row>






    </v-form>

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
.debug {
  outline: 1px solid red;
}
</style>
