<script setup lang="ts">
import { Clock, Folder } from 'lucide-vue-next'

defineProps<{
  container: any
  taskCount: number
}>()

defineEmits(['click'])
</script>

<template>
  <div 
    @click="$emit('click')" 
    class="group cursor-pointer p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-sky-200 hover:shadow-md transition-all dark:bg-neutral-900 dark:border-neutral-800 dark:hover:border-sky-500/30"
  >
    <div 
      class="mb-3 h-8 w-8 rounded-lg flex items-center justify-center transition-colors" 
      :class="container.type !== 'custom' ? 'bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400' : 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400'"
    >
      <Clock v-if="container.type !== 'custom'" class="w-4 h-4" />
      <Folder v-else class="w-4 h-4" />
    </div>
    <h3 class="font-bold text-xs text-slate-900 dark:text-white mb-1">{{ container.name }}</h3>
    <p class="text-[10px] text-slate-400 font-medium">
      {{ taskCount }} Tasks
    </p>
  </div>
</template>