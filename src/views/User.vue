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

      <v-card-title>{{user.username}}</v-card-title>

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
                v-model="user.admin"/>
            </v-list-item-action>

          </v-list-item>

      </v-list>

      <v-card-actions>
        <v-btn
          class="mx-2"
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

    <v-snackbar
        v-model="snack"
        color="success">
        User updated successfully

        <template v-slot:action="{ attrs }">
          <v-btn
            color="primary"
            text
            v-bind="attrs"
            @click="snack = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>



  </v-card>
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
      error_message: null,
      user: null,
      snack: false,
    }
  },
  mounted(){
    this.get_user()
  },
  methods: {
    get_user(){
      this.loading = true
      this.error_message = null
      let user_id = this.$route.params.user_id || 'self'
      let url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/${user_id}`
      this.axios.get(url)
      .then( ({data}) => {
        this.user = data
       })
      .catch( error => {
        console.error(error)
        if(error.response) this.error_message = error.response.data
        else this.error_message = `Error loading user`
      })
      .finally( () => {
        this.loading = false
      })
    },
    delete_user(){
      if(!confirm(`Delete user ${this.user.username}`)) return
      this.error_message = null
      let user_id = this.$route.params.user_id || 'self'
      let url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/${user_id}`
      this.axios.delete(url)
      .then( () => { this.$router.push({name: 'users'}) })
      .catch( error => {
        console.error(error)
        if(error.response) this.error_message = error.response.data
        else this.error_message = `Error loading user`
      })
    },
    update_user(){

      const user_id = this.$route.params.user_id || 'self'
      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/${user_id}`

      const {display_name, admin} = this.user

      const properties = {
        display_name,
        admin
      }

      this.axios.patch(url,properties)
      .then( () => {
        this.snack = true
       })
      .catch( error => {
        console.error(error)
        if(error.response) this.error_message = error.response.data
        else this.error_message = `Error loading user`
      })

    },
  },
  computed: {
    user_is_current_user(){
      const user_id = this.$route.params.user_id
      if(!user_id) return true
      if(!this.$store.state.current_user) return false
      return this.$store.state.current_user._id === user_id
    }
  }

}
</script>
