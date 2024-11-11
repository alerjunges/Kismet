import { defineStore } from "pinia";
import vendaService from "src/services/vendaService";

export const useVendaStore = defineStore("vendaStore", {
  state: () => ({
    vendas: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchVendasData() {
      this.loading = true;
      this.error = null;
      try {
        this.vendas = await vendaService.getVendasData();
      } catch (error) {
        this.error = "Erro ao carregar vendas";
      } finally {
        this.loading = false;
      }
    },

    async addVenda(novaVenda) {
      this.loading = true;
      this.error = null;
      try {
        const vendaAdicionada = await vendaService.addVenda(novaVenda);
        this.vendas.push(vendaAdicionada); 
      } catch (error) {
        this.error = "Erro ao adicionar venda";
      } finally {
        this.loading = false;
      }
    },

    async updateVenda(vendaId, vendaAtualizada) {
      this.loading = true;
      this.error = null;
      try {
        const venda = await vendaService.updateVenda(vendaId, vendaAtualizada); 
        const index = this.vendas.findIndex((v) => v.id === vendaId);
        if (index !== -1) {
          this.vendas.splice(index, 1, venda); 
        }
      } catch (err) {
        this.error = "Erro ao atualizar venda";
      } finally {
        this.loading = false;
      }
    },

    async deleteVenda(vendaId) {
      this.loading = true;
      this.error = null;
      try {
        await vendaService.deleteVenda(vendaId); 
        this.vendas = this.vendas.filter((v) => v.id !== vendaId); 
      } catch (err) {
        this.error = "Erro ao deletar venda";
      } finally {
        this.loading = false;
      }
    },
  },
});
