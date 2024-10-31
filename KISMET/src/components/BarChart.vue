<template>
    <canvas ref="barChart"></canvas>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import { Chart, registerables } from 'chart.js';
  
  Chart.register(...registerables);
  
  const barChart = ref(null);
  
  onMounted(() => {
    const ctx = barChart.value.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Entrada', 'Saída'],
        datasets: [{
          label: 'Transações do Dia',
          data: [120, 0], // Exemplo de dados
          backgroundColor: ['#36A2EB', '#FF6384']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  });
  </script>
  
  <style scoped>
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
  </style>
  