import IdUtils from './IdUtils.js'

export const authentication = {
  mixins: [IdUtils],
  methods: {
    user_is_current_user(user){
      if(!user) return false
      const current_user = this.$store.state.current_user
      if(!current_user) return false

      return this.get_id_of_item(current_user) === this.get_id_of_item(user)
    }
  },
  computed: {
    current_user_is_admin(){
      if(!this.$store.state.current_user) return false
      else return this.$store.state.current_user.properties.isAdmin
    },

  }
};
