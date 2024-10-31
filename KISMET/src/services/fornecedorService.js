import { api } from "src/boot/axios";

export default {
  // Função para obter os dados dos fornecedores
  async getFornecedoresData() {
    try {
      const response = await api.get("/fornecedores");
      return response.data; // Retorna a lista de fornecedores
    } catch (error) {
      console.error("Erro ao carregar dados de fornecedores:", error);
      throw error;
    }
  },

  // Função para adicionar um novo fornecedor com o próximo ID
  async addFornecedor(novoFornecedor) {
    try {
      // Buscar todos os fornecedores existentes
      const fornecedores = await this.getFornecedoresData();
      console.log(fornecedores);

      const maiorId = fornecedores.reduce(
        (max, fornecedor) => (+fornecedor.id > +max ? +fornecedor.id : +max),
        0
      );

      novoFornecedor.id = maiorId + 1;

      const response = await api.post("/fornecedores", novoFornecedor);
      console.log("Fornecedor adicionado com sucesso:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar fornecedor:", error);
      throw error;
    }
  },

  // Função para atualizar um fornecedor
  async updateFornecedor(fornecedorId, fornecedorAtualizado) {
    try {
      const response = await api.put(
        `/fornecedores/${fornecedorId}`,
        fornecedorAtualizado
      );
      console.log("Fornecedor atualizado com sucesso:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error.message || error);
      throw error;
    }
  },

  // Função para deletar um fornecedor
  async deleteFornecedor(fornecedorId) {
    try {
      await api.delete(`/fornecedores/${fornecedorId}`);
      console.log(`Fornecedor ${fornecedorId} deletado com sucesso`);
    } catch (error) {
      console.error("Erro ao deletar fornecedor:", error.message || error);
      throw error;
    }
  },
};