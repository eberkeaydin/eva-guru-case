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
const isLoading = ref(false); // Yüklenme durumu

// Logout işlemi
const logout = () => {
  authStore.logout();
  router.push("/");
};

// Gün değişikliği için işleyici
const handleDayChange = async (day: number) => {
  selectedDays.value = day;
  isLoading.value = true; // Yükleme başlat
  try {
    // Grafiği yeniden yüklemek için biraz gecikme eklenebilir
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simüle edilmiş gecikme
  } finally {
    isLoading.value = false; // Yükleme tamamlandı
  }
};
</script>

<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Dashboard</h1>
    </div>

    <!-- Gün Seçimi -->
    <DaySelector @day-changed="handleDayChange" />

    <!-- Yükleme Animasyonu -->
    <div v-if="isLoading" class="flex justify-center items-center mt-8">
      <div class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>

    <!-- Grafik ve Tablo -->
    <div v-else>
      <ChartComponent :days="selectedDays" />
      <DataTable />
    </div>

    <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
      Logout
    </button>
  </div>
</template>

<style>
/* Loading animasyonu için gerekli stil */
.animate-spin {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 4px solid rgba(59, 130, 246, 0.5);
  /* Mavi kenarlar */
  border-radius: 50%;
  border-top-color: rgba(59, 130, 246, 1);
  /* Üst kısmı tam mavi */
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
