<template>
  <AppTemplate
    :options="options"
    @user="user_changed($event)">

    <template v-slot:nav>
      <v-list
        dense
        nav >



        <v-list-item
          v-for="(item, index) in nav"
          :key="`nav_item_${index}`"
          :to="item.to"
          exact>
          <v-list-item-icon>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <template v-if="current_user_is_admin">
          <v-subheader>Admin</v-subheader>

          <v-list-item
            v-for="(item, index) in nav_admin"
            :key="`nav_item_admin_${index}`"
            :to="item.to"
            exact>
            <v-list-item-icon>
              <v-icon>{{item.icon}}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{item.title}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>




      </v-list>
    </template>

  </AppTemplate>
</template>

<script>
import AppTemplate from '@moreillon/vue_application_template_vuetify'

export default {
  name: 'App',
  components: {
    AppTemplate
  },
  data: () => ({
    options: {
      title: "User manager",
      authenticate: true,
      skip_greetings: process.env.NODE_ENV === 'developments',
      main_class: '#eeeeee',
      footer_color: '#eeeeee',
      login_url: `${process.env.VUE_APP_USER_MANAGER_API_URL}/auth/login`,
      identification_url: `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/self`,
    },
    nav: [
      //{title: 'Users', icon: 'mdi-account-multiple', to: {name: 'users', params: {}}},
      {title: 'Profile', icon: 'mdi-account', to: {name: 'user', params: {user_id: 'self'}}},
      {title: 'Info', icon: 'mdi-information-outline', to: {name: 'info', params: {}}},
    ],
    nav_admin: [
      {title: 'Users', icon: 'mdi-account-multiple', to: {name: 'users', params: {}}},
    ]
  }),
  methods: {
    user_changed(user){
      this.$store.commit('set_current_user', user)
    }
  },
  computed: {
    current_user_is_admin(){
      if(!this.$store.state.current_user) return false
      return this.$store.state.current_user.administrator
    },
  }

};
</script>

<style>


</style>
