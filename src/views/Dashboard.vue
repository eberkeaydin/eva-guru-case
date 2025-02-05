<script setup lang="ts">
import ChartComponent from "@/components/dashboard/ChartComponent.vue";
import DataTable from "@/components/dashboard/DataTable.vue";
import DaySelector from "@/components/dashboard/DaySelector.vue";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const selectedDays = ref(7); // Default days
const selectedDates = ref<string[]>([]); // Follow selected dates
const isLoading = ref(false); // Loading animation control

// Logout
const logout = () => {
  authStore.logout();
  router.push("/");
};

// Day change processor
const handleDayChange = async (day: number) => {
  selectedDays.value = day;
  isLoading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulated upload time
  } finally {
    isLoading.value = false;
  }
};

// Selecting column call when user clicking columns for comparison
const handleColumnClick = (date: string) => {
  if (!selectedDates.value.includes(date)) {
    if (selectedDates.value.length === 2) {
      selectedDates.value = [date];
    } else {
      selectedDates.value.push(date);
    }
  }
};
</script>

<template>
  <div class="p-4 w-screen h-screen">
    <!-- Dashboard Header -->
    <div class="flex flex-col items-center mb-4">
      <h1 class="text-3xl font-bold text-center">Dashboard</h1>
    </div>

    <!-- Day Selector -->
    <DaySelector @day-changed="handleDayChange" />

    <!-- Loading Animation -->
    <div v-if="isLoading" class="flex justify-center items-center mt-8">
      <div class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>

    <!-- Chart, Table and Logout Button -->
    <div v-else>
      <ChartComponent :days="selectedDays" @column-clicked="handleColumnClick" />
      <DataTable :selected-dates="selectedDates" />
      <!-- Logout Butonu -->
      <div class="flex justify-center mt-8">
        <button @click="logout" class="bg-red-500 text-white px-6 py-3 mb-10 text-lg rounded-lg hover:bg-red-600">
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<style>
/* Spinner CSS */
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
