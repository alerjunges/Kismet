import { api } from "src/boot/axios";

export default {
  // Função para obter os dados dos pagamentos
  async getPagamentosData() {
    try {
      const response = await api.get("/pagamentos");
      return response.data; // Retorna a lista de pagamentos
    } catch (error) {
      console.error("Erro ao carregar dados de pagamentos:", error);
      throw error;
    }
  },

  // Função para adicionar um novo pagamento com o próximo ID
  async addPagamento(novoPagamento) {
    try {
      // Buscar todos os pagamentos existentes
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

  // Função para atualizar um pagamento
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

  // Função para deletar um pagamento
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
