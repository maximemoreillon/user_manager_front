export const authentication = {
  methods: {
    user_is_current_user(user){
      if(!user) return false
      if(!this.$store.state.current_user) return false
      return this.$store.state.current_user.identity === user.identity
    }
  },
  computed: {
    current_user_is_admin(){
      if(!this.$store.state.current_user) return false
      else return this.$store.state.current_user.properties.isAdmin
    },
    current_user_id(){
      return this.$store.state.current_user.identity.low
        || this.$store.state.current_user.identity
    }

  }
};
