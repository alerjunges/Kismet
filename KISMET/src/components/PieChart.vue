<template>
  <div>
    <canvas ref="pieChart"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(PieController, ArcElement, Tooltip, Legend);

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({ labels: [], datasets: [] })
  }
});

const pieChart = ref(null);
let chartInstance = null;

function renderChart() {
  if (chartInstance) {
    chartInstance.destroy();
  }

  const { labels, datasets } = props.data;

  // Verifique se labels e datasets são válidos antes de renderizar
  if (Array.isArray(labels) && Array.isArray(datasets) && datasets.length > 0) {
    const ctx = pieChart.value.getContext('2d');
    chartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}%`
            }
          }
        }
      }
    });
  } else {
    console.error("Dados inválidos para o gráfico de pizza:", props.data);
  }
}

onMounted(renderChart);

// Atualiza o gráfico se os dados mudarem
watch(() => props.data, renderChart);
</script>

<style scoped>
canvas {
  max-width: 100%;
  height: auto;
}
</style>
