<script setup lang="ts">
import { ref, computed } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'

// Vite-safe asset imports
import bgLight from '@/assets/bg-light.jpg'
import bgDark from '@/assets/bg-dark.jpg'

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

// Background style (responsive & SSR-safe)
const lightBgStyle = {
  backgroundImage: `url(${bgLight})`,
  backgroundRepeat: 'repeat',
  backgroundSize: '400px'
}

const darkBgStyle = {
  backgroundImage: `url(${bgDark})`,
  backgroundRepeat: 'repeat',
  backgroundSize: '400px'
}
</script>

<template>
  <div
    class="relative min-h-screen w-full flex flex-col items-center justify-center
           overflow-hidden transition-colors duration-300
           bg-gray-50 text-gray-900 dark:bg-black dark:text-white
           selection:bg-cyan-500 selection:text-white"
  >
    <!-- Background layers (unchanged structure) -->
    <div class="absolute inset-0 z-10 h-full w-full pointer-events-none">
      <div
        class="absolute inset-0 opacity-5 dark:opacity-0 transition-opacity duration-500"
        :style="lightBgStyle"
      ></div>

      <div
        class="absolute inset-0 opacity-0 dark:opacity-10 transition-opacity duration-500"
        :style="darkBgStyle"
      ></div>

      <div
        class="absolute inset-0 bg-gradient-to-b
               from-transparent via-transparent
               to-gray-50/90 dark:to-black"
      ></div>
    </div>

    <!-- Header (unchanged) -->
    <div class="fixed top-3 z-50 w-full px-4 flex justify-center">
      <div class="w-full max-w-4xl flex items-center justify-between px-6 py-3">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <img
            src="~/assets/logo.png"
            alt="Logo"
            class="h-8 w-8 rounded-lg object-cover shadow-sm
                   transition-transform group-hover:scale-105"
          />
          <span class="font-display text-lg font-bold tracking-tight">
            Manager
          </span>
        </NuxtLink>

        <button
          @click="toggleTheme"
          class="rounded-full p-2 text-gray-500
                 hover:bg-white/80 transition-colors
                 dark:text-gray-400 dark:hover:bg-neutral-800"
        >
          <Sun v-if="isDark" class="h-5 w-5" :stroke-width="2" />
          <Moon v-else class="h-5 w-5" :stroke-width="2" />
        </button>
      </div>
    </div>

   
    <div class="relative z-10 w-full max-w-[380px] px-4 mt-24 sm:mt-0">
      <slot />
    </div>

   
    <div class="absolute bottom-6 w-full text-center text-xs text-gray-400">
      &copy; 2026 Manager
    </div>
  </div>
</template>
