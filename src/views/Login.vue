<script setup lang="ts">
import LoginForm from '../components/forms/LoginForm.vue'
import AuthLayout from '../components/layout/AuthLayout.vue'

import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import apiClient from '../api/axios'

const authStore = useAuthStore()
const router = useRouter()

// Login function
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
            Authorization: `Bearer ${tokenData.Data.AccessToken}`,
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
    <div class="w-full flex flex-col items-center">
      <h2 class="text-3xl font-semibold text-center text-black mb-6">Welcome!</h2>
      <LoginForm @login="handleLogin" class="w-screen max-w-lg" />
    </div>
  </AuthLayout>
</template>
