import { defineStore } from "pinia";
import produtoService from "src/services/produtoService";

export const useProdutoStore = defineStore("produtoStore", {
  state: () => ({
    produtos: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProdutosData() {
      this.loading = true;
      this.error = null;
      try {
        this.produtos = await produtoService.getProdutosData();
      } catch (error) {
        this.error = "Erro ao carregar produtos";
      } finally {
        this.loading = false;
      }
    },

    async addProduto(novoProduto) {
      this.loading = true;
      this.error = null;
      try {
        const produtoAdicionado = await produtoService.addProduto(novoProduto);
        this.produtos.push(produtoAdicionado); 
      } catch (error) {
        this.error = "Erro ao adicionar produto";
      } finally {
        this.loading = false;
      }
    },

    async updateProduto(produtoId, produtoAtualizado) {
      this.loading = true;
      this.error = null;
      try {
        const produto = await produtoService.updateProduto(produtoId, produtoAtualizado); 
        const index = this.produtos.findIndex((p) => p.id === produtoId); 
        if (index !== -1) {
          this.produtos.splice(index, 1, produto); 
        }
      } catch (err) {
        this.error = "Erro ao atualizar produto";
      } finally {
        this.loading = false;
      }
    },

    async deleteProduto(produtoId) {
      this.loading = true;
      this.error = null;
      try {
        await produtoService.deleteProduto(produtoId); 
        this.produtos = this.produtos.filter((p) => p.id !== produtoId); 
      } catch (err) {
        this.error = "Erro ao deletar produto";
      } finally {
        this.loading = false;
      }
    },
  },
});
