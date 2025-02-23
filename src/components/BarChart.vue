<template>
    <Bar :data="chartData" :options="chartOptions" />
  </template>
  
  <script>
  import { defineComponent } from "vue";
  import { Bar } from "vue-chartjs";
  import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
  
  ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
  
  export default defineComponent({
    components: { Bar },
    props: {
      chartData: Object
    },
    data() {
      return {
        chartOptions: { responsive: true, maintainAspectRatio: false }
      };
    }
  });
  </script>
  