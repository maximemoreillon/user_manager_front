<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on">
        <v-icon>mdi-lock-reset</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Password update</v-card-title>
      <v-card-text>
        <v-form
          @submit.prevent="update_pasword()"
          lazy-validation
          v-model="form_valid"
        >
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  type="password"
                  label="New password"
                  v-model="new_password"
                  :rules="passwordConfirmRules"
                  required
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  type="password"
                  label="New password confirm"
                  v-model="new_password_confirm"
                  :rules="passwordConfirmRules"
                  required
                />
              </v-col>
            </v-row>
            <v-btn type="submit" style="display: none">submit</v-btn>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="clear_password_update()">
          Cancel
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="update_pasword()"
          :disabled="!form_valid"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "PasswordUpdateDialog",

  data() {
    return {
      dialog: false,
      new_password: null,
      new_password_confirm: null,
      form_valid: false,
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) =>
          (v && v.length >= 5) || "Password must be more than 5 characters",
      ],
      passwordConfirmRules: [
        (v) => !!v || "Password confirm is required",
        (v) => v === this.new_password || "Passwords must match",
      ],
    }
  },
  methods: {
    update_pasword() {
      if (this.new_password !== this.new_password_confirm)
        return alert("Password confirm does not match")
      const user_id = this.$route.params.user_id || "self"
      const url = `/users/${user_id}/password`
      const { new_password, new_password_confirm } = this
      const body = { new_password, new_password_confirm }
      this.axios
        .put(url, body)
        .then(() => {
          this.$emit("passwordUpdated")
          this.clear_password_update()
          this.dialog = false
          //this.sucess_message('Password updated successfully')
        })
        .catch((error) => {
          console.error(error)
          alert(`Failed tu update password`)
          // if(error.response) this.error_message(error.response.data)
          // else this.error_message(`Error updating password`)
        })
    },
    clear_password_update() {
      this.new_password = ""
      this.mew_password_confirm = ""
    },
  },
  computed: {},
}
</script>
