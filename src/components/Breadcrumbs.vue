<template>
  <v-breadcrumbs :items="breadcrumbs"/>
</template>

<script>
  export default {
    name: 'BreadCrumbs',

    data: () => ({
      
    }),
    computed: {
      breadcrumbs(){
        let output = [
          {
            text: 'Users',
            exact: true,
            to: {name: 'users'},
          },
        ]

        if(this.$route.params.user_id) {
          output.push( {
            text: this.$route.params.user_id,
            disabled: true,
          })
        }
        return output
      }
    }
  }
</script>
