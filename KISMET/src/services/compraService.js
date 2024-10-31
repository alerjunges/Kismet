import { api } from "src/boot/axios";

export default {
  // Função para obter os dados das compras
  async getComprasData() {
    try {
      const response = await api.get("/compras");
      return response.data; // Retorna a lista de compras
    } catch (error) {
      console.error("Erro ao carregar dados de compras:", error);
      throw error;
    }
  },

  // Função para adicionar uma nova compra com o próximo ID
  async addCompra(novaCompra) {
    try {
      // buscar todas as compras existentes
      const compras = await this.getComprasData();
      console.log(compras);

      const maiorId = compras.reduce(
        (max, compra) => (+compra.id > +max ? +compra.id : +max),
        0
      );

      novaCompra.id = maiorId + 1;

      const response = await api.post("/compras", novaCompra);
      console.log("Compra adicionada com sucesso:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar compra:", error);
      throw error;
    }
  },

  // Função para atualizar uma compra
  async updateCompra(compraId, compraAtualizada) {
    try {
      const response = await api.put(
        `/compras/${compraId}`,
        compraAtualizada
      );
      console.log("Compra atualizada com sucesso:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar compra:", error.message || error);
      throw error;
    }
  },

  // Função para deletar uma compra
  async deleteCompra(compraId) {
    try {
      await api.delete(`/compras/${compraId}`);
      console.log(`Compra ${compraId} deletada com sucesso`);
    } catch (error) {
      console.error("Erro ao deletar compra:", error.message || error);
      throw error;
    }
  },
};
