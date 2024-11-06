<template>
  <div class="q-pa-md dashboard-container">
    <!-- Seletor de Mês -->
    <div class="q-mb-md mes-selector">
      <q-select
        outlined
        v-model="mesSelecionado"
        :options="meses"
        label="Escolha o mês de análise"
        class="select-mes"
        filled
        clearable
        prepend-icon="event"
      />
    </div>

    <!-- Cartões de Estatísticas -->
    <div class="row q-col-gutter-xl q-mb-xl stat-card-container">
      <q-card class="q-pa-md stat-card entrada-card">
        <q-card-section class="header-card">
          <q-icon name="trending_up" class="q-mr-sm" /> Entrada (R$)
        </q-card-section>
        <q-card-section class="content-card">
          <div class="text-h5">{{ formatarMoeda(totalEntrada) }}</div>
        </q-card-section>
      </q-card>

      <q-card class="q-pa-md stat-card saida-card">
        <q-card-section class="header-card">
          <q-icon name="trending_down" class="q-mr-sm" /> Saída (R$)
        </q-card-section>
        <q-card-section class="content-card">
          <div class="text-h5">{{ formatarMoeda(totalSaida) }}</div>
        </q-card-section>
      </q-card>

      <q-card class="q-pa-md stat-card saldo-card">
        <q-card-section class="header-card">
          <q-icon name="account_balance" class="q-mr-sm" /> Saldo (R$)
        </q-card-section>
        <q-card-section class="content-card">
          <div class="text-h5">{{ formatarMoeda(saldo) }}</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Gráficos -->
    <div class="row q-col-gutter-xl">
      <!-- Gráfico de pizza de vendas por categoria -->
      <q-card class="q-pa-md chart-card venda-categoria-card">
        <q-card-section class="header-card">
          Venda por categoria
        </q-card-section>
        <q-card-section class="content-card">
          <div class="chart-container">
            <PieChart :data="vendasPorCategoria" />
          </div>
        </q-card-section>
      </q-card>

      <!-- Gráfico de barras de transações do dia -->
      <q-card class="q-pa-md chart-card transacoes-dia-card">
        <q-card-section class="header-card">
          Transações do dia
        </q-card-section>
        <q-card-section class="content-card">
          <BarChart :data="transacoesDiarias" />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useVendaStore } from 'src/stores/vendaStore';
import { useCompraStore } from 'src/stores/compraStore';
import PieChart from 'src/components/PieChart.vue';
import BarChart from 'src/components/BarChart.vue';

// Stores
const vendaStore = useVendaStore();
const compraStore = useCompraStore();

// Dados de entrada para o seletor de mês
const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const mesSelecionado = ref('Novembro'); // Seleciona o mês de análise

// Fetch inicial dos dados
onMounted(() => {
  vendaStore.fetchVendasData();
  compraStore.fetchComprasData();
});

// Computed para filtrar as vendas e compras de acordo com o mês selecionado
const vendasFiltradas = computed(() => {
  const mesIndex = meses.indexOf(mesSelecionado.value) + 1; // Obtém o número do mês
  return vendaStore.vendas.filter(venda => new Date(venda.data_venda).getMonth() + 1 === mesIndex);
});

const comprasFiltradas = computed(() => {
  const mesIndex = meses.indexOf(mesSelecionado.value) + 1; // Obtém o número do mês
  return compraStore.compras.filter(compra => new Date(compra.data_compra).getMonth() + 1 === mesIndex);
});

// Computed para total de entrada (vendas), saída (compras) e saldo para o mês selecionado
const totalEntrada = computed(() => vendasFiltradas.value.reduce((total, venda) => total + parseFloat(venda.valor_total || 0), 0));
const totalSaida = computed(() => comprasFiltradas.value.reduce((total, compra) => total + parseFloat(compra.valor_total || 0), 0));
const saldo = computed(() => totalEntrada.value - totalSaida.value);

// Atualiza os dados ao selecionar um novo mês
function atualizarDadosPorMes() {
  vendaStore.fetchVendasData();
  compraStore.fetchComprasData();
}

// Dados para o gráfico de pizza de vendas por categoria
const vendasPorCategoria = computed(() => {
  const categorias = {};
  vendasFiltradas.value.forEach(venda => {
    venda.produtos?.forEach(produto => {
      if (!categorias[produto.nome]) {
        categorias[produto.nome] = 0;
      }
      categorias[produto.nome] += produto.subtotal;
    });
  });
  return {
    labels: Object.keys(categorias),
    datasets: [{
      data: Object.values(categorias),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
    }]
  };
});

// Função para verificar se uma data é hoje
function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}

// Computed para calcular transações diárias
const transacoesDiarias = computed(() => {
  const totalVendasDia = vendasFiltradas.value
    .filter(venda => isToday(new Date(venda.data_venda)))
    .reduce((total, venda) => total + parseFloat(venda.valor_total), 0);

  const totalComprasDia = comprasFiltradas.value
    .filter(compra => isToday(new Date(compra.data_compra)))
    .reduce((total, compra) => total + parseFloat(compra.valor_total), 0);

  return [totalVendasDia, totalComprasDia];
});

// Função de formatação de moeda
function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}
</script>

<style scoped>

.dashboard-container {
  padding: 20px;
  background-color: #ffffff;
}

/* Seletor de mês */
.mes-selector {
  text-align: center;
  margin-bottom: 20px;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 30px;
}

.stat-card {
  border: none;
  background-color: #ffffff; 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: transform 0.3s ease-in-out;
}
.stat-card:hover {
  transform: translateY(-5px);
}

.header-card {
  background-color: #03442C;
  color: white;
  font-weight: bold;
  padding: 10px;
  display: flex;
  align-items: center;
}

.content-card {
  padding: 10px 0;
  text-align: center;
  color: #000;
  font-size: 20px;
}

.entrada-card {
  flex: 1;
  height: 130px;
  margin-left: 40px; 
}

.saida-card {
  flex: 1;
  height: 130px;
}

.saldo-card {
  flex: 1;
  height: 130px;
}

.chart-card {
  border: none;
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: transform 0.3s ease-in-out;
}
.chart-card:hover {
  transform: translateY(-5px);
}

.venda-categoria-card {
  flex: 1;
  height: 400px;
  margin-left: 40px; 
}

.transacoes-dia-card {
  flex: 1;
  height: 400px;
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.custom-button {
  background-color: #03442C;
  color: white;
  border-radius: 20px;
  padding: 12px;
  transition: background-color 0.3s ease-in-out;
}
.custom-button:hover {
  background-color: #026636;
}

.result-count {
  margin-left: auto;
  font-size: 16px;
  font-weight: bold;
  color: #03442C;
}

.q-col-gutter-xl {
  margin-bottom: 30px;
}
</style>