<template>
  <div>
    <v-card
      class="mx-auto py-3 mt-12"
      max-width="500px">
      <v-card-title>Password reset request</v-card-title>

      <v-card-text v-if="!success">
        <v-form @submit.prevent="request_password_reset()">
          <v-row>
            <v-col>
              <v-text-field
                type="email"
                label="Email address"
                v-model="email_address"/>
            </v-col>
          </v-row>
          <v-row>
            <v-spacer/>
            <v-col cols="auto">
              <v-btn
                :disabled="!email_address"
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

    }
  },
  mounted(){
  },
  methods: {
    request_password_reset(){
      this.loading = true
      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/self/password/reset`
      const body = {email_address: this.email_address}
      this.axios.post(url,body)
      .then(() => {
        this.success = true
      })
      .catch(error => {
        console.error(error)
        this.error = true
        alert(error)
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
