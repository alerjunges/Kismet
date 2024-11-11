import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null,
  }),
  actions: {
    login(username) {
      this.user = username; 
    },
    logout() {
      this.user = null; 
    }
  }
});
