import { api } from "src/boot/axios";

export default {
  // Função para obter os dados das vendas
  async getVendasData() {
    try {
      const response = await api.get("/vendas");
      return response.data; // Retorna a lista de vendas
    } catch (error) {
      console.error("Erro ao carregar dados de vendas:", error);
      throw error;
    }
  },

  // Função para adicionar uma nova venda com o próximo ID
  async addVenda(novaVenda) {
    try {
      // Buscar todas as vendas existentes
      const vendas = await this.getVendasData();
      console.log(vendas);

      const maiorId = vendas.reduce(
        (max, venda) => (+venda.id > +max ? +venda.id : +max),
        0
      );

      novaVenda.id = maiorId + 1;

      const response = await api.post("/vendas", novaVenda);
      console.log("Venda adicionada com sucesso:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar venda:", error);
      throw error;
    }
  },

  // Função para atualizar uma venda
  async updateVenda(vendaId, vendaAtualizada) {
    try {
      const response = await api.put(`/vendas/${vendaId}`, vendaAtualizada);
      console.log("Venda atualizada com sucesso:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar venda:", error.message || error);
      throw error;
    }
  },

  // Função para deletar uma venda
  async deleteVenda(vendaId) {
    try {
      await api.delete(`/vendas/${vendaId}`);
      console.log(`Venda ${vendaId} deletada com sucesso`);
    } catch (error) {
      console.error("Erro ao deletar venda:", error.message || error);
      throw error;
    }
  },
};
