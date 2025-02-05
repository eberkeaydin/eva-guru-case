<script setup lang="ts">
import { ref, watch } from "vue";
import apiClient from "@/api/axios";
import { useAuthStore } from "../../stores/auth";

const props = defineProps<{ selectedDates: string[] }>();
const authStore = useAuthStore();
const tableData = ref([]); // Table data
const currentPage = ref(1);
const totalPages = ref(0);
const loading = ref(false);

// Function for getting SKU refund rate
const fetchRefundRates = async (skuList: any[]) => {
  try {
    if (!skuList.length) return [];

    const refundResponse = await apiClient.post(
      "/data/get-sku-refund-rate",
      {
        marketplace: authStore.user?.marketplaceName,
        sellerId: authStore.user?.storeId,
        skuList: skuList.map((item) => item.sku),
        requestedDay: 30,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    const refundData = refundResponse.data?.Data || [];
    return skuList.map((sku) => ({
      ...sku,
      refundRate: refundData.find((item: any) => item.sku === sku.sku)?.refundRate || "0",
    }));
  } catch (error) {
    console.error("Error fetching refund rate data:", error);
    return skuList.map((sku) => ({ ...sku, refundRate: "N/A" }));
  }
};

// Fetching table data
const fetchTableData = async () => {
  if (!props.selectedDates.length) return;

  loading.value = true;
  try {
    const response = await apiClient.post(
      "/data/daily-sales-sku-list",
      {
        isDaysCompare: props.selectedDates.length === 2 ? 1 : 0,
        marketplace: authStore.user?.marketplaceName,
        pageNumber: Math.ceil(currentPage.value / 3),
        pageSize: 30,
        salesDate: props.selectedDates[0],
        salesDate2: props.selectedDates[1] || "",
        sellerId: authStore.user?.storeId,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    const skuList = response.data?.Data?.item.skuList || [];
    const updatedSkuList = await fetchRefundRates(skuList);

    tableData.value = updatedSkuList.slice(
      ((currentPage.value - 1) % 3) * 10,
      (currentPage.value % 3) * 10
    );
    totalPages.value = Math.ceil(skuList.length / 10);
  } catch (error) {
    console.error("Error fetching table data:", error);
    tableData.value = [];
  } finally {
    loading.value = false;
  }
};

watch([() => props.selectedDates, currentPage], fetchTableData);
</script>

<template>
  <div v-if="tableData.length">
    <h2 class="text-xl font-semibold mt-10 text-center">Sales Data Table</h2>

    <div v-if="loading" class="text-center">Loading...</div>

    <table class="table-auto w-full border-collapse border border-gray-200 mt-4">
      <thead>
        <tr>
          <th class="text-lg font-semibold border border-gray-200 px-4 py-2">SKU</th>
          <th class="text-lg font-semibold border border-gray-200 px-4 py-2">Product Name</th>
          <th class="text-lg font-semibold border border-gray-200 px-4 py-2">Sales / Amount</th>
          <th class="text-lg font-semibold border border-gray-200 px-4 py-2">SKU Refund Rate</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tableData" :key="item.sku">
          <td class="border border-gray-200 px-4 py-2">{{ item.sku }}</td>
          <td class="border border-gray-200 px-4 py-2 text-center">{{ item.productName }}</td>
          <td class="border border-gray-200 px-4 py-2 text-center">{{ (item.amount * item.qty) + (item.amount2 *
            item.qty2) + "$ / "
            + (item.amount + item.amount2) }}</td>
          <td class="border border-gray-200 px-4 py-2">{{ item.refundRate }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="flex justify-between mt-4 text-lg font-semibold">
      <button class="text-white" @click="currentPage--" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button class="text-white" @click="currentPage++" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>

  <div v-else class="text-center mt-4 text-lg font-semibold">
    <p v-if="!loading">Select at least 2 columns for comparison.</p>
  </div>
</template>
