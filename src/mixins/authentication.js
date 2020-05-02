export const authentication = {
  methods: {
    user_is_current_user(user){
      if(!user) return false
      if(!this.$store.state.current_user) return false
      else return this.$store.state.current_user.identity.low === user.identity.low
    }
  },
  computed: {
    current_user_is_admin(){
      if(!this.$store.state.current_user) return false
      else return this.$store.state.current_user.properties.isAdmin
    },

  }
};
