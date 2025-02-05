<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import Highcharts from 'highcharts';
import { useAuthStore } from '../../stores/auth';
import apiClient from '@/api/axios';

const props = defineProps<{ days: number }>();
const emit = defineEmits(["column-clicked"]);
const authStore = useAuthStore();
const chartContainer = ref(null);
const chart = ref(null);
const selectedColumns = ref<number[]>([]);

Highcharts.setOptions({
  lang: {
    decimalPoint: '.',
    thousandsSep: ','
  },
});

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

    const options = {
      chart: {
        type: "column",
        events: {
          load() {
            chart.value = this; // Highcharts instance
          }
        }
      },
      title: { text: "Daily Sales Overview" },
      xAxis: {
        categories: data.map((item: any) => `${getDayName(item.date)}, ${item.date}`)
      },
      yAxis: {
        title: { text: "Amount ($)" },
        labels: {
          formatter: function () {
            return this.value >= 1000 ? (this.value / 1000) + "k" : this.value;
          }
        },
      },
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
          data: data.map((item: any) => item.profit > 0 ? item.profit : 0),
          stack: "profit"
        }
      ],
      plotOptions: {
        column: {
          stacking: "normal",
          cursor: "pointer",
          states: {
            select: {
              color: "#FF5733",
              borderColor: "#C70039",
              borderWidth: 3
            }
          },
          point: {
            events: {
              click: function () {
                const clickedIndex = this.index;

                // Update the column selection
                if (selectedColumns.value.includes(clickedIndex)) {
                  selectedColumns.value = selectedColumns.value.filter(i => i !== clickedIndex);
                } else {
                  if (selectedColumns.value.length >= 2) {
                    selectedColumns.value.shift();
                  }
                  selectedColumns.value.push(clickedIndex);
                }

                updateChartSelection();
                emit("column-clicked", data[clickedIndex]?.date);
              }
            }
          }
        }
      }
    };

    nextTick(() => {
      chart.value = Highcharts.chart(chartContainer.value, options);
    });

  } catch (error) {
    console.error("Error fetching chart data:", error);
  }
};

const updateChartSelection = () => {
  if (!chart.value) return;

  chart.value.series.forEach(series => {
    series.data.forEach(point => {
      point.select(selectedColumns.value.includes(point.index), false);
    });
  });

  chart.value.redraw();
};

// Watch the columns
watch(selectedColumns, updateChartSelection, { deep: true });

const getDayName = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

watch(() => props.days, fetchChartData);
onMounted(fetchChartData);
</script>

<template>
  <div ref="chartContainer" class="size-max"></div>
</template>
