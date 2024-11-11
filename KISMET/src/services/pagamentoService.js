import { api } from "src/boot/axios";

export default {
  async getPagamentosData() {
    try {
      const response = await api.get("/pagamentos");
      return response.data; 
    } catch (error) {
      console.error("Erro ao carregar dados de pagamentos:", error);
      throw error;
    }
  },

  async addPagamento(novoPagamento) {
    try {
      const pagamentos = await this.getPagamentosData();
      console.log(pagamentos);

      const maiorId = pagamentos.reduce(
        (max, pagamento) => (+pagamento.id > +max ? +pagamento.id : +max),
        0
      );

      novoPagamento.id = maiorId + 1;

      const response = await api.post("/pagamentos", novoPagamento);
      console.log("Pagamento adicionado com sucesso:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar pagamento:", error);
      throw error;
    }
  },

  async updatePagamento(pagamentoId, pagamentoAtualizado) {
    try {
      const response = await api.put(
        `/pagamentos/${pagamentoId}`,
        pagamentoAtualizado
      );
      console.log("Pagamento atualizado com sucesso:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar pagamento:", error.message || error);
      throw error;
    }
  },

  async deletePagamento(pagamentoId) {
    try {
      await api.delete(`/pagamentos/${pagamentoId}`);
      console.log(`Pagamento ${pagamentoId} deletado com sucesso`);
    } catch (error) {
      console.error("Erro ao deletar pagamento:", error.message || error);
      throw error;
    }
  },
};
