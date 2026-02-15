<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ChevronDown, Filter, Calendar as CalendarIcon, AlertCircle } from 'lucide-vue-next'

definePageMeta({ 
  layout: 'app-layout',
  middleware: ['auth']
})

// --- STATE ---
const tasks = ref<any[]>([])
const isLoading = ref(true)
const activePeriod = ref<'day' | 'week' | 'month' | 'custom'>('week')
const activeCategory = ref('All')

// --- DATA FETCHING ---
const initStats = async () => {
  isLoading.value = true
  try {
    tasks.value = await $fetch('/api/tasks')
  } catch (err) {
    console.error("Stats Load Error:", err)
  } finally {
    isLoading.value = false
  }
}

// --- LOGIC: EXPIRED VS PENDING ---
const isTaskExpired = (task: any) => {
  if (task.status === 'completed') return false
  if (!task.dueAt) return false
  
  // Set time to end of day for due date comparison
  const due = new Date(task.dueAt)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  
  return due < now
}

// --- FILTERING ENGINE ---
const processedStats = computed(() => {
  let filtered = tasks.value

  // 1. Category Filter
  if (activeCategory.value !== 'All') {
    filtered = filtered.filter(t => t.category?.toLowerCase() === activeCategory.value.toLowerCase())
  }

  // 2. Period Filter
  const today = new Date()
  filtered = filtered.filter(t => {
    if (!t.dueAt) return activePeriod.value === 'custom'
    const d = new Date(t.dueAt)
    
    if (activePeriod.value === 'day') return d.toDateString() === today.toDateString()
    
    if (activePeriod.value === 'week') {
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())
      const endOfWeek = new Date(today)
      endOfWeek.setDate(today.getDate() + (6 - today.getDay()))
      return d >= startOfWeek && d <= endOfWeek
    }
    
    if (activePeriod.value === 'month') {
      return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
    }

    return true // Custom shows all
  })

  // 3. Status Segregation
  const completed = filtered.filter(t => t.status === 'completed').length
  const expired = filtered.filter(t => isTaskExpired(t)).length
  const pending = filtered.length - (completed + expired)

  return { completed, pending, expired, total: filtered.length }
})

onMounted(() => initStats())
</script>

<template>
  <div class="flex flex-col gap-8 pt-8 pb-12">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Performance Analytics</h1>
        <p class="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">Efficiency Tracking System</p>
      </div>

      <div class="flex bg-slate-100 dark:bg-neutral-800 p-1 rounded-xl w-fit border border-slate-200 dark:border-neutral-700">
        <button 
          v-for="p in ['day', 'week', 'month', 'custom']" 
          @click="activePeriod = p"
          :class="['px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all', 
          activePeriod === p ? 'bg-white text-slate-900 shadow-sm dark:bg-neutral-700 dark:text-white' : 'text-slate-500 hover:text-slate-700']"
        >
          {{ p }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="metric in [
        { label: 'Total Tasks', val: processedStats.total, color: 'text-slate-900 dark:text-white' },
        { label: 'Completed', val: processedStats.completed, color: 'text-sky-600' },
        { label: 'Pending', val: processedStats.pending, color: 'text-slate-400' },
        { label: 'Lapsed/Expired', val: processedStats.expired, color: 'text-rose-500' }
      ]" :key="metric.label" class="p-6 bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 rounded-2xl shadow-sm">
        <p class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{{ metric.label }}</p>
        <p :class="['text-2xl font-black tracking-tighter', metric.color]">{{ metric.val }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div class="lg:col-span-3 bg-white dark:bg-neutral-900 p-8 rounded-[32px] border border-slate-100 dark:border-neutral-800 shadow-sm min-h-[450px] flex flex-col">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="font-bold text-slate-900 dark:text-white">Trend Analysis</h3>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Categorized Data Visualization</p>
          </div>
          <select v-model="activeCategory" class="bg-slate-50 dark:bg-neutral-800 text-[10px] font-bold px-4 py-2 rounded-lg border-none outline-none cursor-pointer uppercase tracking-widest">
            <option value="All">All Categories</option>
            <option v-for="cat in ['Work', 'Personal', 'Health', 'Finance']" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <div class="flex-1 relative">
          <ClientOnly>
            <AnalyticsChart 
              :completed="processedStats.completed" 
              :pending="processedStats.pending" 
              :expired="processedStats.expired" 
            />
            <template #fallback>
              <div class="h-full w-full flex items-center justify-center bg-slate-50 rounded-xl animate-pulse text-xs text-slate-400 font-bold uppercase">Loading Engine...</div>
            </template>
          </ClientOnly>
        </div>
      </div>

      <div class="bg-slate-900 p-8 rounded-[32px] text-white flex flex-col">
        <AlertCircle class="w-8 h-8 text-rose-500 mb-6" />
        <h3 class="text-lg font-bold leading-tight mb-2">Cycle Integrity</h3>
        <p class="text-xs text-slate-400 leading-relaxed mb-8">
          Tasks are marked as <span class="text-rose-400 font-bold">Expired</span> if they were not marked completed before the deadline passed.
        </p>
        
        <div class="mt-auto pt-6 border-t border-white/10">
          <p class="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Success Rate</p>
          <p class="text-3xl font-black text-sky-400">
            {{ Math.round((processedStats.completed / (processedStats.total || 1)) * 100) }}%
          </p>
        </div>
      </div>
    </div>
  </div>
</template>