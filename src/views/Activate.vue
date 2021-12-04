<template>
  <v-card
    class="mx-auto py-3 mt-12"
    max-width="500px">
    <v-card-title>Account activation</v-card-title>

    <v-card-text
      class="text-center"
      v-if="processing">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-card-text>


    <v-card-text v-else-if="success">
      Activation successful, click <router-link :to="{ name: 'login' }">here</router-link> to login
    </v-card-text>

    <v-card-text v-else-if="error">
      Activation failed
    </v-card-text>







  </v-card>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Login',
  data(){
    return {
      processing: false,
      success: false,
      error: false,
    }
  },
  mounted(){
    this.activate_account()
  },
  methods: {
    activate_account(){
      this.processing = true
      const token = this.$route.query.token
      const options = {headers: {Authorization: `Bearer ${token}`}}
      const body = {activated: true}
      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/self`
      this.axios.patch(url,body,options)
      .then(({data}) => {
        console.log(data)
        this.success = true
      })
      .catch(error => {
        console.error(error)
        this.error = true
      })
      .finally(() => {
        this.processing = false
      })

    }

  }

}
</script>

<style scoped>

</style>
