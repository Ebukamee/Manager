<script setup lang="ts">
import { getCategoryClass } from '../utilis/helper'

defineProps<{
  task: any
}>()
</script>

<template>
  <div class="flex items-center gap-3 p-3 border-b border-slate-50 last:border-none hover:bg-slate-50 transition-colors dark:border-neutral-800 dark:hover:bg-neutral-800">
    <div 
      class="w-1 h-8 rounded-full" 
      :class="task.priority === 'high' ? 'bg-red-500' : 'bg-slate-200 dark:bg-neutral-700'"
    ></div>
    <div class="flex-1 min-w-0">
      <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ task.title }}</h4>
      <p class="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
        <span class="truncate">{{ task.description || 'No description' }}</span>
      </p>
    </div>
    <div class="flex items-center gap-3">
      <span 
        class="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase" 
        :class="getCategoryClass(task.category)"
      >
        {{ task.category || 'General' }}
      </span>
      <div class="text-right">
        <p class="text-[10px] font-bold text-slate-700 dark:text-slate-300">
          {{ task.dueAt ? new Date(task.dueAt).toLocaleDateString() : 'Today' }}
        </p>
      </div>
    </div>
  </div>
</template>