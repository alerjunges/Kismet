import { api } from 'src/boot/axios';

export const getDashboardData = async (mesSelecionado) => {
  try {
    const response = await api.get(`/dashboard?mes=${mesSelecionado}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao carregar dados do dashboard:", error);
    throw error;
  }
};