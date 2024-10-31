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
        this.produtos.push(produtoAdicionado); // Adiciona o produto à lista local
      } catch (error) {
        this.error = "Erro ao adicionar produto";
      } finally {
        this.loading = false;
      }
    },

    // Ação para atualizar um produto existente
    async updateProduto(produtoId, produtoAtualizado) {
      this.loading = true;
      this.error = null;
      try {
        const produto = await produtoService.updateProduto(produtoId, produtoAtualizado); // Atualiza produto via serviço
        const index = this.produtos.findIndex((p) => p.id === produtoId); // Encontra o índice do produto na lista
        if (index !== -1) {
          this.produtos.splice(index, 1, produto); // Substitui o produto atualizado na lista local
        }
      } catch (err) {
        this.error = "Erro ao atualizar produto";
      } finally {
        this.loading = false;
      }
    },

    // Ação para deletar um produto
    async deleteProduto(produtoId) {
      this.loading = true;
      this.error = null;
      try {
        await produtoService.deleteProduto(produtoId); // Deleta produto via serviço
        this.produtos = this.produtos.filter((p) => p.id !== produtoId); // Remove o produto da lista local
      } catch (err) {
        this.error = "Erro ao deletar produto";
      } finally {
        this.loading = false;
      }
    },
  },
});
