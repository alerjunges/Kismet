import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null,
  }),
  actions: {
    login(username) {
      this.user = username; // Define o usuário logado
    },
    logout() {
      this.user = null; // Limpa o usuário ao fazer logout
    }
  }
});
