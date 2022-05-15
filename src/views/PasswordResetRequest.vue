<template>
  <div>
    <v-card
      class="mx-auto py-3 mt-12"
      max-width="40em">
      <v-card-title>Password reset request</v-card-title>

      <v-card-text v-if="!success">
        <v-form 
          @submit.prevent="request_password_reset()"
          lazy-validation
          v-model="form_valid">
          <v-row>
            <v-col>
              <v-text-field
                type="email"
                label="Email address"
                :rules="emailRules"
                v-model="email_address"/>
            </v-col>
          </v-row>
          <v-row>
            <v-spacer/>
            <v-col cols="auto">
              <v-btn
                :disabled="!email_address || !form_valid"
                :loading="loading"
                type="submit">
                Request reset
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <template v-if="!loading && success">
        <v-card-text>
          An email with instructions has been sent to {{email_address}}.
        </v-card-text>
      </template>






    </v-card>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'PasswordReset',
  data(){
    return {
      email_address: null,
      loading: false,
      success: false,
      error: null,

      form_valid: false,
      emailRules: [
        v => !!v || this.current_user_is_admin || 'e-mail address is required',
        v => (!!v && v.length < 50) || this.current_user_is_admin || 'email_address must be less than 50 characters',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || this.current_user_is_admin || 'E-mail must be valid'
      ],

    }
  },
  mounted(){
  },
  methods: {
    request_password_reset(){
      this.loading = true
      this.error = null
      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/self/password/reset`
      const body = {email_address: this.email_address}
      this.axios.post(url,body)
      .then(() => {
        this.success = true
      })
      .catch(error => {
        console.error(error)
        if(error.response) this.error = error.response.data
        else this.error = error
        alert(this.error)
      })
      .finally(() => {
        this.loading = false
      })

    }

  }

}
</script>

<style scoped>

</style>
