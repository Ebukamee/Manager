<script setup lang="ts">
import { ref } from 'vue'
import { Sun, Moon, ArrowRight } from 'lucide-vue-next'

const isDark = ref(false)

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
    <div class="fixed top-6 z-50 w-full px-4 sm:px-8 flex justify-center">

        <nav
            class="w-full max-w-4xl rounded-4xl border border-gray-200 bg-white/80 px-4 py-3 shadow-md backdrop-blur-md transition-all dark:border-neutral-800 dark:bg-black/80 sm:px-6">

            <div class="flex items-center justify-between">

                <div class="flex items-center gap-3">
                    <img src="../assets/logo.png" alt="" class="h-8 w-8 rounded-lg object-cover shadow-sm">

                    <span class="font-sans text-xl text-cyan-500 tracking-tight">
                        <span class="font-bold">Manager</span>
                    </span>
                </div>

                <div class="flex items-center gap-3 sm:gap-4">
                    <button @click="toggleTheme"
                        class="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-900">
                        <Sun v-if="isDark" class="h-5 w-5" :stroke-width="2" />
                        <Moon v-else class="h-5 w-5" :stroke-width="2" />
                    </button>

                    <button
                        class="flex items-center justify-center gap-2 rounded-full bg-sky-600 p-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-500 hover:scale-105 sm:px-5 sm:py-2">
                        <span class="hidden sm:inline">Get Started</span>
                        <ArrowRight class="h-4 w-4" :stroke-width="2.5" />
                    </button>
                </div>

            </div>
        </nav>
    </div>
</template>