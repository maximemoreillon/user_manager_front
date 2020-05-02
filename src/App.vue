<template>
  <div id="app">

    <AppTemplate applicationName="User manager">

      <template v-slot:navigation>
        <router-link to="/">
          <span>Profile</span>
        </router-link>

        <router-link to="/user_list">
          <span>User list</span>
        </router-link>

        <router-link
          to="/create_user"
          v-if="current_user_is_admin">
          <span>Create user</span>
        </router-link>

      </template>

    </AppTemplate>

  </div>
</template>

<script>

import AppTemplate from '@moreillon/vue_application_template'
import {authentication} from '@/mixins/authentication.js'



export default {
  name: 'app',
  components: {
    AppTemplate,
  },
  mixins: [
    authentication,
  ],
  data(){
    return {}
  }
}
</script>


<style>
table {
  width: 100%;
  border-collapse: collapse;
}
tr:not(:last-child){
  border-bottom: 1px solid #dddddd;
}

th, td {
  padding: 0.25em;
}
</style>
