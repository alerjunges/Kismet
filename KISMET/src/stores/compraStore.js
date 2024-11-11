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
        this.compras.push(compraAdicionada); 
      } catch (error) {
        this.error = "Erro ao adicionar compra";
      } finally {
        this.loading = false;
      }
    },

    async updateCompra(compraId, compraAtualizada) {
      this.loading = true;
      this.error = null;
      try {
        const compra = await compraService.updateCompra(compraId, compraAtualizada); 
        const index = this.compras.findIndex((c) => c.id === compraId); 
        if (index !== -1) {
          this.compras.splice(index, 1, compra); 
        }
      } catch (err) {
        this.error = "Erro ao atualizar compra";
      } finally {
        this.loading = false;
      }
    },

    async deleteCompra(compraId) {
      this.loading = true;
      this.error = null;
      try {
        await compraService.deleteCompra(compraId); 
        this.compras = this.compras.filter((c) => c.id !== compraId); 
      } catch (err) {
        this.error = "Erro ao deletar compra";
      } finally {
        this.loading = false;
      }
    },
  },
});
