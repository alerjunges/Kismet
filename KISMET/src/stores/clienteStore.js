import { defineStore } from "pinia";
import clienteService from "src/services/clienteService";

export const useClienteStore = defineStore("clienteStore", {
  state: () => ({
    clientes: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchClientesData() {
      this.loading = true;
      this.error = null;
      try {
        this.clientes = await clienteService.getClientesData();
      } catch (error) {
        this.error = "Erro ao carregar clientes";
      } finally {
        this.loading = false;
      }
    },

    async addCliente(novoCliente) {
      this.loading = true;
      this.error = null;
      try {
        const clienteAdicionado = await clienteService.addCliente(novoCliente);
        this.clientes.push(clienteAdicionado);
      } catch (error) {
        this.error = "Erro ao adicionar cliente";
      } finally {
        this.loading = false;
      }
    },

    // Ação para atualizar um cliente
    async updateCliente(clienteId, clienteAtualizado) {
      this.loading = true;
      this.error = null;
      try {
        const cliente = await clienteService.updateCliente(
          clienteId,
          clienteAtualizado
        ); // Atualiza cliente via serviço
        const index = this.clientes.findIndex((c) => c.id === clienteId); // Encontra o índice do cliente na lista
        if (index !== -1) {
          this.clientes.splice(index, 1, cliente); // Substitui o cliente atualizado na lista local
        }
      } catch (err) {
        this.error = "Erro ao atualizar cliente";
      } finally {
        this.loading = false;
      }
    },

    // Ação para deletar um cliente
    async deleteCliente(clienteId) {
      this.loading = true;
      this.error = null;
      try {
        await clienteService.deleteCliente(clienteId); // Deleta cliente via serviço
        this.clientes = this.clientes.filter((c) => c.id !== clienteId); // Remove o cliente da lista local
      } catch (err) {
        this.error = "Erro ao deletar cliente";
      } finally {
        this.loading = false;
      }
    },
  },
});
