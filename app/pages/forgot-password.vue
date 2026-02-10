<script setup lang="ts">
import { authClient } from '~/lib/auth-client';
import { ref, computed } from 'vue'; // Import computed

const emailSent = ref(false);
const loading = ref(false);
const email= ref('');

definePageMeta({
  layout: 'auth-layout' 
})

const session = authClient.useSession();

const userEmail = computed(() => {
    return session.value.data?.user.email || "";
});

const requestPasswordReset = async () => {


    const { data, error } = await authClient.requestPasswordReset({
        email: email.value,
        redirectTo: "/reset-password"
    });
    
    loading.value = false;
    
    // if (error) alert("Error: " + error.message);
    if (error) console.log(error);
    else emailSent.value = true;
    console.log(session);
};
</script>

<template>
  <div class="group relative">
    
    <div class="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-br from-cyan-400 to-sky-600 opacity-0 blur-xl transition duration-500 group-hover:opacity-10 dark:opacity-0 dark:group-hover:opacity-10"></div>

    <div class="relative overflow-hidden rounded-[2rem] bg-white/90 px-6 py-8 shadow-2xl backdrop-blur-xl ring-1 ring-gray-100 dark:bg-black/80 dark:ring-neutral-800 sm:px-8">
      
      <div class="flex flex-col items-center text-center">
        
        <div class="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-50 to-sky-50 shadow-inner ring-1 ring-white dark:from-neutral-900 dark:to-neutral-900 dark:ring-neutral-800">
          <svg class="h-5 w-5 text-sky-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>

        <h1 class="font-display text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Forgot password?
        </h1>
        
        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          No worries, we'll send you reset instructions.
        </p>
      </div>

      <form class="mt-6 space-y-4" @submit.prevent="requestPasswordReset">
        
        <div class="space-y-1">
          <label class="ml-1 text-xs font-medium text-gray-500 dark:text-gray-400">Email</label>
          <input 
            type="email" 
            placeholder="Enter your email"
            v-model="email" 
            class="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-gray-200 transition-all focus:bg-white focus:ring-2 focus:ring-sky-500 dark:bg-neutral-900 dark:text-white dark:ring-neutral-800 dark:focus:bg-black dark:focus:ring-cyan-500"
          />
        </div>

        <button class="w-full rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
          Reset Password
        </button>

      </form>

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