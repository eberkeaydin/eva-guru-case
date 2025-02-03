<script setup lang="ts">
import { ref, watch } from "vue";
import apiClient from "@/api/axios";
import { useAuthStore } from "../../stores/auth";

const authStore = useAuthStore();
const tableData = ref([]);
const currentPage = ref(1);
const totalPages = ref(0);
const selectedColumns = ref([]);

const fetchTableData = async () => {
    try {
        const response = await apiClient.post("/data/daily-sales-sku-list", {
            isDaysCompare: selectedColumns.value.length === 2 ? 1 : 0,
            marketplace: authStore.user?.marketplaceName,
            pageNumber: currentPage.value,
            pageSize: 30,
            salesDate: selectedColumns.value[0],
            salesDate2: selectedColumns.value[1] || "",
            sellerId: authStore.user?.storeId,
        },
            {
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
            });

        const skuList = response.data.Data.skuList;
        tableData.value = skuList.slice(0, 10);
        totalPages.value = Math.ceil(skuList.length / 10);
    } catch (error) {
        console.error("Error fetching table data:", error);
    }
};

// Sayfa değişikliği veya sütun değişikliğinde tabloyu güncelle
watch([currentPage, selectedColumns], fetchTableData);
</script>

<template>
    <div v-if="tableData.length">
        <table class="table-auto w-full border-collapse border border-gray-200">
            <thead>
                <tr>
                    <th class="border border-gray-200 px-4 py-2">SKU</th>
                    <th class="border border-gray-200 px-4 py-2">Refund Rate</th>
                    <th class="border border-gray-200 px-4 py-2">Sales</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in tableData" :key="item.sku">
                    <td class="border border-gray-200 px-4 py-2">{{ item.sku }}</td>
                    <td class="border border-gray-200 px-4 py-2">{{ item.refundRate }}</td>
                    <td class="border border-gray-200 px-4 py-2">{{ item.sales }}</td>
                </tr>
            </tbody>
        </table>
        <div class="flex justify-between mt-4">
            <button @click="currentPage--" :disabled="currentPage === 1">Previous</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="currentPage++" :disabled="currentPage === totalPages">Next</button>
        </div>
    </div>
</template>
