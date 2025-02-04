<script setup lang="ts">
import { ref, defineEmits } from 'vue'

const email = ref('')
const password = ref('')

// Parent bileşene login bilgilerini gönder
const emit = defineEmits(['login'])
const submitForm = () => {
  emit('login', { email: email.value, password: password.value })
}
</script>

<template>
  <form @submit.prevent="submitForm">
    <div class="mb-4">
      <label class="block text-gray-700">Email</label>
      <input v-model="email" type="email"
        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" required />
    </div>
    <div class="mb-4">
      <label class="block text-gray-700">Password</label>
      <input v-model="password" type="password"
        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" required />
    </div>
    <button type="submit" class="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
      Login
    </button>
  </form>
</template>
