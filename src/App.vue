<template>
  <div id="app">

    <AppTemplate
      authenticate
      applicationName="User manager">

      <template v-slot:navigation>
        <router-link :to="{ name: 'user_details', params: {user_id: 'self'} }">
          <span>My profile</span>
        </router-link>

        <router-link to="/user_list">
          <span>User list</span>
        </router-link>

        <router-link
          to="/create_user"
          v-if="current_user_is_admin">
          <span>Create user</span>
        </router-link>

        <router-link
          to="/about">
          <span>About</span>
        </router-link>

      </template>

    </AppTemplate>

  </div>
</template>

<script>

import AppTemplate from '@moreillon/vue_application_template_flex'
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
  table-layout: fixed;
}

table input[type="text"],
table input[type="password"],
table input[type="email"] {
  width: 100%;
}

tr:not(:last-child){
  border-bottom: 1px solid #dddddd;
}

th, td {
  padding: 0.25em;
}

.error {
  color: #c00000;
}
</style>
