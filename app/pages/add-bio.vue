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
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
        </div>

        <h1 class="font-display text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Nice to meet you
        </h1>
        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Tell us what you do. We'll handle the rest.
        </p>
      </div>

      <form class="mt-8 space-y-5">

        <div>
           <label class="mb-1.5 ml-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Role / Title</label>
           <input 
             type="text" 
             placeholder="e.g. Project Manager, Student, CEO..." 
             class="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-gray-200 transition-all focus:bg-white focus:ring-2 focus:ring-sky-500 dark:bg-neutral-900 dark:text-white dark:ring-neutral-800 dark:focus:bg-black dark:focus:ring-cyan-500"
           />
        </div>

        <div>
           <label class="mb-1.5 ml-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Brief Summary</label>
           <textarea 
             rows="4" 
             placeholder="I love micro-managing and drinking too much coffee..." 
             class="w-full resize-none rounded-xl border-none bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-gray-200 transition-all focus:bg-white focus:ring-2 focus:ring-sky-500 dark:bg-neutral-900 dark:text-white dark:ring-neutral-800 dark:focus:bg-black dark:focus:ring-cyan-500"
           ></textarea>
        </div>

        <button class="w-full rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
          Complete Setup
        </button>

      </form>

    </div>
  </div>
</template>