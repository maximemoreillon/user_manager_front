<template>
  <div
    class="user_preview"
    v-on:click="$router.push({name: 'user_details', query: {id: user.identity.low}})">
    {{user.properties.username}}
  </div>
</template>

<script>
export default {
  name: 'UserPreview',
  props: {
    user: Object
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.user_preview {
  border: 1px solid #dddddd;
  padding: 5px;
  margin: 5px 0;
  cursor: pointer;
  transition: border-color 0.25s;
}

.user_preview:hover {
  border-color: #c00000;
}
</style>
