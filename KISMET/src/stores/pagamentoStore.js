import { defineStore } from "pinia";
import pagamentoService from "src/services/pagamentoService";

export const usePagamentoStore = defineStore("pagamentoStore", {
  state: () => ({
    pagamentos: [],
    loading: false,
    error: null,
  }),

  actions: {
    // Ação para buscar os dados dos pagamentos
    async fetchPagamentosData() {
      this.loading = true;
      this.error = null;
      try {
        this.pagamentos = await pagamentoService.getPagamentosData();
      } catch (error) {
        this.error = "Erro ao carregar pagamentos";
      } finally {
        this.loading = false;
      }
    },

    // Ação para adicionar um novo pagamento
    async addPagamento(novoPagamento) {
      this.loading = true;
      this.error = null;
      try {
        const pagamentoAdicionado = await pagamentoService.addPagamento(novoPagamento);
        this.pagamentos.push(pagamentoAdicionado); // Adiciona o pagamento à lista local
      } catch (error) {
        this.error = "Erro ao adicionar pagamento";
      } finally {
        this.loading = false;
      }
    },

    // Ação para atualizar um pagamento existente
    async updatePagamento(pagamentoId, pagamentoAtualizado) {
      this.loading = true;
      this.error = null;
      try {
        const pagamento = await pagamentoService.updatePagamento(pagamentoId, pagamentoAtualizado); // Atualiza pagamento via serviço
        const index = this.pagamentos.findIndex((p) => p.id === pagamentoId); // Encontra o índice do pagamento na lista
        if (index !== -1) {
          this.pagamentos.splice(index, 1, pagamento); // Substitui o pagamento atualizado na lista local
        }
      } catch (err) {
        this.error = "Erro ao atualizar pagamento";
      } finally {
        this.loading = false;
      }
    },

    // Ação para deletar um pagamento
    async deletePagamento(pagamentoId) {
      this.loading = true;
      this.error = null;
      try {
        await pagamentoService.deletePagamento(pagamentoId); // Deleta pagamento via serviço
        this.pagamentos = this.pagamentos.filter((p) => p.id !== pagamentoId); // Remove o pagamento da lista local
      } catch (err) {
        this.error = "Erro ao deletar pagamento";
      } finally {
        this.loading = false;
      }
    },
  },
});
