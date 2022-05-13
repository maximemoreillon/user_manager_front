<template>
  <v-snackbar
    v-model="snack.show"
    :color="snack.color">
    {{snack.text}}
    <template v-slot:action="{ attrs }">
      <v-btn
        icon
        v-bind="attrs"
        @click="snack.show = false" >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: 'SnackBar',
  props: {
    snack: Object
  },

}
</script>
