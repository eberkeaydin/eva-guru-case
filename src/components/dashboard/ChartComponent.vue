<!-- <script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import Highcharts from 'highcharts';
import { useAuthStore } from '../../stores/auth';
import apiClient from '@/api/axios';

const props = defineProps<{ days: number }>();
const emit = defineEmits(["column-clicked"]);
const authStore = useAuthStore();
const chartContainer = ref(null);
const chartOptions = ref({});

Highcharts.setOptions({
  lang: {
    decimalPoint: '.',
    thousandsSep: ','
  },
});

// API'den verileri çekme
const fetchChartData = async () => {
  try {
    const response = await apiClient.post(
      "/data/daily-sales-overview",
      {
        customDateData: null,
        day: props.days,
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

    const data = response.data.Data.item;
    console.log("Chart Data: ", data);

    chartOptions.value = {
      chart: {
        type: "column"
      },
      title: { text: "Daily Sales Overview" },
      xAxis: { categories: data.map((item: any) => item.date) },
      yAxis: { title: { text: "Sales Data" } },
      tooltip: {
        shared: true,
        formatter() {
          const index = this.points[0].point.index;
          return `
            <b>Date:</b> ${this.x}<br>
            <b>Total Sales:</b> ${(data[index].fbaAmount + data[index].fbmAmount).toFixed(2)}<br>
            <b>Shipping:</b> ${data[index].fbaShippingAmount.toFixed(2)}<br>
            <b>Profit:</b> ${data[index].profit.toFixed(2)}<br>
            <b>FBA Sales:</b> ${data[index].fbaAmount.toFixed(2)}<br>
            <b>FBM Sales:</b> ${data[index].fbmAmount.toFixed(2)}
          `;
        }
      },
      series: [
        {
          name: "FBA Sales",
          data: data.map((item: any) => item.fbaAmount),
          stack: "sales"
        },
        {
          name: "FBM Sales",
          data: data.map((item: any) => item.fbmAmount),
          stack: "sales"
        },
        {
          name: "Profit",
          data: data.map((item: any) => item.profit),
          stack: "profit"
        }
      ],
      plotOptions: {
        column: {
          stacking: "normal",
          cursor: "pointer",
          point: {
            events: {
              click: function () {
                const clickedDate = data[this.index]?.date;
                emit("column-clicked", clickedDate);
              }
            }
          }
        }
      }
    };

    Highcharts.chart(chartContainer.value, chartOptions.value);
  } catch (error) {
    console.error("Error fetching chart data:", error);
  }
};

watch(() => props.days, fetchChartData);
onMounted(fetchChartData);
</script>

<template>
  <div ref="chartContainer" class="w-full h-96 m-auto"></div>
</template> -->

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import Highcharts from 'highcharts';
import { useAuthStore } from '../../stores/auth';
import apiClient from '@/api/axios';

const props = defineProps<{ days: number }>();
const emit = defineEmits(["column-clicked"]);
const authStore = useAuthStore();
const chartContainer = ref(null);
const chartOptions = ref({});
const selectedColumns = ref<number[]>([]); // Seçili sütunların indekslerini saklamak için

Highcharts.setOptions({
  lang: {
    decimalPoint: '.',
    thousandsSep: ','
  },
});

// API'den verileri çekme
const fetchChartData = async () => {
  try {
    const response = await apiClient.post(
      "/data/daily-sales-overview",
      {
        customDateData: null,
        day: props.days,
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

    const data = response.data.Data.item;
    console.log("Chart Data: ", data);

    chartOptions.value = {
      chart: {
        type: "column"
      },
      title: { text: "Daily Sales Overview" },
      xAxis: { categories: data.map((item: any) => item.date) },
      yAxis: { title: { text: "Sales Data" } },
      tooltip: {
        shared: true,
        formatter() {
          const index = this.points[0].point.index;
          return `
            <b>Date:</b> ${this.x}<br>
            <b>Total Sales:</b> ${(data[index].fbaAmount + data[index].fbmAmount).toFixed(2)}<br>
            <b>Shipping:</b> ${data[index].fbaShippingAmount.toFixed(2)}<br>
            <b>Profit:</b> ${data[index].profit.toFixed(2)}<br>
            <b>FBA Sales:</b> ${data[index].fbaAmount.toFixed(2)}<br>
            <b>FBM Sales:</b> ${data[index].fbmAmount.toFixed(2)}
          `;
        }
      },
      series: [
        {
          name: "FBA Sales",
          data: data.map((item: any) => item.fbaAmount),
          stack: "sales"
        },
        {
          name: "FBM Sales",
          data: data.map((item: any) => item.fbmAmount),
          stack: "sales"
        },
        {
          name: "Profit",
          data: data.map((item: any) => item.profit),
          stack: "profit"
        }
      ],
      plotOptions: {
        column: {
          stacking: "normal",
          cursor: "pointer",
          states: {
            select: {
              color: "#FF5733", // Seçildiğinde farklı renk göster
              borderColor: "#C70039",
              borderWidth: 3
            }
          },
          point: {
            events: {
              click: function () {
                const clickedIndex = this.index;

                // Eğer zaten seçiliyse kaldır, değilse ekle
                if (selectedColumns.value.includes(clickedIndex)) {
                  selectedColumns.value = selectedColumns.value.filter(i => i !== clickedIndex);
                } else {
                  // En fazla 2 sütun karşılaştırılabiliyor.
                  if (selectedColumns.value.length >= 2) {
                    selectedColumns.value.shift(); // İlk seçileni kaldır
                  }
                  selectedColumns.value.push(clickedIndex);
                }

                // Seçili sütunları vurgulamak için Highcharts'ı güncelle
                const chart = this.series.chart;
                chart.series.forEach(series => {
                  series.data.forEach(point => {
                    if (selectedColumns.value.includes(point.index)) {
                      point.select(true, false);
                    } else {
                      point.select(false, false);
                    }
                  });
                });

                const clickedDate = data[clickedIndex]?.date;
                emit("column-clicked", clickedDate);
              }
            }
          }
        }
      }
    };

    Highcharts.chart(chartContainer.value, chartOptions.value);
  } catch (error) {
    console.error("Error fetching chart data:", error);
  }
};

watch(() => props.days, fetchChartData);
onMounted(fetchChartData);
</script>

<template>
  <div ref="chartContainer" class="w-full h-96 m-auto"></div>
</template>
