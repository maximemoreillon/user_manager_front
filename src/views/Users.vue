<template>
 

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

          <!--
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details/>
          

          <v-spacer></v-spacer>
          -->

          <v-btn
            :to="{name: 'create_user'}">
            <v-icon>mdi-account-plus</v-icon>
            <span>Create user</span>
            </v-btn>

        </v-toolbar>
      </template>

      




    </v-data-table>

</template>

<script>
export default {
  name: 'Users',
  data(){
    return {
      error_message: null,
      users: [],
      user_count: 0,
      options: {},
      headers: [
        {text: 'Username', value:'username'},
        {text: 'Display name', value:'display_name'},
      ],
      loading: false,
      search: '',
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
        this.get_users()
      })
      .catch( error => {
        console.error(error)
      })

    },
    get_users(){
      this.loading = true
      this.error_message = null

      const { page, itemsPerPage } = this.options


      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users`
      const params = {
        skip: (page-1) * itemsPerPage, 
        limit: itemsPerPage
      }
      this.axios.get(url, {params})
      .then( ({data}) => {
        this.users = []
        data.forEach((user) => {
          this.users.push(user)
        })

      })
      .catch( error => {
        console.error(error)
        if(error.response) this.error_message = error.response.data
      })
      .finally( () => {
        this.loading = false
      })
    },
    row_clicked(item){
      this.$router.push({name: 'user', params: {user_id: item._id}})
    }
  }
}
</script>

<style>
tr {
  cursor: pointer;
}
</style>
