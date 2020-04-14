<template>
  <div class="user_details">
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
        <td>Admin</td>
        <td>{{user.properties.admin}}</td>
      </tr>

      <tr>
        <td>Delete</td>
        <td>
          <button type="button" v-on:click="delete_user()">
            by bye {{user.properties.username}}
          </button>
        </td>
      </tr>
    </table>

  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'UserDetails',
  components: {

  },
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
      this.axios.get(`${process.env.VUE_APP_USERS_API_URL}/user`, {
        params: {user_id: this.$route.query.id}
      })
      .then(response => {
        this.user = response.data

      })
      .catch( error => console.log(error))
    },

    delete_user(){
      if(confirm('really?')){
        this.axios.post(`${process.env.VUE_APP_USERS_API_URL}/delete_user`, {
          user_id: this.$route.query.id
        })
        .then(response => {
          console.log(response.data)
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
table {
  width: 100%;
  border-collapse: collapse;
}
tr:not(:last-child){
  border-bottom: 1px solid #dddddd;
}
td:first-child{
  font-weight: bold;
}
</style>
