<script setup lang="ts">
definePageMeta({
  layout: 'auth-layout' 
})
</script>

<template>
  <div class="group relative">
    
    <div class="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-br from-cyan-400 to-sky-600 opacity-0 blur-xl transition duration-500 group-hover:opacity-10 dark:opacity-0 dark:group-hover:opacity-10"></div>

    <div class="relative overflow-hidden rounded-[2rem] bg-white/90 px-6 py-8 shadow-2xl backdrop-blur-xl ring-1 ring-gray-100 dark:bg-black/80 dark:ring-neutral-800 sm:px-8">
      
      <div class="flex flex-col items-center text-center">
        
        <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-50 to-sky-50 shadow-inner ring-1 ring-white dark:from-neutral-900 dark:to-neutral-900 dark:ring-neutral-800">
          <svg class="h-6 w-6 text-sky-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 class="font-display text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Check your email
        </h1>
        
        <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
          We sent a verification link to <br/>
          <span class="font-semibold text-gray-900 dark:text-white">name@example.com</span>
        </p>
      </div>

      <div class="mt-8 space-y-4">
        
        <button class="w-full rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
          Open Email App
        </button>

        <div class="text-center">
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Didn't receive the email? 
            <button class="font-semibold text-sky-600 hover:text-sky-500 hover:underline dark:text-cyan-400 dark:hover:text-cyan-300">
              Click to resend
            </button>
          </p>
        </div>

      </div>

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
</template>