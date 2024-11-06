<template>
  <canvas ref="barChart"></canvas>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue';
import { Chart, registerables, LinearScale } from 'chart.js';

// Registrando explicitamente a escala linear
Chart.register(...registerables, LinearScale);

const props = defineProps(['data']);
const barChart = ref(null);
let chartInstance = null;

function renderChart() {
  if (chartInstance) {
    chartInstance.destroy(); // Destrói o gráfico existente antes de criar um novo
  }

  const ctx = barChart.value.getContext('2d');
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Vendas do Dia', 'Compras do Dia'],
      datasets: [{
        label: 'Transações do Dia',
        data: props.data,
        backgroundColor: ['#36A2EB', '#FF6384']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          type: 'linear', // Define explicitamente o tipo de escala
          beginAtZero: true
        }
      }
    }
  });
}

onMounted(renderChart);

// Observa mudanças nos dados e atualiza o gráfico
watch(() => props.data, renderChart);
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
