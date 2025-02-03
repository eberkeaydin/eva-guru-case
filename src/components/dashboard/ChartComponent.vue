<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import Highcharts from "highcharts";
import { useAuthStore } from "../../stores/auth";
import apiClient from "@/api/axios";

const props = defineProps<{ days: number }>(); // Prop tanımlandı
const authStore = useAuthStore();
const chartContainer = ref(null);
const chartOptions = ref({});

// API'den verileri çekme
const fetchChartData = async () => {
  try {
    const response = await apiClient.post(
      "/data/daily-sales-overview",
      {
        day: props.days, // Gün parametresi buradan geliyor
        excludeYoYData: true,
        marketplace: authStore.user?.marketplaceName,
        requestStatus: 0,
        sellerId: authStore.user?.storeId,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    const data = response.data.Data;
    chartOptions.value = {
      chart: { type: "column" },
      title: { text: "Daily Sales Overview" },
      xAxis: { categories: data.dates },
      yAxis: { title: { text: "Values" } },
      tooltip: {
        formatter() {
          const index = this.point.index;
          const totalSales = data.fbaAmount[index] + data.fbmAmount[index];
          return `
            <b>Date:</b> ${this.category}<br>
            <b>Total Sales:</b> ${totalSales}<br>
            <b>Shipping:</b> ${data.fbaShippingAmount[index]}<br>
            <b>Profit:</b> ${data.profit[index]}<br>
            <b>FBA Sales:</b> ${data.fbaAmount[index]}<br>
            <b>FBM Sales:</b> ${data.fbmAmount[index]}
          `;
        },
      },
      series: [
        { name: "FBA Sales", data: data.fbaAmount },
        { name: "FBM Sales", data: data.fbmAmount },
        { name: "Profit", data: data.profit },
      ],
    };
    Highcharts.chart(chartContainer.value, chartOptions.value);
  } catch (error) {
    console.error("Error fetching chart data:", error);
  }
};

// Gün değiştiğinde grafiği yeniden yükle
watch(() => props.days, fetchChartData);

// Sayfa yüklendiğinde grafiği çiz
onMounted(fetchChartData);
</script>

<template>
  <div ref="chartContainer" class="w-full h-96 m-auto"></div>
</template>
