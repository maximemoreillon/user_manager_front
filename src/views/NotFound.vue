<template>
  <v-card max-width="30em" class="mx-auto">
    <v-card-title>Page not found</v-card-title>
    <v-card-text>
      <RouterLink :to="{ name: 'user', params: { user_id: 'self' } }">
        Return to main page</RouterLink
      >
    </v-card-text>
  </v-card>
</template>

<script>
import pjon from "@/../package.json"
export default {
  name: "Info",
  data() {
    return {
      version: pjon.version,
      api_url: process.env.VUE_APP_USER_MANAGER_API_URL,
    }
  },
}
</script>
