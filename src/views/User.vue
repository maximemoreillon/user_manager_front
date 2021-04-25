<template>
<div>
  <v-card
    v-if="user"
    max-width="500"
    class="mx-auto pa-4">

      <v-img
        contain
        :src="user.avatar || require('@/assets/account.svg')"
        height="300px"/>

      <v-card-title>
        {{user.username}}
      </v-card-title>

      <v-card-subtitle v-if="user_is_current_user">
        it's you!
      </v-card-subtitle>

      <v-list>

        <v-list-item>
          <v-list-item-content>
            <div class="caption">ID</div>
            <div>{{user._id}}</div>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <div class="caption">Username</div>
            <div>{{user.username}}</div>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <div class="caption">Creation date</div>
            <div>{{new Date(user.creation_date).toString()}}</div>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-text-field
              :readonly="!current_user_is_admin && !user_is_current_user"
              label="Display name"
              v-model="user.display_name" />
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="current_user_is_admin || user_is_current_user">
          <v-list-item-content>
            <v-text-field
              label="Avatar URL"
              v-model="user.avatar" />
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>Admin</v-list-item-content>
          <v-list-item-action>
            <v-switch
              :disabled="user_is_current_user || !current_user_is_admin"
              v-model="user.administrator"/>
          </v-list-item-action>
        </v-list-item>

        <v-list-item
          v-if="current_user_is_admin || user_is_current_user">
          <v-list-item-content>Password</v-list-item-content>
          <v-list-item-action>
            <v-btn
              @click="dialog = true">Update</v-btn>
          </v-list-item-action>
        </v-list-item>

      </v-list>

      <v-card-actions
        v-if="current_user_is_admin || user_is_current_user">
        <v-spacer></v-spacer>
        <v-btn
          color="#444"
          text
          :disabled="!properties_modified"
          @click="update_user()" >
          Save
        </v-btn>
        <v-btn
          color="#c00000"
          text
          @click="delete_user()" >
          Delete
        </v-btn>
      </v-card-actions>

  </v-card>

  <v-snackbar
    v-model="snack.show"
    :color="snack.color">
    {{snack.text}}
    <template v-slot:action="{ attrs }">
      <v-btn
        icon
        v-bind="attrs"
        @click="snack.show = false" >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>

  <!-- password update dialog -->
  <v-dialog
    v-model="dialog"
    max-width="600px">
    <v-card>
      <v-card-title>Password update</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="update_pasword()">
          <v-container>
            <v-row v-if="!current_user_is_admin">
              <v-col cols="12">
                <v-text-field
                  type="password"
                  label="Current password"
                  v-model="password_update.current_password"
                  required />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  type="password"
                  label="New password"
                  v-model="password_update.new_password"
                  required />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  type="password"
                  label="New password confirm"
                  v-model="password_update.new_password_confirm"
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

</div>
</template>

<script>
export default {
  name: 'User',
  components: {

  },
  data(){
    return {
      loading: false,
      user: null,
      unmodified_user_copy: null,
      dialog: false,
      snack: {
        show: false,
        color: 'success',
        text: ''
      },
      password_update: {
        current_password: '',
        new_password: '',
        new_password_confirm: '',
      }

    }
  },
  watch: {
    user_id(){
      this.get_user()
    }
  },
  mounted(){
    this.get_user()
  },
  methods: {
    save_copy_of_user(){
      this.unmodified_user_copy = JSON.parse(JSON.stringify(this.user))
    },
    get_user(){
      this.loading = true
      this.user = null
      let url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/${this.user_id}`
      this.axios.get(url)
      .then( ({data}) => {
        this.user = data
        delete this.user.password_hashed
        this.save_copy_of_user()
       })
      .catch( error => {
        console.error(error)
        if(error.response) this.error_message(error.response.data)
        else this.error_message(`Error getting user`)
      })
      .finally( () => { this.loading = false })
    },
    delete_user(){
      if(!confirm(`Delete user ${this.user.username}`)) return
      let url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/${this.user_id}`
      this.axios.delete(url)
      .then( () => { this.$router.push({name: 'users'}) })
      .catch( error => {
        console.error(error)
        if(error.response) this.error_message(error.response.data)
        else this.error_message(`Error deleting user`)
      })
    },
    update_user(){
      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/${this.user_id}`
      this.axios.patch(url, this.modified_properties)
      .then( () => {
        this.sucess_message('User updated successfully')
       })
      .catch( error => {
        console.error(error)
        if(error.response) this.error_message(error.response.data)
        else this.error_message(`Error updating user`)
      })
    },
    sucess_message(message){
      this.snack.color = "#00c000"
      this.snack.text = message
      this.snack.show = true
    },
    error_message(message){
      this.snack.color = "#c00000"
      this.snack.text = message
      this.snack.show = true
    },
    clear_password_update(){
      this.password_update.current_password = ''
      this.password_update.new_password = ''
      this.password_update.mew_password_confirm = ''
      this.dialog = false
    },
    update_pasword(){
      const user_id = this.$route.params.user_id || 'self'
      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/${user_id}/password`
      const {current_password, new_password, new_password_confirm} = this.password_update
      const body = { current_password, new_password, new_password_confirm}
      this.axios.put(url,body)
      .then( () => {
        this.clear_password_update()
        this.sucess_message('Password updated successfully')
       })
      .catch( error => {
        console.error(error)
        if(error.response) this.error_message(error.response.data)
        else this.error_message(`Error updating password`)
      })

    },
  },
  computed: {
    user_id(){
      return this.$route.params.user_id
    },
    user_is_current_user(){
      if(this.$route.params.user_id === 'self') return true
      if(!this.$store.state.current_user) return false
      return this.$store.state.current_user._id === this.user_id
    },
    current_user_is_admin(){
      if(!this.$store.state.current_user) return false
      return this.$store.state.current_user.administrator
    },
    modified_properties(){
      // Note: Neo4J does not have nested properties

      if(!this.user) return {}

      const current_user_keys = Object.keys(this.user)

      return current_user_keys.reduce( (acc, key) => {

        const current_value = this.user[key]
        const original_value = this.unmodified_user_copy[key]

        // Only deal with non-nested stuff
        if(current_value != null && typeof current_value === 'object') return acc

        // If there is a modification, add it to an object of modified properties
        if(original_value !== current_value) {
          acc[key] = current_value
        }

        return acc
      }, {})

    },
    properties_modified(){
      return Object.keys(this.modified_properties).length > 0
    }
  }

}
</script>
