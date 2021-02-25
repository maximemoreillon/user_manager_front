export const authentication = {
  methods: {
    user_is_current_user(user){
      if(!user) return false
      if(!this.$store.state.current_user) return false
      // using strinigy for robusntess agains disableLossLess Integers
      return JSON.stringify(this.$store.state.current_user.identity.low) === JSON.stringify(user.identity.low)
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
