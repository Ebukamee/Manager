<script setup lang="ts">
import { ref } from 'vue'
import { Home, Grid, PieChart, Calendar, Settings, LogOut, Sun, Moon } from 'lucide-vue-next'
import { authClient } from "~/lib/auth-client";

const route = useRoute()
const isDark = ref(false)

const handleLogout = async () => {
  await authClient.signOut()
  await navigateTo('/')
}

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
  document.documentElement.classList.toggle('dark', isDark.value)
}
</script>

<template>
  <div class="min-h-screen bg-white text-slate-900 font-sans transition-colors dark:bg-black dark:text-white flex">

    <!-- DESKTOP SIDEBAR -->
    <aside class="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-slate-100 bg-white px-5 py-6 z-50 dark:border-neutral-900 dark:bg-black">

      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <img src="~/assets/logo.png" class="h-7 w-7 rounded-lg object-cover" />
          <span class="text-lg font-bold">Manager</span>
        </div>

        <button @click="toggleTheme" class="p-2 rounded-full text-slate-400 hover:bg-slate-50 dark:hover:bg-neutral-900">
          <Sun v-if="isDark" class="h-4 w-4" />
          <Moon v-else class="h-4 w-4" />
        </button>
      </div>

      <nav class="flex-1 space-y-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative"
          :class="isActive(item.path)
            ? 'bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400'
            : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-neutral-900'"
        >
          <div v-if="isActive(item.path)" class="absolute left-0 h-5 w-1 bg-sky-600 rounded-r-full"></div>
          <component :is="item.icon" class="w-4 h-4" />
          <span class="text-xs font-bold">{{ item.name }}</span>
        </NuxtLink>
      </nav>

      <!-- DESKTOP LOGOUT -->
      <div class="mt-auto pt-4 border-t border-slate-100 dark:border-neutral-800">
        <button
          @click="handleLogout"
          class="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/10"
        >
          <LogOut class="w-4 h-4" />
          <span class="text-xs font-bold">Log out</span>
        </button>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="flex-1 w-full lg:pl-64 min-h-screen pb-24 lg:pb-0">
      <div class="max-w-[1000px] mx-auto p-4 sm:p-8">
        <slot />
      </div>
    </main>

    <!-- MOBILE THEME TOGGLE -->
    <div class="fixed top-4 right-4 lg:hidden z-[60]">
      <button
        @click="toggleTheme"
        class="rounded-full bg-white/90 backdrop-blur border p-2 text-slate-500 dark:bg-black/90 dark:border-neutral-800"
      >
        <Sun v-if="isDark" class="h-4 w-4" />
        <Moon v-else class="h-4 w-4" />
      </button>
    </div>

    <!-- MOBILE BOTTOM NAV (WITH LOGOUT) -->
    <div class="fixed bottom-6 left-0 right-0 flex justify-center lg:hidden z-50 pointer-events-none">
      <div class="pointer-events-auto flex items-center gap-1 bg-white/90 backdrop-blur border p-1.5 rounded-2xl shadow-xl dark:bg-neutral-900 dark:border-neutral-800">

        <NuxtLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="flex items-center justify-center w-10 h-10 rounded-xl transition-all"
          :class="isActive(item.path)
            ? 'bg-sky-600 text-white'
            : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-neutral-800'"
        >
          <component :is="item.icon" class="w-4 h-4" />
        </NuxtLink>

        <!-- MOBILE LOGOUT -->
        <button
          @click="handleLogout"
          class="flex items-center justify-center w-10 h-10 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
        >
          <LogOut class="w-4 h-4" />
        </button>

      </div>
    </div>

  </div>
</template>
