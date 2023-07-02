<template>
  <div>
    <v-card class="mx-auto py-3 mt-12" max-width="500px">
      <v-card-title>Password update</v-card-title>

      <v-card-text v-if="!success">
        <v-form
          @submit.prevent="update_password()"
          lazy-validation
          v-model="form_valid"
        >
          <v-row>
            <v-col>
              <v-text-field
                type="password"
                label="New password"
                v-model="new_password"
                :rules="passwordRules"
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                type="password"
                label="Password confirm"
                v-model="new_password_confirm"
                :rules="passwordConfirmRules"
                required
              />
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="auto">
              <v-btn :disabled="!form_valid" :loading="loading" type="submit">
                Set password
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <template v-if="!loading && success">
        <v-card-text>
          Password update successful, click
          <router-link :to="{ name: 'login' }">here</router-link> to login.
        </v-card-text>
      </template>
    </v-card>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "PasswordReset",
  data() {
    return {
      new_password: null,
      new_password_confirm: null,
      loading: false,
      success: false,
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
  mounted() {},
  methods: {
    update_password() {
      if (this.new_password !== this.new_password_confirm)
        return alert("Password confirm does not match")
      this.loading = true
      const url = `/users/self/password`
      const token = this.$route.query.token
      const headers = { authorization: `Bearer ${token}` }
      const body = {
        new_password: this.new_password,
        new_password_confirm: this.new_password_confirm,
      }
      this.axios
        .patch(url, body, { headers })
        .then(() => {
          this.success = true
        })
        .catch((error) => {
          console.error(error)
          this.error = true
          alert(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style scoped></style>
