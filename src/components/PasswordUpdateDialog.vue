<template>
  <v-dialog
    v-model="dialog"
    max-width="600px">

    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on">
        <span class="">Update</span>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Password update</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="update_pasword()">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  type="password"
                  label="New password"
                  v-model="new_password"
                  required />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  type="password"
                  label="New password confirm"
                  v-model="new_password_confirm"
                  required />
              </v-col>
            </v-row>
            <v-btn type="submit" style="display: none;">submit</v-btn>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions >
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="clear_password_update()" >
          Cancel
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="update_pasword()" >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'PasswordUpdateDialog',

    data: () => ({
      dialog: false,
      new_password: '',
      new_password_confirm: '',
    }),
    methods: {
      update_pasword(){
        const user_id = this.$route.params.user_id || 'self'
        const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/${user_id}/password`
        const {new_password, new_password_confirm} = this
        const body = { new_password, new_password_confirm}
        this.axios.put(url,body)
        .then( () => {
          this.clear_password_update()
          //this.sucess_message('Password updated successfully')
         })
        .catch( error => {
          console.error(error)
          // if(error.response) this.error_message(error.response.data)
          // else this.error_message(`Error updating password`)
        })

      },
      clear_password_update(){
        this.new_password = ''
        this.mew_password_confirm = ''
        this.dialog = false
      },
    },
    computed: {

    }
  }
</script>
