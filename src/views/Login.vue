<script setup lang="ts">
import LoginForm from '../components/forms/LoginForm.vue'
import AuthLayout from '../components/layout/AuthLayout.vue'

import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import apiClient from '../api/axios'

const authStore = useAuthStore()
const router = useRouter()

// Login fonksiyonu (Önceden yazdığınız kodlar burada kalacak)
const handleLogin = async ({ email, password }: { email: string; password: string }) => {
  try {
    const tokenResponse = await apiClient.post('/oauth/token', {
      Email: email,
      Password: password,
      GrantType: 'password',
      Scope: 'amazon_data',
      ClientId: 'C0001',
      ClientSecret: 'SECRET0001',
      RedirectUri: 'https://api.eva.guru',
    })

    const tokenData = tokenResponse.data

    if (tokenData.Data.AccessToken) {
      authStore.setToken(tokenData.Data.AccessToken)

      const userInfoResponse = await apiClient.post(
        '/user/user-information',
        { email },
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        },
      )

      authStore.setUser(userInfoResponse.data.Data.user.store[0])
      router.push('/dashboard')
    } else {
      alert('Login failed! Check your credentials.')
    }
  } catch (error) {
    console.error('Login error:', error)
    alert('An error occurred during login.')
  }
}
</script>

<template>
  <AuthLayout>
    <h2 class="text-2xl font-semibold text-center text-black mb-4">Welcome !</h2>
    <LoginForm @login="handleLogin" />
  </AuthLayout>
</template>
