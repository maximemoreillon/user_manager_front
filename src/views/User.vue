<template>
<div>
  <Breadcrumbs />
  <v-card
    max-width="400"
    class="mx-auto">


    <template v-if="user">

      <v-img
        src="@/assets/account.svg"
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
                label="Display name"
                v-model="user.display_name" />
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              Admin
            </v-list-item-content>
            <v-list-item-action>
              <v-switch
                :disabled="user_is_current_user"
                v-model="user.administrator"/>
            </v-list-item-action>

          </v-list-item>

      </v-list>

      <v-card-actions>
        <v-btn
          class="mx-2"
          :disabled="!properties_modified"
          @click="update_user()">
          <v-icon>mdi-content-save</v-icon>
          <span>Save changes</span>
        </v-btn>

        <v-btn
          class="mx-2"
          @click="delete_user()"
          color="#c00000"
          dark
          :disabled="user_is_current_user">
          <v-icon>mdi-delete</v-icon>
          <span>Delete user</span>
        </v-btn>
      </v-card-actions>
    </template>

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
import Breadcrumbs from '@/components/Breadcrumbs.vue'
export default {
  name: 'User',
  components: {
    Breadcrumbs
  },
  data(){
    return {
      loading: false,
      user: null,
      unmodified_user_copy: null,
      snack: {
        show: false,
        color: 'success',
        text: ''
      }

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
      let user_id = this.$route.params.user_id || 'self'
      let url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/${user_id}`
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
      .finally( () => {
        this.loading = false
      })
    },
    delete_user(){
      if(!confirm(`Delete user ${this.user.username}`)) return
      let user_id = this.$route.params.user_id || 'self'
      let url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/${user_id}`
      this.axios.delete(url)
      .then( () => { this.$router.push({name: 'users'}) })
      .catch( error => {
        console.error(error)
        if(error.response) this.error_message(error.response.data)
        else this.error_message(`Error deleting user`)
      })
    },
    update_user(){
      const user_id = this.$route.params.user_id || 'self'
      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/${user_id}`
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
    }
  },
  computed: {
    user_is_current_user(){
      const user_id = this.$route.params.user_id
      if(!user_id) return true
      if(!this.$store.state.current_user) return false
      return this.$store.state.current_user._id === user_id
    },
    current_user_is_Admin(){
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
