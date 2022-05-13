<template>
  <div class="">
    <v-dialog
      v-model="dialog"
      max-width="600px">

      <template v-slot:activator="{ on, attrs }">
        <v-btn
          text
          v-bind="attrs"
          v-on="on">
          <v-icon>mdi-account-plus</v-icon>
          <span class="ml-2">Create user</span>
        </v-btn>
      </template>



      <v-card>
        <v-card-title>Create user</v-card-title>
        <v-card-text>
          <v-form
            @submit.prevent="create_user()"
            ref="user_create_form"
            v-model="new_user.valid"
            lazy-validation>
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
              <v-btn type="submit" style="display: none;">submit</v-btn>
            </v-container>
          </v-form>
        </v-card-text>

        <v-card-actions >
          <v-spacer/>
          <v-btn
            color="blue darken-1"
            text
            @click="clear_create_user()" >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="create_user()"
            :disabled="!valid">
            Create
          </v-btn>
        </v-card-actions>
      </v-card>


    </v-dialog>

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
  </div>
</template>

<script>
// This component is not used yet
export default {
  name: 'Users',
  props: {

  },
  data(){
    return {

      dialog: false,

      loading: false,
      new_user: {
        username: '',
        password: '',
        password_confirm: '',

      },

      valid: false,
      usernameRules: [
        v => !!v || 'Username is required',
        v => v.length <= 50 || 'Name must be less than 50 characters',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 5 || 'Password must be less than 5 characters',
      ],
      passwordConfirmRules: [
        v => !!v || 'Password confirm is required',
        v => v === this.new_user.password || 'Passwords must match',
      ],

      snackbar: {
        show: false,
        text: '',
      },
    }
  },

  methods: {


    clear_create_user(){
      this.new_user.username = ''
      this.new_user.password = ''
      this.new_user.password_confirm = ''
      this.dialog = false
    },
    create_user(){
      if(!this.$refs.user_create_form.validate()) return

      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users`
      const body = {
        username: this.new_user.username,
        password: this.new_user.password
      }
      this.axios.post(url, body)
      .then( ({data}) => {

        this.clear_create_user()
        this.$emit('user_created', data)
        this.dialog = false
       })
      .catch( error => {
        console.error(error)
        if(error.response) this.snackbar.text = error.response.data
        else this.snackbar.text = 'Failed to create user'
        this.snackbar.show = true
      })
    }
  },
  computed: {
    user_is_current_user(){
      const user_id = this.$route.params.user_id
      if(!user_id) return true
      if(!this.$store.state.current_user) return false
      return this.$store.state.current_user._id === user_id
    },
    current_user_is_admin(){
      if(!this.$store.state.current_user) return false
      return this.$store.state.current_user.administrator
    },
  }
}
</script>
