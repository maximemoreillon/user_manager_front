<template>
  <div class="create_user">
    <h1>Create user</h1>

    <v-form
      @submit.prevent="create_user()"
      ref="form"
      v-model="valid"
      lazy-validation>

      <v-text-field
        v-model="user_properties.username"
        label="Username"
        :rules="usernameRules"
        required/>

      <!--
      <v-text-field
        v-model="user_properties.email_address"
        :rules="emailRules"
        label="E-mail"
        required />
      -->

      <v-text-field
        v-model="user_properties.password"
        type="password"
        :rules="passwordRules"
        label="Password"
        required />

      <v-text-field
        v-model="password_confirm"
        type="password"
        :rules="passwordConfirmRules"
        label="Password confirm"
        required />

      <v-btn
        type="submit"
        :disabled="!valid" >
        <v-icon>mdi-account-plus</v-icon>
        <span>Create user</span>
      </v-btn>

    </v-form>

  </div>
</template>

<script>
export default {
  name: 'Users',
  data(){
    return {
      error_message: null,
      user_properties: {
        username: '',
        //email_address: '',
        password: '',
      },
      password_confirm: '',
      valid: false,
      usernameRules: [
        v => !!v || 'Username is required',
        v => v.length <= 10 || 'Name must be less than 10 characters',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 5 || 'Password must be less than 5 characters',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      passwordConfirmRules: [
        v => !!v || 'Password confirm is required',
        v => v === this.user_properties.password || 'Passwords must match',
      ],
    }
  },

  methods: {
    create_user(){
      if(!this.$refs.form.validate()) return
      this.error_message = null

      let url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users`
      let method = 'post'
      let body = {...this.user_properties}

      this.axios.[method](url, body)
      .then( ({data}) => {
        this.$router.push({name: 'user', params: {user_id: data._id}})
      })
      .catch( error => {
        console.error(error)
        if(error.response) this.error_message = error.response.data
      })
    }
  }
}
</script>

<style>

</style>
