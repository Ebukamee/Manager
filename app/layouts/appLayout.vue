<script setup lang="ts">
import { Home, Grid, PieChart, Calendar, Plus, Settings, LogOut } from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Categories', icon: Grid, path: '/categories' },
  { name: 'Stats', icon: PieChart, path: '/stats' },
  { name: 'Calendar', icon: Calendar, path: '/calendar' },
]

const isActive = (path: string) => route.path === path
</script>

<template>
  <div class="min-h-screen bg-[#F2F4F6] text-slate-900 font-sans selection:bg-black selection:text-white flex">

    <aside class="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white border-r border-gray-100 px-6 py-8 z-50">
      <div class="flex items-center gap-3 mb-12">
        <div class="h-10 w-10 bg-black rounded-xl flex items-center justify-center text-white font-bold text-lg">M</div>
        <span class="font-bold text-xl tracking-tight">Manager</span>
      </div>

      <nav class="flex-1 space-y-2">
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.name" 
          :to="item.path"
          class="flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group"
          :class="isActive(item.path) ? 'bg-black text-white shadow-lg shadow-black/20' : 'text-gray-500 hover:bg-gray-50'"
        >
          <component :is="item.icon" class="w-5 h-5" :class="isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-black'" />
          <span class="font-medium">{{ item.name }}</span>
        </NuxtLink>
      </nav>

      <div class="mt-auto pt-6 border-t border-gray-100 space-y-2">
        <button class="flex w-full items-center gap-4 px-4 py-3 rounded-2xl text-gray-500 hover:bg-gray-50 transition-colors">
          <Settings class="w-5 h-5 text-gray-400" />
          <span class="font-medium">Settings</span>
        </button>
        <button class="flex w-full items-center gap-4 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-colors">
          <LogOut class="w-5 h-5" />
          <span class="font-medium">Log out</span>
        </button>
      </div>
    </aside>

    <main class="flex-1 w-full lg:pl-64 min-h-screen pb-24 lg:pb-0">
      <div class="max-w-5xl mx-auto p-4 sm:p-6 lg:p-10">
        <slot />
      </div>
    </main>

    <div class="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-100 pb-safe pt-2 px-6 lg:hidden z-50">
      <div class="flex justify-between items-center h-16">
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.name" 
          :to="item.path"
          class="flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors"
          :class="isActive(item.path) ? 'text-black' : 'text-gray-400'"
        >
          <component 
            :is="item.icon" 
            class="w-6 h-6 transition-transform duration-300" 
            :class="isActive(item.path) ? 'fill-black scale-110' : ''" 
            :stroke-width="isActive(item.path) ? 2.5 : 2"
          />
        </NuxtLink>
      </div>
    </div>

  </div>
</template>

<style>
/* Safe area for iPhone home bar */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>