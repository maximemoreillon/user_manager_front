<template>
  <div class="about">
    <h1>User Manager GUI</h1>
    <p>Version {{version}}</p>
    <p>Developped by <a href="https://maximemoreillon.com">Maxime MOREILLON</a> </p>
    <p>User manager API URL: {{auser_manager_api_url}}</p>

  </div>
</template>

<script>
import pjson from '@/../package.json'

export default {
  name: 'Search',
  components: {

  },
  data(){
    return {
      version: pjson.version,
      auser_manager_api_url: process.env.VUE_APP_USER_MANAGER_API_URL,
      authentication_api_url: process.env.VUE_APP_AUTHENTICATION_API_URL,
    }
  },


}
</script>

<style scoped>

a {
  color: currentcolor;
}
</style>
