<template>
  <div class="user_details">

    <h1 v-if="user">{{user.properties.username}}</h1>
    <h1 v-else>User info</h1>
    <p v-if="user_is_current_user(user)">(It's you)</p>

    <template v-if="user">
      <div class="avatar_wrapper">
        <img class="avatar" :src="avatar_src" alt="">
      </div>

      <h2>User properties</h2>

      <table
        class="user_details_table"
        v-if="user">

        <tr>
          <td>Username</td>
          <td>{{user.properties.username}}</td>
        </tr>

        <tr>
          <td>User ID</td>
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
          <td>Administrator</td>
          <td>
            <input
              type="checkbox"
              v-model="user.properties.isAdmin"
              v-bind:disabled="!current_user_is_admin || user_is_current_user(user)">
              <span v-if="current_user_is_admin && user_is_current_user(user)">
                Cannot remove one's own admin rights
              </span>
          </td>
        </tr>

        <tr v-if="current_user_is_admin">
          <td>Last login</td>
          <td v-if="user.properties.last_login">
            {{format_date_neo4j(user.properties.last_login)}}
          </td>
          <td v-else>Never</td>
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

        <!-- Delete user -->
        <tr
          v-if="current_user_is_admin">
          <td>Delete user</td>
          <td>
            <button
              type="button"
              v-on:click="delete_user()"
              :disabled="user_is_current_user(user)">
              Delete user
            </button>
          </td>
        </tr>

      </table>

      <template v-if="user_is_current_user(user) || current_user_is_admin">
        <h2>Password update</h2>
        <form class="" @submit.prevent="password_update()">
        <table>
          <tr v-if="!current_user_is_admin">
            <td>Current password</td>
            <td>
              <input
                type="password"
                v-model="current_password"
                placeholder="Current password">
            </td>
          <tr>
            <td>New password</td>
            <td>
              <input type="password" v-model="new_password" placeholder="New password">
            </td>
          </tr>
          <tr>
            <td>Password confirm</td>
            <td>
              <input type="password" v-model="new_password_confirm" placeholder="New password confirm">
            </td>
          </tr>
          <tr>
            <td>Submit</td>
            <td>
              <div
                class="error"
                v-if="password_too_short">
                Password too short (min 6 characters)
              </div>
              <div
                class="error"
                v-if="passwords_mismatch">
                Password mismatch
              </div>
              <div class="">
                <input
                  type="submit"
                  value="Password update"
                  :disabled="password_invalid">
              </div>

            </td>
          </tr>

        </table>
        </form>
      </template>

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

      current_password: '',
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
      let user_id = this.$route.params.user_id
        || this.$route.params.id
        || this.$route.query.id
        || 'self'

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
      if(this.password_invalid) return alert ('Invalid new password')

      let url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/${this.user.identity.low}/password`

      this.axios.put(url, {
        new_password: this.new_password,
        new_password_confirm: this.new_password_confirm,
        current_password: this.current_password
      })
      .then( () => {
        // clear inputs

        this.new_password = ''
        this.new_password_confirm = ''
        this.current_password = ''

        // Inform user
        alert('Password updated successfully')
      })
      .catch(error => {

        if(error.response) {
          console.log(error.response.data)
          alert(`Error updating password: ${error.response.data}`)
        }
        else {
          alert(`Error updating password`)
          console.log(error)
        }
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

    },
    format_date_neo4j(date){
      let year = date.year.low
      let month = date.month.low
      let day = date.day.low
      return `${year}/${month}/${day}`
    },
  },
  computed: {
    passwords_mismatch(){
      return this.new_password != this.new_password_confirm
    },
    password_too_short() {
      return this.new_password.length < 6
    },
    password_invalid() {
      return this.password_too_short || this.passwords_mismatch
    }
  }
}
</script>

<style scoped>



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
