<script setup lang="ts">
import { ref } from 'vue'
import { Home, Grid, PieChart, Calendar, Settings, LogOut, Sun, Moon } from 'lucide-vue-next'

const route = useRoute()
const isDark = ref(false)

const navItems = [
  { name: 'Dashboard', icon: Home, path: '/dashboard' },
  { name: 'Categories', icon: Grid, path: '/categories' },
  { name: 'Stats', icon: PieChart, path: '/stats' },
  { name: 'Calendar', icon: Calendar, path: '/calendar' },
  { name: 'Settings', icon: Settings, path: '/settings' },
]

const isActive = (path: string) => route.path === path

const toggleTheme = () => {
    isDark.value = !isDark.value
    if (isDark.value) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}
</script>

<template>
  <div class="min-h-screen bg-white text-slate-900 font-sans transition-colors duration-300 dark:bg-black dark:text-white selection:bg-sky-500 selection:text-white flex">

    <aside class="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-slate-100 bg-white px-5 py-6 z-50 dark:border-neutral-900 dark:bg-black">
      
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
            <img src="~/assets/logo.png" alt="" class="h-7 w-7 rounded-lg object-cover">
            <span class="font-sans text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Manager
            </span>
        </div>

        <button 
          @click="toggleTheme"
          class="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-sky-600 transition-colors dark:hover:bg-neutral-900"
        >
            <Sun v-if="isDark" class="h-4 w-4" />
            <Moon v-else class="h-4 w-4" />
        </button>
      </div>

      <nav class="flex-1 space-y-1">
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.name" 
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative"
          :class="isActive(item.path) 
            ? 'bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-neutral-900 dark:hover:text-white'"
        >
          <div v-if="isActive(item.path)" class="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-sky-600"></div>

          <component 
            :is="item.icon" 
            class="w-4 h-4" 
            :class="isActive(item.path) ? 'text-sky-600 dark:text-sky-400' : 'group-hover:text-slate-600 dark:group-hover:text-slate-300'" 
            stroke-width="2"
          />
          <span class="font-sans text-xs font-bold tracking-wide">{{ item.name }}</span>
        </NuxtLink>
      </nav>

      <div class="mt-auto pt-4 border-t border-slate-100 dark:border-neutral-800">
        <button class="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors dark:hover:bg-red-900/10 dark:hover:text-red-400">
          <LogOut class="w-4 h-4" />
          <span class="font-sans text-xs font-bold">Log out</span>
        </button>
      </div>
    </aside>

    <main class="flex-1 w-full lg:pl-64 min-h-screen pb-24 lg:pb-0 relative">
        <div class="max-w-[1000px] mx-auto p-4 sm:p-8">
            <slot />
        </div>
    </main>

    <div class="fixed top-4 right-4 z-[60] lg:hidden">
        <button 
          @click="toggleTheme"
          class="rounded-full bg-white/90 backdrop-blur-md border border-slate-200 p-2 text-slate-500 shadow-sm dark:bg-black/90 dark:border-neutral-800 dark:text-slate-400"
        >
            <Sun v-if="isDark" class="h-4 w-4" />
            <Moon v-else class="h-4 w-4" />
        </button>
    </div>

    <div class="fixed bottom-6 left-0 right-0 flex justify-center lg:hidden z-50 pointer-events-none">
      <div class="pointer-events-auto flex items-center gap-1 bg-white/90 backdrop-blur-xl border border-slate-200/50 p-1.5 rounded-2xl shadow-xl shadow-sky-900/5 dark:bg-neutral-900/90 dark:border-neutral-800 dark:shadow-black">
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.name" 
          :to="item.path"
          class="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300"
          :class="isActive(item.path) 
            ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20' 
            : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-neutral-800'"
        >
          <component :is="item.icon" class="w-4 h-4" />
        </NuxtLink>
      </div>
    </div>

  </div>
</template>