<template>
  <div id="app">

    <AppTemplate
      :options="options"
      @user="$store.commit('set_current_user', $event)">

      <template v-slot:nav>
        <router-link :to="{ name: 'user_details', params: {user_id: 'self'} }">
          <AccountIcon/>
          <span>My profile</span>
        </router-link>

        <router-link to="/user_list">
          <FormatListBulletedIcon/>
          <span>User list</span>
        </router-link>

        <router-link
          to="/create_user"
          v-if="current_user_is_admin">
          <AccountPlusIcon/>
          <span>Create user</span>
        </router-link>

        <router-link
          to="/about">
          <InformationOutlinetIcon/>
          <span>About</span>
        </router-link>

      </template>

    </AppTemplate>

  </div>
</template>

<script>

import AppTemplate from '@moreillon/vue_application_template'
import {authentication} from '@/mixins/authentication.js'

import AccountIcon from 'vue-material-design-icons/Account.vue'
import AccountPlusIcon from 'vue-material-design-icons/AccountPlus.vue'

import FormatListBulletedIcon from 'vue-material-design-icons/FormatListBulleted.vue'

import InformationOutlinetIcon from 'vue-material-design-icons/InformationOutline.vue'


export default {
  name: 'app',
  components: {
    AppTemplate,
    AccountIcon,
    InformationOutlinetIcon,
    FormatListBulletedIcon,
    AccountPlusIcon
  },
  mixins: [
    authentication,
  ],
  data(){
    return {
      options: {
        title: 'User manager',
        authenticate: true,
        login_url: `${process.env.VUE_APP_USER_MANAGER_API_URL}/auth/login`,
        identification_url: `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/self`
      }
    }
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
