import { defineStore } from 'pinia';
import { getDashboardData } from 'src/services/dashboardService';

export const useDashboardStore = defineStore('dashboardStore', {
  state: () => ({
    entrada: 0,
    saida: 0,
    saldo: 0,
    vendasPorCategoria: [],
    transacoesDoDia: [],
    loading: false,
    error: null,
  }),
  
  actions: {
    async fetchDashboardData(mesSelecionado) {
      this.loading = true;
      this.error = null;
      try {
        const data = await getDashboardData(mesSelecionado);
        this.entrada = data.entrada;
        this.saida = data.saida;
        this.saldo = data.saldo;
        this.vendasPorCategoria = data.vendasPorCategoria;
        this.transacoesDoDia = data.transacoesDoDia;
      } catch (error) {
        this.error = "Erro ao carregar dados do dashboard";
      } finally {
        this.loading = false;
      }
    }
  }
});