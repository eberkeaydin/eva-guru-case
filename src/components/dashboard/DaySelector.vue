<script setup lang="ts">
import { defineEmits } from 'vue'

const emit = defineEmits(['day-changed'])
const days = [7, 14, 30, 60]

const handleDayChange = (event: Event) => {
  const day = parseInt((event.target as HTMLSelectElement).value, 10)
  emit('day-changed', day)
}
</script>

<template>
  <div class="flex justify-end mb-4">
    <select @change="handleDayChange" class="border px-4 py-2 rounded-lg">
      <option v-for="day in days" :key="day" :value="day">Last {{ day }} Days</option>
    </select>
  </div>
</template>
