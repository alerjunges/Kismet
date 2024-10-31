import { defineStore } from "pinia";
import fornecedorService from "src/services/fornecedorService";

export const useFornecedorStore = defineStore("fornecedorStore", {
  state: () => ({
    fornecedores: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchFornecedoresData() {
      this.loading = true;
      this.error = null;
      try {
        const data = await fornecedorService.getFornecedoresData();
        this.fornecedores = data;
      } catch (err) {
        this.error = "Erro ao carregar dados dos fornecedores";
      } finally {
        this.loading = false;
      }
    },

    async addFornecedor(novoFornecedor) {
      this.loading = true;
      this.error = null;
      try {
        const fornecedorAdicionado = await fornecedorService.addFornecedor(novoFornecedor);
        this.fornecedores.push(fornecedorAdicionado);
      } catch (err) {
        this.error = "Erro ao adicionar fornecedor";
      } finally {
        this.loading = false;
      }
    },

    async updateFornecedor(fornecedorId, fornecedorAtualizado) {
      this.loading = true;
      this.error = null;
      try {
        await fornecedorService.updateFornecedor(fornecedorId, fornecedorAtualizado);
        const index = this.fornecedores.findIndex((f) => f.id === fornecedorId);
        if (index !== -1) {
          this.fornecedores.splice(index, 1, fornecedorAtualizado);
        }
      } catch (err) {
        this.error = "Erro ao atualizar fornecedor";
      } finally {
        this.loading = false;
      }
    },

    async deleteFornecedor(fornecedorId) {
      this.loading = true;
      this.error = null;
      try {
        await fornecedorService.deleteFornecedor(fornecedorId);
        this.fornecedores = this.fornecedores.filter((f) => f.id !== fornecedorId);
      } catch (err) {
        this.error = "Erro ao deletar fornecedor";
      } finally {
        this.loading = false;
      }
    },
  },
});
