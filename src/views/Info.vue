<template>
  <div class="about">
    <v-card>
      <v-card-title>User manager</v-card-title>
      <v-card-text>
        A user management system developed by Maxime MOREILLON
      </v-card-text>
      <v-list dense>
        <v-list-item>
          <v-list-item-content>
            <div class="caption">Version</div>
            <div>{{version}}</div>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <div class="caption">API URL</div>
            <div>{{api_url}}</div>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <div class="caption">API version</div>
            <div>{{api_version}}</div>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import pjon from '@/../package.json'
export default {
  name: 'Info',
  data(){
    return {
      version: pjon.version,
      api_url: process.env.VUE_APP_USER_MANAGER_API_URL,
      api_version: 'unknown',
    }
  },
  mounted(){
    this.get_api_version()
  },
  methods: {
    get_api_version(){
      this.axios.get(this.api_url)
      .then(({data}) => this.api_version = data.version)
      .catch(error => {console.error(error)})
    }
  }

}
</script>
