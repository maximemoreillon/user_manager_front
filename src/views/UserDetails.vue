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
            <input type="email" v-model="user.properties.email_address">
          </td>
        </tr>



        <tr>
          <td>First name</td>
          <td>
            <input type="text" v-model="user.properties.first_name">
          </td>
        </tr>

        <tr>
          <td>Last name</td>
          <td>
            <input type="text" v-model="user.properties.last_name">
          </td>
        </tr>

        <tr>
          <td>Display name</td>
          <td>
            <input type="text" v-model="user.properties.display_name">
          </td>
        </tr>

        <tr v-if="current_user_is_admin">
          <td>Admin</td>
          <td>
            <input
              type="checkbox"
              v-model="user.properties.isAdmin"
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

        <tr>
          <td>Save</td>
          <td>
            <button
              type="button"
              v-on:click="patch_user()">
              Save
            </button>
          </td>
        </tr>

        <tr v-if="user_is_current_user(user) || current_user_is_admin">
          <td>Password update</td>
          <td>
            <form class="" @submit.prevent="password_update()">

              <div class="">
                <label>New password: </label>
                <input type="password" v-model="new_password" placeholder="New password">
              </div>

              <div class="">
                <label>Password confirm: </label>
                <input type="password" v-model="new_password_confirm" placeholder="New password confirm">
              </div>

              <div class="">
                <input type="submit">
              </div>

            </form>
          </td>
        </tr>




        <!-- Cannot delete oneself -->
        <tr
          v-if="!user_is_current_user(user) && current_user_is_admin">
          <td>Delete</td>
          <td>
            <button type="button" v-on:click="delete_user()">
              Delete user
            </button>
          </td>
        </tr>

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
      user: null,

      new_password: '',
      new_password_confirm: '',
    }
  },
  mounted(){
    this.get_user_details()
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.$nextTick().then(() => {
      this.get_user_details()
    })
  },

  methods: {
    get_user_details(){
      let user_id = this.$route.query.id || 'self'
      let url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/${user_id}`
      this.axios.get(url)
      .then(response => {
        this.user = response.data
      })
      .catch( error => console.log(error))
    },


    patch_user(){
      this.axios.patch(`${process.env.VUE_APP_USER_MANAGER_API_URL}/users/${this.user.identity.low}`, this.user.properties)
      .then(() => {
        alert(`User data updated successfully`)
      })
      .catch(error => {
        if(error.response) console.log(error.response.data)
        else console.log(error)
        alert(error)
        this.get_user_details()
      })
    },

    password_update(){
      if(this.new_password !== this.new_password_confirm ) return alert (`Passwords don't match`)
      let url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/${this.user.identity.low}/password`
      this.axios.put(url, {new_password: this.new_password})
      .then( () => {
        alert(`Password updated successfully`)
        this.new_password = ''
        this.new_password_confirm = ''
      })
      .catch(error => {
        if(error.response) console.log(error.response.data)
        else console.log(error)
        alert(error)
        this.get_user_details()
      })
    },

    delete_user(){
      if(!confirm('really?')) return

      let user_id = this.user.identity.low
      let url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/${user_id}`
      this.axios.delete(url)
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
