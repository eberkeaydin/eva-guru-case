<script setup lang="ts">
import ChartComponent from "@/components/dashboard/ChartComponent.vue";
import DataTable from "@/components/dashboard/DataTable.vue";
import DaySelector from "@/components/dashboard/DaySelector.vue";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const selectedDays = ref(7); // Varsayılan gün değeri
const selectedDates = ref<string[]>([]); // Seçilen tarihleri takip eder
const isLoading = ref(false); // Yükleme animasyonu kontrolü

// Logout işlemi
const logout = () => {
  authStore.logout();
  router.push("/");
};

// Gün değişikliği işleyici
const handleDayChange = async (day: number) => {
  selectedDays.value = day;
  isLoading.value = true; // Yükleme başlat
  try {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simüle edilen yükleme süresi
  } finally {
    isLoading.value = false;
  }
};

// Grafikteki bir sütuna tıklanınca çağrılır
const handleColumnClick = (date: string) => {
  if (!selectedDates.value.includes(date)) {
    if (selectedDates.value.length === 2) {
      selectedDates.value = [date]; // İki tarih seçiliyse sıfırla ve yeni tarihi ekle
    } else {
      selectedDates.value.push(date);
    }
  }
};
</script>

<template>
  <div class="p-4">
    <!-- Üst Kısım: Dashboard Başlığı ve Logout Butonu -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Dashboard</h1>
    </div>

    <!-- Gün Seçici -->
    <DaySelector @day-changed="handleDayChange" />

    <!-- Yükleme Animasyonu -->
    <div v-if="isLoading" class="flex justify-center items-center mt-8">
      <div class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>

    <!-- Grafik ve Tablo -->
    <div v-else>
      <ChartComponent :days="selectedDays" @column-clicked="handleColumnClick" />
      <DataTable :selected-dates="selectedDates" />
      <button @click="logout" class="bg-red-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-red-600">
        Logout
      </button>
    </div>
  </div>
</template>

<style>
/* Spinner için CSS */
.animate-spin {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 4px solid rgba(59, 130, 246, 0.5);
  border-radius: 50%;
  border-top-color: rgba(59, 130, 246, 1);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
