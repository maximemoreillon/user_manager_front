<template>
  <div class="home">
    <h1>User list</h1>

    <div class="list_header">
      <span>{{user_count}} user(s)</span>
      <span class="spacer"></span>
      <input type="text" v-model="search" placeholder="Search">
    </div>

    <div class="table_wrapper">
      <table>

        <tr>
          <th></th>
          <th>Username</th>
          <th>Display name</th>
          <th>admin</th>
        </tr>
        <tr
          v-for="(user, index) in filtered_users"
          v-bind:key="`user_${index}`">
          <td>
            <img
              :src="user.avatar_src || require('@/assets/account.png')">
          </td>
          <td>
            <router-link
              :to="{ name: 'user_details', params: {user_id: get_id_of_item(user)} }">
              {{user.username}}
            </router-link>
          </td>
          <td>
            {{user.display_name}}
          </td>
          <td>
            {{user.isAdmin}}
          </td>
        </tr>
      </table>

    </div>

    <!-- <UserPreview
      v-for="(user, index) in users"
      v-bind:key="`user_${index}`"
      v-bind:user="user"/> -->



  </div>
</template>

<script>
// @ is an alias to /src
//import UserPreview from '@/components/UserPreview.vue'
import {authentication} from '@/mixins/authentication.js'
import IdUtils from '@/mixins/IdUtils.js'

export default {
  name: 'Home',
  components: {
    //UserPreview
  },
  data(){
    return {
      user_count: null,
      users: [],
      search: '',
    }
  },
  mixins: [
    authentication,
    IdUtils,
  ],
  mounted(){
    this.get_user_list()
  },
  methods: {
    get_user_list(){
      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/v2/users`
      const options = {params: {}}
      this.axios.get(url, options)
      .then(({data}) => {
        this.user_count = data.count
        this.users = data.users
       })
      .catch( error => console.log(error))
    },
    avatar_src(user){
      if(!user.avatar_src) return require('@/assets/account.svg')
      return user.avatar_src
    }

  },
  computed: {
    filtered_users(){
      if(this.search === '') return this.users
      return this.users.filter(u => {
        const username_lower = u.username.toLowerCase()
        const display_name_lower = u.properties.display_name.toLowerCase()

        return username_lower.includes(this.search.toLowerCase())
          || display_name_lower.includes(this.search.toLowerCase())

      })
    }
  }
}
</script>

<style scoped>

.list_header {
  margin: 2em 0;
  display: flex;
  align-items: center;
}

.spacer {
  flex-grow: 1;
}
.list_header > *+* {
  margin-left: 3em;
}

input[type="text"] {
  flex-grow: 1;
  border: none;
  border-bottom: 1px solid grey;
  padding: 0.5em;

}

table {
  text-align: center;
}

td a {
  color: inherit;
  //text-decoration: none;
  //font-weight: bold;
}

td img {
  height: 2em;
  width: 2em;
}

td a:hover {
  color: #c00000;
}
</style>
