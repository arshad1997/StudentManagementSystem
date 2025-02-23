<template>
    <Line :data="chartData" :options="chartOptions" />
  </template>
  
  <script>
  import { defineComponent } from "vue";
  import { Line } from "vue-chartjs";
  import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
  
  ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);
  
  export default defineComponent({
    components: { Line },
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
  