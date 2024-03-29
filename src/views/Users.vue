<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title>Users</v-toolbar-title>
      <v-spacer />
      <v-btn text :to="{ name: 'register' }">
        <v-icon left>mdi-account-plus</v-icon>
        <span>Create user</span>
      </v-btn>
    </v-toolbar>
    <v-divider />

    <v-card-text>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="users"
        :options.sync="options"
        @click:row="row_clicked($event)"
        :server-items-length="user_count"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-spacer />

            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              @change="get_users()"
              @click:append="get_users()"
            />
          </v-toolbar>
        </template>

        <!-- Avatar -->
        <template v-slot:item.avatar="{ item }">
          <v-avatar size="24">
            <img :src="item.avatar_src" alt="avatar" v-if="item.avatar_src" />
            <v-icon v-else>mdi-account-circle</v-icon>
          </v-avatar>
        </template>

        <template v-slot:item.last_login="{ item }">
          {{ format_date(item.last_login) }}
        </template>

        <!-- Boolean properties -->
        <template v-slot:item.isAdmin="{ item }">
          <v-icon v-if="item.isAdmin">mdi-check</v-icon>
        </template>
        <template v-slot:item.activated="{ item }">
          <v-icon v-if="item.activated">mdi-check</v-icon>
        </template>
        <template v-slot:item.locked="{ item }">
          <v-icon v-if="item.locked">mdi-check</v-icon>
        </template>
      </v-data-table>
    </v-card-text>

    <v-snackbar color="#C00000" dark v-model="snackbar.show">
      {{ snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn icon v-bind="attrs" @click="snackbar.show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import CurrentUser from "@/mixins/CurrentUser.js"
import dateUtils from "@/mixins/dateUtils.js"

export default {
  name: "Users",
  mixins: [CurrentUser, dateUtils],

  data() {
    return {
      users: [],

      user_count: 0,

      options: {},
      headers: [
        { text: "Avatar", value: "avatar" },
        { text: "Username", value: "username" },
        { text: "Display name", value: "display_name" },
        { text: "Administrator", value: "isAdmin" },
        { text: "Activated", value: "activated" },
        { text: "Locked", value: "locked" },
        { text: "Last login", value: "last_login" },
      ],
      loading: false,
      search: "",

      snackbar: {
        show: false,
        text: "",
      },
    }
  },
  mounted() {
    this.get_users()
  },
  watch: {
    options: {
      handler() {
        this.get_users()
      },
      deep: true,
    },
  },
  methods: {
    get_users() {
      this.loading = true
      const { itemsPerPage, page, sortBy, sortDesc } = this.options

      const url = `/users`
      const params = {
        skip: (page - 1) * itemsPerPage,
        limit: itemsPerPage,
        sort: sortBy[0],
        order: sortDesc[0] ? -1 : 1,
        search: this.search,
      }

      this.axios
        .get(url, { params })
        .then(({ data }) => {
          this.users = data.users
          this.user_count = data.count
        })
        .catch((error) => {
          console.error(error)
          if (error.response) this.snackbar.text = error.response.data
          else this.snackbar.text = "Failed to get users"
          this.snackbar.show = true
        })
        .finally(() => {
          this.loading = false
        })
    },
    row_clicked(item) {
      this.$router.push({ name: "user", params: { user_id: item._id } })
    },
  },
  computed: {
    user_is_current_user() {
      const user_id = this.$route.params.user_id
      if (!user_id) return true
      return this.current_user_id === user_id
    },
  },
}
</script>

<style>
tr {
  cursor: pointer;
}
</style>
