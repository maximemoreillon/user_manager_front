<template>
<div>
  <v-card
    v-if="user"
    max-width="600"
    class="mx-auto mt-2 pa-4">

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
            <div class="caption">E-mail address</div>
            <div>{{user.email_address || 'Not set'}}</div>
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

        <v-list-item v-if="user_is_current_user">
          <v-list-item-content>
            <v-text-field
              label="Token"
              :value="token" />
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>Administrator</v-list-item-content>
          <v-list-item-action>
            <v-switch
              :disabled="user_is_current_user || !current_user_is_admin"
              v-model="user.isAdmin"/>
          </v-list-item-action>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>Activated</v-list-item-content>
          <v-list-item-action>
            <v-switch
              :disabled="user_is_current_user || !current_user_is_admin"
              v-model="user.activated"/>
          </v-list-item-action>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>Locked</v-list-item-content>
          <v-list-item-action>
            <v-switch
              :disabled="user_is_current_user || !current_user_is_admin"
              v-model="user.locked"/>
          </v-list-item-action>
        </v-list-item>

        <v-list-item
          v-if="current_user_is_admin || user_is_current_user">
          <v-list-item-content>Password update</v-list-item-content>
          <v-list-item-action>
            <PasswordUpdateDialog />
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
          :disabled="user_is_current_user"
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





</div>
</template>

<script>
import PasswordUpdateDialog from '@/components/PasswordUpdateDialog.vue'
import CurrentUser from '@/mixins/CurrentUser.js'

export default {
  name: 'User',
  mixins: [
    CurrentUser
  ],
  components: {
    PasswordUpdateDialog,
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


  },
  computed: {
    user_id(){
      return this.$route.params.user_id
    },
    user_is_current_user(){
      if(this.$route.params.user_id === 'self') return true
      return this.current_user_id === this.user_id
    },
    modified_properties(){
      // Note: This does not look deeply into properties

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
    },
    token(){
      return this.$cookie.get('token') || localStorage.jwt
    }
  }

}
</script>
