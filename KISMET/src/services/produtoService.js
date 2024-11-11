import { api } from "src/boot/axios";

export default {

  async getProdutosData() {
    try {
      const response = await api.get("/produtos");
      return response.data; 
    } catch (error) {
      console.error("Erro ao carregar dados de produtos:", error);
      throw error;
    }
  },

  async addProduto(novoProduto) {
    try {
      const produtos = await this.getProdutosData();
      console.log(produtos);

      const maiorId = produtos.reduce(
        (max, produto) => (+produto.id > +max ? +produto.id : +max),
        0
      );

      novoProduto.id = maiorId + 1;

      const response = await api.post("/produtos", novoProduto);
      console.log("Produto adicionado com sucesso:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      throw error;
    }
  },

  async updateProduto(produtoId, produtoAtualizado) {
    try {
      const response = await api.put(
        `/produtos/${produtoId}`,
        produtoAtualizado
      );
      console.log("Produto atualizado com sucesso:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar produto:", error.message || error);
      throw error;
    }
  },

  async deleteProduto(produtoId) {
    try {
      await api.delete(`/produtos/${produtoId}`);
      console.log(`Produto ${produtoId} deletado com sucesso`);
    } catch (error) {
      console.error("Erro ao deletar produto:", error.message || error);
      throw error;
    }
  },
};
