import { api } from "src/boot/axios";

export default {
  // Função para obter os dados dos clientes
  async getClientesData() {
    try {
      const response = await api.get("/clientes");
      return response.data; // Retorna a lista de clientes
    } catch (error) {
      console.error("Erro ao carregar dados de clientes:", error);
      throw error;
    }
  },

  // Função para adicionar um novo cliente com o próximo ID
  async addCliente(novoCliente) {
    try {
      // buscar todos os clientes existentes
      const clientes = await this.getClientesData();
      console.log(clientes);

      const maiorId = clientes.reduce(
        (max, cliente) => (+cliente.id > +max ? +cliente.id : +max),
        0
      );

      novoCliente.id = maiorId + 1;

      const response = await api.post("/clientes", novoCliente);
      console.log("Cliente adicionado com sucesso:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      throw error;
    }
  },

  // Função para atualizar um cliente
  async updateCliente(clienteId, clienteAtualizado) {
    try {
      const response = await api.put(
        `/clientes/${clienteId}`,
        clienteAtualizado
      );
      console.log("Cliente atualizado com sucesso:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error.message || error);
      throw error;
    }
  },

  // Função para deletar um cliente
  async deleteCliente(clienteId) {
    try {
      await api.delete(`/clientes/${clienteId}`);
      console.log(`Cliente ${clienteId} deletado com sucesso`);
    } catch (error) {
      console.error("Erro ao deletar cliente:", error.message || error);
      throw error;
    }
  },
};
