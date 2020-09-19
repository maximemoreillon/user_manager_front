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
            <input type="text" v-model="user.properties.username" placeholder="username">
          </td>
        </tr>
        <tr>
          <td>Password</td>
          <td>
            <input type="password" v-model="user.properties.password_plain" placeholder="password">
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

export default {
  name: 'CreateUser',
  components: {

  },
  mixins: [
    authentication,
  ],
  data(){
    return {
      user: {
        properties: {
          username: "",
          password_plain: ""
        }
      },
      password_confirm: "",

    }
  },
  mounted(){

  },
  methods: {
    create_user(){
      if(this.password_confirm === this.user.properties.password_plain){
        this.axios.post(`${process.env.VUE_APP_USER_MANAGER_API_URL}/user`, {
          user: this.user
        })
        .then(response => {
          this.$router.push({name: 'user_details', query: {id: response.data.identity.low}})
        })
        .catch( error => console.log(error))
      }
      else {
        alert('Passwords do not match')
      }

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
