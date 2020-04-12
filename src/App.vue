<template>
  <div id="app">

    <AppTemplate applicationName="User manager">

      <template v-slot:navigation>
        <router-link to="/">
          <span>Home</span>
        </router-link>
        <router-link to="/create_user">
          <span>Create user</span>
        </router-link>
      </template>

    </AppTemplate>

  </div>
</template>

<script>
//import AppTemplate from '@/components/vue_application_template/AppTemplate.vue'
import AppTemplate from '@moreillon/vue_application_template'



export default {
  name: 'app',
  components: {
    AppTemplate,
  },

  data(){
    return {}
  }
}
</script>


<style>

</style>
