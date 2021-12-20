<template>
  <v-card
    max-width="600px"
    class="mx-auto">
    <v-card-title>User manager</v-card-title>
    <v-card-text>
      A user management system developed by <a href="https://maximemoreillon.com">Maxime MOREILLON</a>
    </v-card-text>
    <v-list dense>
      <v-list-item>
        <v-list-item-content>
          <div class="caption">GUI Version</div>
          <div>{{version}}</div>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <div class="caption">API URL</div>
          <div>
            <a :href="api_url">{{api_url}}</a>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-list>


  </v-card>
</template>

<script>
import pjon from '@/../package.json'
export default {
  name: 'Info',
  data(){
    return {
      version: pjon.version,
      api_url: process.env.VUE_APP_USER_MANAGER_API_URL,
    }
  },


}
</script>
