<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authClient } from '~/lib/auth-client';

const router = useRouter()

// Inputs and states
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

// Get token from URL query
const token = ref('')

onMounted(() => {
  token.value = new URLSearchParams(window.location.search).get('token') || ''
  if (!token.value) {
    error.value = 'Invalid or missing reset token.'
  }
})

// Form submission
const handleReset = async () => {
  error.value = ''
  success.value = ''

  if (!password.value || !confirmPassword.value) {
    error.value = 'Please enter and confirm your password.'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  if (!token.value) {
    error.value = 'Missing reset token.'
    return
  }

  loading.value = true
  try {
    const { data, error: resetError } = await authClient.resetPassword({
      newPassword: password.value,
      token: token.value
    })

    if (resetError) {
      throw resetError
    }

    success.value = 'Password successfully reset! Redirecting to login...'
    password.value = ''
    confirmPassword.value = ''

    setTimeout(() => router.push('/login'), 2000)
  } catch (err: any) {
    console.error(err)
    error.value = err?.message || 'Failed to reset password.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4 py-12">
    <div class="group relative w-full max-w-md">
      
      <div class="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-br from-cyan-400 to-sky-600 opacity-0 blur-xl transition duration-500 group-hover:opacity-10 dark:opacity-0 dark:group-hover:opacity-10"></div>

      <div class="relative overflow-hidden rounded-[2rem] bg-white/90 px-6 py-8 shadow-2xl backdrop-blur-xl ring-1 ring-gray-100 dark:bg-black/80 dark:ring-neutral-800 sm:px-8">
        
        <!-- Header -->
        <div class="flex flex-col items-center text-center">
          <div class="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-50 to-sky-50 shadow-inner ring-1 ring-white dark:from-neutral-900 dark:to-neutral-900 dark:ring-neutral-800">
            <svg class="h-5 w-5 text-sky-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 11v2m0 4h.01M4 6h16M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6M4 6l8 6 8-6" />
            </svg>
          </div>

          <h1 class="font-display text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Set a New Password
          </h1>
          
          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Enter a new password to secure your account.
          </p>
        </div>

        <!-- Form -->
        <form class="mt-6 space-y-4" @submit.prevent="handleReset">
          <div class="space-y-1">
            <label class="ml-1 text-xs font-medium text-gray-500 dark:text-gray-400">New Password</label>
            <input 
              type="password"
              placeholder="New password"
              class="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-gray-200 transition-all focus:bg-white focus:ring-2 focus:ring-sky-500 dark:bg-neutral-900 dark:text-white dark:ring-neutral-800 dark:focus:bg-black dark:focus:ring-cyan-500"
              v-model="password"
              required
            />
          </div>

          <div class="space-y-1">
            <label class="ml-1 text-xs font-medium text-gray-500 dark:text-gray-400">Confirm Password</label>
            <input 
              type="password"
              placeholder="Confirm password"
              class="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-gray-200 transition-all focus:bg-white focus:ring-2 focus:ring-sky-500 dark:bg-neutral-900 dark:text-white dark:ring-neutral-800 dark:focus:bg-black dark:focus:ring-cyan-500"
              v-model="confirmPassword"
              required
            />
          </div>

          <button
            type="submit"
            class="w-full rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            :disabled="loading"
          >
            {{ loading ? 'Resetting...' : 'Reset Password' }}
          </button>

          <p v-if="error" class="text-sm text-red-500 mt-1">{{ error }}</p>
          <p v-if="success" class="text-sm text-emerald-500 mt-1">{{ success }}</p>
        </form>

        <!-- Footer link -->
        <div class="mt-8 text-center">
          <NuxtLink to="/login" class="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
            <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to log in
          </NuxtLink>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
// Use auth-layout
definePageMeta({
  layout: 'auth-layout'
})
</script>
