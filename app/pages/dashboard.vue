<script setup lang="ts">
import { ref, computed,onMounted } from 'vue'
import { Plus, Search, Clock, Folder, ChevronRight, X, Circle, Calendar, ArrowUpRight } from 'lucide-vue-next'
import { getFormattedDate } from '../utilis/helper'
import { authClient } from '~/lib/auth-client';

definePageMeta({ layout: 'app-layout',
    middleware: ['auth', 'verified-email']
 })

// --- STATE ---
const searchQuery = ref('')
const showCreateModal = ref(false)
const selectedCycle = ref<any>(null)
const session =  authClient.useSession();
const userEmail = session.value.data?.user.name;
// --- MOCK DATA ---
const activeContainers = [
  { id: 'daily', name: 'Daily Task', type: 'system', count: 3, expires: 'Tonight' },
  { id: 'weekly', name: 'Weekly Goals', type: 'system', count: 5, expires: 'Sunday' },
  { id: 'monthly', name: 'Feb Targets', type: 'system', count: 12, expires: 'Feb 28' },
  { id: 'custom-alpha', name: 'Project Alpha', type: 'custom', count: 8, expires: 'Jan 24' },
]

const tasks = [
  { id: 1, title: 'Finish project proposal', desc: 'Q4 proposal with budget.', tag: 'Work', tagClass: 'text-sky-600 bg-sky-50 dark:bg-sky-500/10 dark:text-sky-400', due: 'Today, 2:00 PM', containerId: 'daily', priority: 'high' },
  { id: 2, title: 'Buy groceries', desc: 'Milk, eggs, bread.', tag: 'Personal', tagClass: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10 dark:text-purple-400', due: 'Today, 5:00 PM', containerId: 'weekly', priority: 'med' },
  { id: 3, title: 'Gym Session', desc: 'Leg day workout.', tag: 'Health', tagClass: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400', due: 'Tomorrow', containerId: 'daily', priority: 'low' },
  { id: 4, title: 'Client Meeting', desc: 'Discuss roadmap.', tag: 'Work', tagClass: 'text-sky-600 bg-sky-50 dark:bg-sky-500/10 dark:text-sky-400', due: 'Jan 24', containerId: 'custom-alpha', priority: 'high' },
]

// Tasks for the Modal (Specific Cycle)
const cycleTasks = computed(() => {
  if (!selectedCycle.value) return []
  return tasks.filter(t => t.containerId === selectedCycle.value.id || selectedCycle.value.id === 'custom-alpha') 
})

// All Tasks Sorted by Deadline (For the main list)
const allTasksSorted = computed(() => {
  return [...tasks].sort((a, b) => a.priority === 'high' ? -1 : 1) // Simple mock sort
})

const openCycle = (container: any) => { selectedCycle.value = container }
const closeCycle = () => { selectedCycle.value = null }
const todayDate = ref('')

onMounted(() => {
  todayDate.value = getFormattedDate()
})
</script>

<template>
  <div class="flex flex-col gap-8 pt-12 lg:pt-0"> 
    
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-0.5">
          {{ todayDate }}
        </p>
        <h1 class="font-sans text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
      </div>
<p>Good Day {{ userEmail }}</p>
      <div class="flex items-center gap-3 w-full md:w-auto">
        <div class="relative group flex-1 md:w-64">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-sky-600 transition-colors" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search..." 
            class="w-full bg-slate-50 h-10 rounded-xl pl-10 pr-4 text-xs font-medium placeholder-slate-400 border-none ring-1 ring-transparent focus:bg-white focus:ring-2 focus:ring-sky-500/20 outline-none transition-all dark:bg-neutral-900 dark:text-white"
          />
        </div>

        <button 
          @click="showCreateModal = true"
          class="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-sky-600 text-white shadow-md shadow-sky-600/20 hover:bg-sky-500 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus class="w-5 h-5" stroke-width="2.5" />
        </button>
      </div>
    </header>

    <div>
      <div class="flex items-center justify-between px-1 mb-3">
        <h2 class="text-sm font-bold text-slate-900 dark:text-white">Active Cycles</h2>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        
        <div 
          v-for="c in activeContainers" 
          :key="c.id"
          @click="openCycle(c)"
          class="group cursor-pointer p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-sky-200 hover:shadow-md transition-all dark:bg-neutral-900 dark:border-neutral-800 dark:hover:border-sky-500/30"
        >
           <div class="mb-3 h-8 w-8 rounded-lg flex items-center justify-center transition-colors" 
             :class="c.type === 'system' ? 'bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400' : 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400'">
             <Clock v-if="c.type === 'system'" class="w-4 h-4" />
             <Folder v-else class="w-4 h-4" />
           </div>
           
           <h3 class="font-bold text-xs text-slate-900 dark:text-white mb-1">{{ c.name }}</h3>
           <p class="text-[10px] text-slate-400">{{ c.count }} Tasks</p>
        </div>

        <button 
          @click="showCreateModal = true"
          class="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 transition-all dark:border-neutral-800 dark:hover:bg-neutral-800"
        >
          <div class="mb-2 h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center dark:bg-neutral-800">
            <Plus class="w-4 h-4" />
          </div>
          <span class="text-[10px] font-bold uppercase tracking-wider">New Cycle</span>
        </button>
      </div>
    </div>

    <div>
       <div class="flex items-center justify-between px-1 mb-3 mt-2">
        <h2 class="text-sm font-bold text-slate-900 dark:text-white">Upcoming Deadlines</h2>
        <button class="text-[10px] font-bold text-slate-400 hover:text-sky-600">View Calendar</button>
      </div>

      <div class="bg-white rounded-xl border border-slate-100 overflow-hidden dark:bg-neutral-900 dark:border-neutral-800">
         <div 
            v-for="task in allTasksSorted" 
            :key="task.id"
            class="flex items-center gap-3 p-3 border-b border-slate-50 last:border-none hover:bg-slate-50 transition-colors dark:border-neutral-800 dark:hover:bg-neutral-800"
         >
            <div class="w-1 h-8 rounded-full" :class="task.priority === 'high' ? 'bg-red-500' : 'bg-slate-200 dark:bg-neutral-700'"></div>
            
            <div class="flex-1 min-w-0">
               <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ task.title }}</h4>
               <p class="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <span class="truncate">{{ task.desc }}</span>
               </p>
            </div>

            <div class="flex items-center gap-3">
               <span class="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase" :class="task.tagClass">{{ task.tag }}</span>
               <div class="text-right">
                  <p class="text-[10px] font-bold text-slate-700 dark:text-slate-300">{{ task.due }}</p>
               </div>
            </div>
         </div>
      </div>
    </div>


    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <div v-if="selectedCycle" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" @click="closeCycle"></div>

        <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden dark:bg-neutral-900 dark:border dark:border-neutral-800">
          
          <div class="px-6 pt-6 pb-4 flex items-start justify-between border-b border-slate-50 dark:border-neutral-800">
            <div>
               <h2 class="font-sans text-xl font-bold text-slate-900 dark:text-white">{{ selectedCycle.name }}</h2>
               <p class="text-xs text-slate-500 mt-1 flex items-center gap-1">
                 <Calendar class="w-3 h-3" /> Expires: {{ selectedCycle.expires }}
               </p>
            </div>
            <button @click="closeCycle" class="p-2 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-neutral-800">
              <X class="w-4 h-4 text-slate-500" />
            </button>
          </div>

          <div class="px-6 py-4 max-h-[50vh] overflow-y-auto space-y-2">
             <div v-for="task in cycleTasks" :key="task.id" class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors dark:bg-neutral-800">
                <Circle class="w-4 h-4 text-slate-300 hover:text-sky-600 cursor-pointer" />
                <div class="flex-1">
                   <h3 class="text-xs font-bold text-slate-900 dark:text-white">{{ task.title }}</h3>
                   <p class="text-[10px] text-slate-500">{{ task.due }}</p>
                </div>
                <ArrowUpRight class="w-3 h-3 text-slate-400" />
             </div>
          </div>

          <div class="p-4 border-t border-slate-50 dark:border-neutral-800">
             <button class="w-full py-3 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 transition-colors flex items-center justify-center gap-2">
               <Plus class="w-4 h-4" /> Add Task
             </button>
          </div>

        </div>
      </div>
    </Transition>

  </div>
</template>