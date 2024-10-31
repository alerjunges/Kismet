import { defineStore } from "pinia";
import vendaService from "src/services/vendaService";

export const useVendaStore = defineStore("vendaStore", {
  state: () => ({
    vendas: [],
    loading: false,
    error: null,
  }),

  actions: {
    // Ação para buscar os dados de vendas
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

    // Ação para adicionar uma nova venda
    async addVenda(novaVenda) {
      this.loading = true;
      this.error = null;
      try {
        const vendaAdicionada = await vendaService.addVenda(novaVenda);
        this.vendas.push(vendaAdicionada); // Adiciona a venda à lista local
      } catch (error) {
        this.error = "Erro ao adicionar venda";
      } finally {
        this.loading = false;
      }
    },

    // Ação para atualizar uma venda existente
    async updateVenda(vendaId, vendaAtualizada) {
      this.loading = true;
      this.error = null;
      try {
        const venda = await vendaService.updateVenda(vendaId, vendaAtualizada); // Atualiza a venda via serviço
        const index = this.vendas.findIndex((v) => v.id === vendaId); // Encontra o índice da venda na lista
        if (index !== -1) {
          this.vendas.splice(index, 1, venda); // Substitui a venda atualizada na lista local
        }
      } catch (err) {
        this.error = "Erro ao atualizar venda";
      } finally {
        this.loading = false;
      }
    },

    // Ação para deletar uma venda
    async deleteVenda(vendaId) {
      this.loading = true;
      this.error = null;
      try {
        await vendaService.deleteVenda(vendaId); // Deleta a venda via serviço
        this.vendas = this.vendas.filter((v) => v.id !== vendaId); // Remove a venda da lista local
      } catch (err) {
        this.error = "Erro ao deletar venda";
      } finally {
        this.loading = false;
      }
    },
  },
});
