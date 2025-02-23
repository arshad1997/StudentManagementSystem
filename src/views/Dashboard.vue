<template>
  <Navbar />
  <div>
    <h2>Dashboard Overview</h2>

    <div class="chart-container">
      <BarChart :chart-data="revenueData" />
    </div>

    <div class="chart-container">
      <PieChart :chart-data="pendingFeesData" />
    </div>

    <div class="chart-container">
      <LineChart :chart-data="paymentTrendsData" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import BarChart from "@/components/BarChart.vue";
import PieChart from "@/components/PieChart.vue";
import LineChart from "@/components/LineChart.vue";
import Navbar from "../components/Navbar.vue";

export default {
  components: { BarChart, PieChart, LineChart, Navbar },
  data() {
    return {
      revenueData: { labels: [], datasets: [] },
      pendingFeesData: { labels: [], datasets: [] },
      paymentTrendsData: { labels: [], datasets: [] },
    };
  },
  mounted() {
    this.$axios
      .get("/dashboard")
      .then((res) => {
        this.revenueData = {
          labels: ["Total Revenue", "Pending Fees"],
          datasets: [
            {
              label: "Financial Overview",
              data: [res.data.total_revenue, res.data.pending_fees],
              backgroundColor: ["#4CAF50", "#FF5733"],
            },
          ],
        };

        this.pendingFeesData = {
          labels: ["Collected Fees", "Pending Fees"],
          datasets: [
            {
              data: [res.data.total_revenue, res.data.pending_fees],
              backgroundColor: ["#28a745", "#dc3545"],
            },
          ],
        };

        this.paymentTrendsData = {
          labels: res.data.monthly_payments.map((p) => `Month ${p.month}`),
          datasets: [
            {
              label: "Monthly Payments",
              data: res.data.monthly_payments.map((p) => p.total),
              borderColor: "#2196F3",
              fill: false,
            },
          ],
        };
      })
      .catch((err) => console.error(err));
  },
};
</script>

<style>
.chart-container {
  width: 80%;
  margin: auto;
}
</style>
