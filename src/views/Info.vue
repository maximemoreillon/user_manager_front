<template>
  <div class="about">
    <h1>User manager</h1>
    <p>User manager API URL: {{user_manager_api_url || 'UNDEFINED'}}</p>
    <p>Authentication API URL: {{authentication_api_url || 'UNDEFINED'}}</p>
  </div>
</template>

<script>

export default {
  name: 'Info',
  data(){
    return {
      authentication_api_url: process.env.VUE_APP_AUTHENTICATION_API_URL,
      user_manager_api_url: process.env.VUE_APP_USER_MANAGER_API_URL,
    }
  }
}
</script>
