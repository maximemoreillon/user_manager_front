<template>
  <div class="user_details">

    <h1 v-if="user">{{user.properties.username}}</h1>
    <h1 v-else>User info</h1>
    <p v-if="user_is_current_user(user)">(It's you)</p>

    <template v-if="user">
      <div class="avatar_wrapper">
        <img class="avatar" :src="avatar_src" alt="">

        <div class="">
          <button
            type="button"
            v-if="user_is_current_user(user)"
            v-on:click="update_property('avatar_src')">
            Update avatar
          </button>
        </div>

      </div>

      <table
        class="user_details_table"
        v-if="user">

        <tr>
          <td>Username</td>
          <td>{{user.properties.username}}</td>
        </tr>

        <tr>
          <td>ID</td>
          <td>{{user.identity.low}}</td>
        </tr>

        <tr>
          <td>E-mail address</td>
          <td>
            <span>{{user.properties.email_address}}</span>

            <button
              type="button"
              v-on:click="update_property('email_address')">
              Update
            </button>
          </td>
        </tr>

        <tr>
          <td>First name</td>
          <td>
            <span>{{user.properties.first_name}}</span>
            <button
              type="button"
              v-on:click="update_property('first_name')">
              Update
            </button>
          </td>
        </tr>

        <tr>
          <td>Last name</td>
          <td>
            <span>{{user.properties.last_name}}</span>
            <button
              type="button"
              v-on:click="update_property('last_name')">
              Update
            </button>
          </td>
        </tr>

        <tr>
          <td>Display name</td>
          <td>
            <span>{{user.properties.display_name}}</span>

            <button
              type="button"
              v-on:click="update_property('display_name')">
              Update
            </button>
          </td>
        </tr>

        <tr>
          <td>Admin</td>
          <td>
            <input
              type="checkbox"
              v-model="user.properties.isAdmin"
              v-on:change="update_admin_rights()"
              v-bind:disabled="!current_user_is_admin || user_is_current_user(user)">
          </td>
        </tr>

        <template v-if="user_is_current_user(user)">
          <tr>
            <td>User token</td>
            <td>
              <input type="text" :value="$cookies.get('jwt')" readonly>
            </td>
          </tr>
        </template>

        <template v-if="current_user_is_admin">
          <!-- Cannot delete oneself -->
          <tr
            v-if="!user_is_current_user(user)">
            <td>Delete</td>
            <td>
              <button type="button" v-on:click="delete_user()">
                Delete user
              </button>
            </td>
          </tr>
        </template>

      </table>
    </template>



  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import {authentication} from '@/mixins/authentication.js'
import {avatar_src} from '@/mixins/avatar_src.js'

export default {
  name: 'UserDetails',
  components: {

  },
  mixins: [
    authentication,
    avatar_src
  ],
  data(){
    return {
      user: null
    }
  },
  mounted(){
    this.get_user_details()
  },
  methods: {
    get_user_details(){
      this.axios.get(`${process.env.VUE_APP_USER_MANAGER_API_URL}/user`, {
        params: {user_id: this.$route.query.id}
      })
      .then(response => {
        this.user = response.data
      })
      .catch( error => console.log(error))
    },

    update_admin_rights(){
      this.axios.put(`${process.env.VUE_APP_USER_MANAGER_API_URL}/administrator_rights`, {
        user_id: this.user.identity.low,
        isAdmin: this.user.properties.isAdmin,
      })
      .then(() => {})
      .catch(error => {
        if(error.response) console.log(error.response.data)
        else console.log(error)
        alert(error)
        this.get_user_details()
      })
    },

    update_property(key){
      let value = prompt(`Enter new ${key}:`)
      if(value) {
        this.axios.put(`${process.env.VUE_APP_USER_MANAGER_API_URL}/user_property`, {
          user_id: this.user.identity.low,
          key: key,
          value: value,
        })
        .then(() => {
          this.get_user_details()
        })
        .catch(error => {
          if(error.response) console.log(error.response.data)
          else console.log(error)
          alert(error)
        })
      }
    },



    delete_user(){
      if(confirm('really?')){
        this.axios.delete(`${process.env.VUE_APP_USER_MANAGER_API_URL}/user`, {
          params: {user_id: this.user.identity.low}
        })
        .then( () => {
          this.$router.push({name: 'user_list'})
        })
        .catch( error => {
          if(error.response) console.log(error.response.data)
          else console.log(error)
        })
      }

    }
  }
}
</script>

<style scoped>

td:first-child{
  font-weight: bold;
}

.avatar_wrapper {
  text-align: center;
  margin: 0.5em 0;
}

.avatar {
  width: 200px;
  height: 200px;
  object-fit: contain;
}
</style>
