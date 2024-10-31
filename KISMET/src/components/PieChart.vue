<template>
    <div>
      <canvas id="myPieChart"></canvas>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
  
  // Registre os componentes que você está usando
  Chart.register(PieController, ArcElement, Tooltip, Legend);
  
  onMounted(() => {
    const ctx = document.getElementById('myPieChart').getContext('2d');
  
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Roupas', 'Antiguidades', 'Discos', 'Livros'],
      datasets: [{
        data: [50, 10, 30, 10],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        }]
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
  });
  </script>
  
  <style scoped>
  canvas {
    max-width: 100%;
    height: auto;
  }
  </style>
  