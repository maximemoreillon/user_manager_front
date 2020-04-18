<template>
  <div class="home">

    <UserPreview
      v-for="user in users"
      v-bind:key="user.identity.low"
      v-bind:user="user"/>

  </div>
</template>

<script>
// @ is an alias to /src
import UserPreview from '@/components/UserPreview.vue'

export default {
  name: 'Home',
  components: {
    UserPreview
  },
  data(){
    return {
      users: []
    }
  },
  mounted(){
    this.get_user_list()
  },
  methods: {
    get_user_list(){
      this.axios.get(`${process.env.VUE_APP_USER_MANAGER_API_URL}/all_users`)
      .then(response => {
        this.users.splice(0, this.users.length)
        response.data.forEach((record) => {
          let user = record._fields[record._fieldLookup['user']]
          this.users.push(user)
        })

      })
      .catch( error => console.log(error))
    }
  }
}
</script>
