import { defineStore } from "pinia";
import pagamentoService from "src/services/pagamentoService";

export const usePagamentoStore = defineStore("pagamentoStore", {
  state: () => ({
    pagamentos: [],
    loading: false,
    error: null,
  }),

  actions: {
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

    async addPagamento(novoPagamento) {
      this.loading = true;
      this.error = null;
      try {
        const pagamentoAdicionado = await pagamentoService.addPagamento(novoPagamento);
        this.pagamentos.push(pagamentoAdicionado);
      } catch (error) {
        this.error = "Erro ao adicionar pagamento";
      } finally {
        this.loading = false;
      }
    },

    async updatePagamento(pagamentoId, pagamentoAtualizado) {
      this.loading = true;
      this.error = null;
      try {
        const pagamento = await pagamentoService.updatePagamento(pagamentoId, pagamentoAtualizado); 
        const index = this.pagamentos.findIndex((p) => p.id === pagamentoId); 
        if (index !== -1) {
          this.pagamentos.splice(index, 1, pagamento); 
        }
      } catch (err) {
        this.error = "Erro ao atualizar pagamento";
      } finally {
        this.loading = false;
      }
    },

    async deletePagamento(pagamentoId) {
      this.loading = true;
      this.error = null;
      try {
        await pagamentoService.deletePagamento(pagamentoId); 
        this.pagamentos = this.pagamentos.filter((p) => p.id !== pagamentoId); 
      } catch (err) {
        this.error = "Erro ao deletar pagamento";
      } finally {
        this.loading = false;
      }
    },
  },
});
