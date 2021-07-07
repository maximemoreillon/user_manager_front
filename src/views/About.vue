<template>
  <div class="about">
    <h1>User Manager GUI</h1>
    <p>A user management service developped by <a href="https://maximemoreillon.com">Maxime MOREILLON</a> </p>
    <h2>Services</h2>
    <table>
      <tr>
        <th>Service</th>
        <th>Version</th>
        <th>URL</th>
      </tr>
      <tr
        v-for="(service, index) in services"
        :key="`service_${index}`">
        <td>{{service.name}}</td>
        <td>{{service.version}}</td>
        <td>{{service.url}}</td>
      </tr>
    </table>

  </div>
</template>

<script>
import pjson from '@/../package.json'

export default {
  name: 'Search',
  components: {

  },
  mounted(){
    this.get_services_version()
  },
  get_services_version () {
    this.services.forEach((service) => {
      if (service.version) return
      service.version = 'Connecting...'
      this.axios.get(service.url)
        .then(({ data }) => { service.version = data.version })
        .catch(() => { service.version = 'Unable to connect' })
    })
  }
  data(){
    return {
      services: [
        {
          name: 'User manager GUI',
          url: window.location.origin,
          version: pjson.version
        },
        {
          name: 'User manager API',
          url: process.env.VUE_APP_USER_MANAGER_API_URL,
          version: null
        },

      ],
    }
  },


}
</script>

<style scoped>

a {
  color: currentcolor;
}
</style>
