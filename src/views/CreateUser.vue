<template>
  <div class="create_user">
    <h1>Create user</h1>

    <form
      class=""
      v-if="current_user_is_admin"
      v-on:submit.prevent="create_user()">

      <table>
        <tr>
          <td>Username</td>
          <td>
            <input type="text" v-model="username" placeholder="username">
          </td>
        </tr>
        <tr>
          <td>Password</td>
          <td>
            <input type="password" v-model="password" placeholder="password">
          </td>
        </tr>
        <tr>
          <td>Password confirm</td>
          <td><input type="password" v-model="password_confirm" placeholder="password confirm"></td>
        </tr>
        <tr>
          <td>Submit</td>
          <td>
            <input type="submit">
          </td>

        </tr>
      </table>






    </form>

    <!-- If not admin -->
    <div class="" v-else>
      Unauthorized
    </div>
  </div>
</template>

<script>
import {authentication} from '@/mixins/authentication.js'
import IdUtils from '@/mixins/IdUtils.js'

export default {
  name: 'CreateUser',
  components: {

  },
  mixins: [
    authentication,
    IdUtils,
  ],
  data(){
    return {
      username: "",
      password: "",
      password_confirm: "",

    }
  },
  mounted(){

  },
  methods: {
    create_user(){
      if(this.password_confirm !== this.password) return alert('Passwords do not match')
      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users`
      const body = {
        username: this.username,
        password: this.password,
        password_confirm: this.password_confirm,
      }
      this.axios.post(url, body)
      .then(({data}) => {
        const user_id = this.get_id_of_item(data)
        this.$router.push({name: 'user_details', params: {user_id}})
       })
      .catch( (error) => {
        if(error.response) {
          console.error(error.response.data)
          alert(error.response.data)
        }
        else {
          console.error(error)
          alert(`Failed to create user, see console for details`)
        }

      })
    }
  }
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
