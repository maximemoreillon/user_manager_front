<template>
  <div>
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
                    :rules="new_user.requiredRule"
                    required />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    type="email"
                    label="E-mail address"
                    v-model="new_user.email_address"
                    :rules="new_user.requiredRule"
                    required />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    type="password"
                    label="Password"
                    v-model="new_user.password"
                    :rules="new_user.passwordRules"
                    required />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    type="password"
                    label="Password confirm"
                    v-model="new_user.password_confirm"
                    :rules="new_user.passwordConfirmRules"
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
                    <span class="">Register</span>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>

          </v-form>
        </v-card-text>

        <v-card-text>
          <v-row justify="center">
            <v-col
              class="text-center">
              Already have an account? click <router-link :to="{ name: 'login' }">here</router-link> to login.
            </v-col>
          </v-row>
        </v-card-text>
      </template>



      <template v-if="success">
        <v-card-text>
          Account registration successfull. An email has been sent to your address for activation.
        </v-card-text>
        <v-card-text>
          Once the activation process is complete, click <router-link :to="{ name: 'login' }">here</router-link> to login
        </v-card-text>
      </template>





    </v-card>
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

      success: false,

      new_user: {
        username: null,
        password: null,
        password_confirm: null,
        email_address: null,

      },

      valid: false,

      requiredRule: [
        v => !!v || 'Username is required',
        v => v.length < 50 || 'Name must be less than 50 characters',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 5 || 'Password must be more than 5 characters',
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
    create_user(){
      if(!this.$refs.user_create_form.validate()) return

      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users`
      const body = this.new_user
      this.axios.post(url, body)
      .then( () => {
        this.success = true
       })
      .catch( error => {
        console.error(error)
        if(error.response) this.snackbar.text = error.response.data
        else this.snackbar.text = 'Failed to create user'
        this.snackbar.show = true
      })
    }
  }

}
</script>

<style scoped>

</style>
