<template>
  <div>
    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input id="email" type="email" v-model="email" required
          class="mt-1 block w-full p-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input id="password" type="password" v-model="password" required
          class="mt-1 block w-full p-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
      </div>

      <button type="submit" class="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700">
        Login
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const email = ref('');
const password = ref('');

// Emitting login event to upper component
const emit = defineEmits(['login']);

// Form submit operation
const submitForm = () => {
  if (!email.value || !password.value) {
    alert('Please enter your email and password!');
    return;
  }

  emit('login', { email: email.value, password: password.value });
};
</script>
