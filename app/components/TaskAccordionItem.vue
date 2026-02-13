<script setup lang="ts">
import { Circle, ChevronDown } from 'lucide-vue-next'
import { getCategoryClass } from '../utilis/helper'

defineProps<{
  task: any
  isExpanded: boolean
}>()

defineEmits(['toggle'])
</script>

<template>
  <div class="flex flex-col rounded-xl bg-slate-50 dark:bg-neutral-800 border border-transparent transition-all overflow-hidden">
    <div class="flex items-center gap-3 p-3 hover:bg-slate-100 dark:hover:bg-neutral-700/50 transition-colors">
      <Circle class="w-4 h-4 text-slate-300 hover:text-sky-600 cursor-pointer" />
      <div class="flex-1">
        <h3 class="text-xs font-bold text-slate-900 dark:text-white">{{ task.title }}</h3>
      </div>
      <span :class="getCategoryClass(task.category)" class="px-2 py-0.5 rounded text-[8px] font-bold uppercase">
        {{ task.category }}
      </span>
      <button @click="$emit('toggle')" class="p-1 hover:bg-slate-200 dark:hover:bg-neutral-600 rounded-md transition-colors">
        <ChevronDown 
          class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200" 
          :class="{'rotate-180': isExpanded}" 
        />
      </button>
    </div>
    
    <div v-if="isExpanded" class="px-3 pb-3 pt-1 border-t border-slate-200 dark:border-neutral-700 animate-in fade-in slide-in-from-top-1">
      <p class="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
        {{ task.description || 'No description provided.' }}
      </p>
      <div class="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
        <span :class="task.priority === 'high' ? 'text-red-500' : 'text-slate-400'">
          {{ task.priority }} Priority
        </span>
        <span>•</span>
        <span>Due: {{ task.dueAt ? new Date(task.dueAt).toLocaleDateString() : 'No date' }}</span>
      </div>
    </div>
  </div>
</template>