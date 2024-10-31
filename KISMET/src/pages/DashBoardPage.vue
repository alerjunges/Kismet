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
        <!-- Cabeçalho -->
        <q-card-section class="header-card">
          <q-icon name="trending_up" class="q-mr-sm" /> Entrada (R$)
        </q-card-section>
        <q-card-section class="content-card">
          <div class="text-h5">{{ formatarMoeda(valoresEntrada) }}</div>
        </q-card-section>
      </q-card>

      <q-card class="q-pa-md stat-card saida-card">
        <!-- Cabeçalho -->
        <q-card-section class="header-card">
          <q-icon name="trending_down" class="q-mr-sm" /> Saída (R$)
        </q-card-section>
        <q-card-section class="content-card">
          <div class="text-h5">{{ formatarMoeda(valoresSaida) }}</div>
        </q-card-section>
      </q-card>

      <q-card class="q-pa-md stat-card saldo-card">
        <!-- Cabeçalho -->
        <q-card-section class="header-card">
          <q-icon name="account_balance" class="q-mr-sm" /> Saldo (R$)
        </q-card-section>
        <q-card-section class="content-card">
          <div class="text-h5">{{ formatarMoeda(valoresSaldo) }}</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Gráficos -->
    <div class="row q-col-gutter-xl">
      <!-- Gráfico de pizza -->
      <q-card class="q-pa-md chart-card venda-categoria-card">
        <q-card-section class="header-card">
          Venda por categoria
        </q-card-section>
        <q-card-section class="content-card">
          <div class="chart-container">
            <PieChart />
          </div>
        </q-card-section>
      </q-card>

      <!-- Gráfico de barras -->
      <q-card class="q-pa-md chart-card transacoes-dia-card">
        <q-card-section class="header-card">
          Transações do dia
        </q-card-section>
        <q-card-section class="content-card">
          <div class="chart-container">
            <BarChart />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import PieChart from 'src/components/PieChart.vue';
import BarChart from 'src/components/BarChart.vue';

// Dados dos meses e valores
const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const mesSelecionado = ref('Novembro');

// Valores estáticos
const valoresEntrada = 3457;
const valoresSaida = 1791;
const valoresSaldo = 1666;

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
