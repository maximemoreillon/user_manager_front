<template>
  <div
    class="user_preview"
    v-on:click="$router.push({name: 'user_details', params: {user_id}})">

    <img class="avatar" :src="avatar_src" >

    <div class="username">{{user_displayed_name}}</div>


  </div>

</template>

<script>
import {avatar_src} from '@/mixins/avatar_src.js'
import IdUtils from '@/mixins/IdUtils.js'

export default {
  name: 'UserPreview',
  props: {
    user: Object
  },
  mixins: [
    avatar_src,
    IdUtils,
  ],
  computed: {
    user_displayed_name(){
      const {properties} = this.user
      return properties.username
        || properties.display_name
        || properties.name
        || properties.full_name
        || properties.name_kanji
    },
    user_id(){
      return this.get_id_of_item(this.user)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.user_preview {
  display: flex;
  align-items: center;
  border: 1px solid #dddddd;
  padding: 0.25em;
  margin: 0.25em 0;
  cursor: pointer;
  transition: border-color 0.25s;
}

.user_preview > *:not(:last-child) {
  margin-right: 0.25em;
}

.user_preview:hover {
  border-color: #c00000;
}

.avatar {
  height: 1em;
  width: 1em;
  object-fit: contain;
}
</style>
