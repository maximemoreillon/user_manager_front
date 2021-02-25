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
          <td>{{user.identity}}</td>
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
              :disabled="!properties_modified"
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

        <input
          class="username_accessibility_input"
          type="text"
          autocomplete="username"
          placeholder="username"
          :value="user.properties.username">

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
              <input
                type="password"
                v-model="new_password"
                placeholder="New password"
                autocomplete="new-password">
            </td>
          </tr>
          <tr>
            <td>Password confirm</td>
            <td>
              <input
                type="password"
                v-model="new_password_confirm"
                placeholder="New password confirm"
                autocomplete="new-password-confirm">
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
      unmodified_user_copy: null,

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
    save_copy_of_user(){
      this.unmodified_user_copy = JSON.parse(JSON.stringify(this.user))
    },
    get_user_details(){
      const user_id = this.$route.params.user_id
        || this.$route.params.id
        || this.$route.query.id
        || 'self'

      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/${user_id}`
      this.axios.get(url)
      .then(response => {
        this.user = response.data
        // passwords should not be messed with
        delete this.user.properties.password_hashed

        this.save_copy_of_user()
      })
      .catch( error => console.log(error))
    },


    patch_user(){

      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/${this.user.identity}`
      const body = this.modified_properties

      this.axios.patch(url, body)
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

      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/${this.user.identity}/password`

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

      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/${this.user.identity}`
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
      const {year,month,day} = date
      return `${year}/${month}/${day}`
    },

    isObject(object) {
      return object != null && typeof object === 'object';
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
    },
    modified_properties(){
      // Note: Neo4J does not have nested properties
      const unmodified_user_keys = Object.keys(this.unmodified_user_copy.properties)
      //const current_keys = Object.keys(this.user.properties)

      let modified_properties = {}
      unmodified_user_keys.forEach((key) => {
        const original_value = this.unmodified_user_copy.properties[key]

        // Only deal with non-nested stuff
        if(this.isObject(original_value)) return

        const current_value = this.user.properties[key]

        // If there is a modification, add it to an object of modified properties
        if(original_value !== current_value) {
          modified_properties[key] = current_value
        }
      })

      return modified_properties
    },
    properties_modified(){
      return Object.keys(this.modified_properties).length > 0
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

.username_accessibility_input {
  display: none;
}
</style>
