import { api } from "src/boot/axios";

export default {

  async getVendasData() {
    try {
      const response = await api.get("/vendas");
      return response.data; 
    } catch (error) {
      console.error("Erro ao carregar dados de vendas:", error);
      throw error;
    }
  },

  async addVenda(novaVenda) {
    try {
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
