// clienteStore.js
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

    async updateCliente(clienteId, clienteAtualizado) {
      this.loading = true;
      this.error = null;
      try {
        const cliente = await clienteService.updateCliente(
          Number(clienteId),
          clienteAtualizado
        ); 
        const index = this.clientes.findIndex((c) => Number(c.id) === Number(clienteId));
        if (index !== -1) {
          this.clientes.splice(index, 1, cliente);
        }
      } catch (err) {
        this.error = "Erro ao atualizar cliente";
      } finally {
        this.loading = false;
      }
    },

    async deleteCliente(clienteId) {
      this.loading = true;
      this.error = null;
      try {
        await clienteService.deleteCliente(Number(clienteId));
        this.clientes = this.clientes.filter((c) => Number(c.id) !== Number(clienteId));
      } catch (err) {
        this.error = "Erro ao deletar cliente";
      } finally {
        this.loading = false;
      }
    },
  },
});
