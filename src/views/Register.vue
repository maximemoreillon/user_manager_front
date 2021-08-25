<template>
  <v-card
    class="mx-auto py-3 mt-12"
    max-width="500px">
    <v-card-title>Account registration</v-card-title>

    <template v-if="!success">
      <v-card-text>
        <v-form
          @submit.prevent="create_user()"
          ref="user_create_form"
          lazy-validation
          v-model="form_valid" >

          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  type="text"
                  label="Username"
                  v-model="new_user.username"
                  :rules="usernameRules"
                  required />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  type="email"
                  label="E-mail address"
                  v-model="new_user.email_address"
                  :rules="emailRules"
                  required />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  type="password"
                  label="Password"
                  v-model="new_user.password"
                  :rules="passwordRules"
                  required />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  type="password"
                  label="Password confirm"
                  v-model="new_user.password_confirm"
                  :rules="passwordConfirmRules"
                  required />
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col
                class="text-center">
                <v-btn
                  type="submit"
                  :disabled="!form_valid || processing"
                  :loading="processing">
                  <v-icon>mdi-account-plus</v-icon>
                  <span class="ml-1">Register</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>

        </v-form>
      </v-card-text>

      <v-card-text v-if="!current_user">
        <v-row justify="center">
          <v-col
            class="text-center">
            Already have an account? click <router-link :to="{ name: 'login' }">here</router-link> to login.
          </v-col>
        </v-row>
      </v-card-text>
    </template>

    <template v-if="!processing && success">
      <v-card-text>
        Account registration successfull. An email has been sent to your address for activation.
      </v-card-text>
      <v-card-text>
        Once the activation process is complete, click <router-link :to="{ name: 'login' }">here</router-link> to login
      </v-card-text>
    </template>

    <v-snackbar
      color="#C00000"
      dark
      v-model="snackbar.show" >
      {{ snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          icon
          v-bind="attrs"
          @click="snackbar.show = false" >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>

    </v-snackbar>





  </v-card>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Login',
  data(){
    return {
      form_valid: false,

      snackbar: {
        show: false,
        text: ''
      },

      processing: false,

      success: false,

      new_user: {
        username: null,
        password: null,
        password_confirm: null,
        email_address: undefined,
      },


      usernameRules: [
        v => !!v || 'Username is required',
        v => (!!v && v.length < 50) || 'Name must be less than 50 characters',
      ],
      emailRules: [
        v => !!v || this.current_user_is_admin || 'e-mail address is required',
        v => (!!v && v.length < 50) || this.current_user_is_admin || 'email_address must be less than 50 characters',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || this.current_user_is_admin || 'E-mail must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 5) || 'Password must be more than 5 characters',
      ],
      passwordConfirmRules: [
        v => !!v || 'Password confirm is required',
        v => v === this.new_user.password || 'Passwords must match',
      ],
    }
  },
  mounted(){
  },
  methods: {
    error_handling(error){

      if(error.response) {
        this.snackbar.text = error.response.data
        console.error(error.response.data)
      }
      else {
        this.snackbar.text = 'Failed to create user'
        console.error(error)
      }

      this.snackbar.show = true

    },
    create_user(){
      if(!this.$refs.user_create_form.validate()) return

      this.processing = true

      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users`
      const body = this.new_user
      this.axios.post(url, body)
      .then( () => {
        if(this.current_user_is_admin) this.$router.push({name: 'users'})
        else this.success = true
       })
      .catch(this.error_handling)
      .finally(() => {this.processing = false})
    }
  },
  computed: {
    current_user(){
      return this.$store.state.current_user
    },
    current_user_is_admin(){
      if(!this.current_user) return false
      return this.$store.state.current_user.administrator
    }
  }

}
</script>

<style scoped>

</style>
