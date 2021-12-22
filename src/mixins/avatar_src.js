export const avatar_src = {

  computed: {
    avatar_src(){
      if(!this.user) return require('@/assets/account.svg')
      else if(this.user.avatar_src) return this.user.avatar_src
      else return require('@/assets/account.svg')
    },

  }
};
