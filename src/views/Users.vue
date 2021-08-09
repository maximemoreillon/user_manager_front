<template>
  <v-card >

    <v-toolbar flat>
      <v-toolbar-title>Users</v-toolbar-title>
      <v-spacer></v-spacer>
      <UserCreateDialog
        @user_created="user_created($event)"/>
    </v-toolbar>

    <v-card-text>

      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="users"
        :options.sync="options"
        :server-items-length="user_count"
        @click:row="row_clicked($event)">

        <template v-slot:top>
          <v-toolbar
            flat>

            <v-spacer/>

            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details/>





          </v-toolbar>
        </template>

        <!-- Avatar -->
        <template v-slot:item.avatar="{ item }">
          <v-avatar size="24">
            <img :src="item.avatar" alt="avatar" v-if="item.avatar">
            <v-icon v-else>mdi-account-circle</v-icon>
          </v-avatar>
        </template>

        <!-- Boolean properties -->
        <template v-slot:item.administrator="{ item }">
          <v-icon v-if="item.administrator">mdi-check</v-icon>
        </template>
        <template v-slot:item.activated="{ item }">
          <v-icon v-if="item.activated">mdi-check</v-icon>
        </template>
        <template v-slot:item.locked="{ item }">
          <v-icon v-if="item.locked">mdi-check</v-icon>
        </template>
      </v-data-table>

    </v-card-text>






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
  </v-card>
</template>

<script>
import UserCreateDialog from '@/components/UserCreateDialog.vue'

export default {
  name: 'Users',
  components: {
    UserCreateDialog
  },
  data(){
    return {
      users: [],
      user_count: 0,
      options: {},
      headers: [
        {text: 'Avatar', value:'avatar'},
        {text: 'Username', value:'username'},
        {text: 'Display name', value:'display_name'},
        {text: 'Administrator', value:'administrator'},
        {text: 'Activated', value:'activated'},
        {text: 'Locked', value:'locked'},
      ],
      loading: false,
      search: '',


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
    user_created(){
      this.get_user_count()
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
