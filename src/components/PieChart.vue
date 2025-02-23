<template>
    <Pie :data="chartData" :options="chartOptions" />
  </template>
  
  <script>
  import { defineComponent } from "vue";
  import { Pie } from "vue-chartjs";
  import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
  
  ChartJS.register(ArcElement, Tooltip, Legend);
  
  export default defineComponent({
    components: { Pie },
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
  