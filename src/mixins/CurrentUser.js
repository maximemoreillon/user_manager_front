export default {

  computed: {
    current_user () {
      return this.$store.state.current_user
    },
    current_user_id () {
      if(!this.current_user) return undefined
      return this.current_user._id
    },
    current_user_is_admin () {
      if(!this.current_user) return undefined
      return this.current_user.isAdmin
        || this.current_user.administrator
    },
  }
}
