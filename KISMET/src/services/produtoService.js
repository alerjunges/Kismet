import { api } from "src/boot/axios";

export default {
  // Função para obter os dados dos produtos
  async getProdutosData() {
    try {
      const response = await api.get("/produtos");
      return response.data; // Retorna a lista de produtos
    } catch (error) {
      console.error("Erro ao carregar dados de produtos:", error);
      throw error;
    }
  },

  // Função para adicionar um novo produto com o próximo ID
  async addProduto(novoProduto) {
    try {
      // Buscar todos os produtos existentes
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

  // Função para atualizar um produto
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

  // Função para deletar um produto
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
