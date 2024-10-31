import { defineStore } from "pinia";
import compraService from "src/services/compraService"; // Alterado para serviço de compras

export const useCompraStore = defineStore("compraStore", {
  state: () => ({
    compras: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchComprasData() {
      this.loading = true;
      this.error = null;
      try {
        this.compras = await compraService.getComprasData();
      } catch (error) {
        this.error = "Erro ao carregar compras";
      } finally {
        this.loading = false;
      }
    },

    async addCompra(novaCompra) {
      this.loading = true;
      this.error = null;
      try {
        const compraAdicionada = await compraService.addCompra(novaCompra);
        this.compras.push(compraAdicionada); // Adiciona a compra à lista local
      } catch (error) {
        this.error = "Erro ao adicionar compra";
      } finally {
        this.loading = false;
      }
    },

    // Ação para atualizar uma compra existente
    async updateCompra(compraId, compraAtualizada) {
      this.loading = true;
      this.error = null;
      try {
        const compra = await compraService.updateCompra(compraId, compraAtualizada); // Atualiza compra via serviço
        const index = this.compras.findIndex((c) => c.id === compraId); // Encontra o índice da compra na lista
        if (index !== -1) {
          this.compras.splice(index, 1, compra); // Substitui a compra atualizada na lista local
        }
      } catch (err) {
        this.error = "Erro ao atualizar compra";
      } finally {
        this.loading = false;
      }
    },

    // Ação para deletar uma compra
    async deleteCompra(compraId) {
      this.loading = true;
      this.error = null;
      try {
        await compraService.deleteCompra(compraId); // Deleta compra via serviço
        this.compras = this.compras.filter((c) => c.id !== compraId); // Remove a compra da lista local
      } catch (err) {
        this.error = "Erro ao deletar compra";
      } finally {
        this.loading = false;
      }
    },
  },
});
