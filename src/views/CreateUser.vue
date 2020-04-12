<template>
  <div class="create_user">
    <form class="" v-on:submit.prevent="create_user()">
      <input type="text" v-model="user.properties.username" placeholder="username">
      <input type="password" v-model="user.properties.password_plain" placeholder="password">
      <input type="password" v-model="password_confirm" placeholder="password confirm">
      <input type="submit">
    </form>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'CreateUser',
  components: {

  },
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
        this.axios.post(`${process.env.VUE_APP_API_URL}/create_user`, {
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
}
</style>
