<template>
  <div class="">
    <v-data-table
      class="elevation-1"
      :loading="loading"
      :headers="headers"
      :items="users"
      :options.sync="options"
      :server-items-length="user_count"
      @click:row="row_clicked($event)">

      <template v-slot:top>
        <v-toolbar
          flat>
          <v-toolbar-title>Users</v-toolbar-title>

          <!--
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details/>
          -->

          <v-spacer/>

          <v-btn
            v-if="current_user_is_admin"
            @click="new_user.dialog = true">
            <v-icon>mdi-account-plus</v-icon>
            <span>Create user</span>
            </v-btn>

        </v-toolbar>
      </template>

      <!-- Avatar -->
      <template v-slot:item.avatar="{ item }">
        <v-avatar size="24">
          <img :src="item.avatar" alt="avatar" v-if="item.avatar">
          <v-icon v-else>mdi-account-circle</v-icon>
        </v-avatar>
      </template>

      <!-- Admin -->
      <template v-slot:item.administrator="{ item }">
        <v-icon v-if="item.administrator">mdi-check</v-icon>
      </template>
    </v-data-table>

    <!-- New user dialog -->
    <v-dialog
      v-model="new_user.dialog"
      max-width="600px">

      <v-form
        @submit.prevent="create_user()"
        ref="user_create_form"
        v-model="new_user.valid"
        lazy-validation>

        <v-card>
          <v-card-title>Create user</v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    type="text"
                    label="Username"
                    v-model="new_user.username"
                    :rules="new_user.usernameRules"
                    required />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    type="password"
                    label="Password"
                    v-model="new_user.password"
                    :rules="new_user.passwordRules"
                    required />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    type="password"
                    label="Password confirm"
                    v-model="new_user.password_confirm"
                    :rules="new_user.passwordConfirmRules"
                    required />
                </v-col>
              </v-row>
            </v-container>
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
              type="submit"
              color="blue darken-1"
              text
              :disabled="!new_user.valid">
              Create
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
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
export default {
  name: 'Users',
  data(){
    return {
      users: [],
      user_count: 0,
      options: {},
      headers: [
        {text: 'Avatar', value:'avatar'},
        {text: 'Username', value:'username'},
        {text: 'Display name', value:'display_name'},
        {text: 'Administrator', value:'administrator'}
      ],
      loading: false,
      search: '',
      new_user: {
        username: '',
        password: '',
        password_confirm: '',
        dialog: false,
        valid: false,
        usernameRules: [
          v => !!v || 'Username is required',
          v => v.length <= 10 || 'Name must be less than 10 characters',
        ],
        passwordRules: [
          v => !!v || 'Password is required',
          v => v.length >= 5 || 'Password must be less than 5 characters',
        ],
        passwordConfirmRules: [
          v => !!v || 'Password confirm is required',
          v => v === this.new_user.password || 'Passwords must match',
        ],
      },

      snackbar: {
        show: false,
        text: '',
      },
    }
  },
  mounted(){
    //this.get_users()
    this.get_user_count()
    // Get user count will get users later on
  },
  watch: {
    options: {
      handler () {
        this.get_users()
      },
      deep: true,
    },
  },
  methods: {
    get_user_count(){
      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/count`
      this.axios.get(url)
      .then( ({data}) => {
        this.user_count = data.user_count

        // Not elegant
        this.get_users()
      })
      .catch( error => {
        console.error(error)
      })

    },
    get_users(){
      this.loading = true
      const { page, itemsPerPage } = this.options

      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users`
      const params = {
        skip: (page-1) * itemsPerPage,
        limit: itemsPerPage,
      }
      this.axios.get(url, {params})
      .then( ({data}) => {
        // Is this right?
        this.users = []
        data.forEach((user) => {
          this.users.push(user)
        })

      })
      .catch( error => {
        console.error(error)
        if(error.response) this.snackbar.text = error.response.data
        else this.snackbar.text = 'Failed to get users'
        this.snackbar.show = true
      })
      .finally( () => {
        this.loading = false
      })
    },
    row_clicked(item){
      this.$router.push({name: 'user', params: {user_id: item._id}})
    },
    clear_create_user(){
      this.new_user.username = ''
      this.new_user.password = ''
      this.new_user.password_confirm = ''
      this.new_user.dialog = false
    },
    create_user(){
      if(!this.$refs.user_create_form.validate()) return

      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users`
      const body = {
        username: this.new_user.username,
        password: this.new_user.password
      }
      this.axios.post(url, body)
      .then( () => {
        this.get_user_count()
        this.clear_create_user()
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

<style>
tr {
  cursor: pointer;
}
</style>
