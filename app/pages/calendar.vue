<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Circle,
  Clock,
  X,
  Tag,
  Hash,
  ArrowRight,
} from "lucide-vue-next";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  parseISO,
} from "date-fns";

definePageMeta({ layout: "app-layout", middleware: ["auth", "verified-email"] });

const tasks = ref<any[]>([]);
const isLoading = ref(true);
const currentMonth = ref(new Date());
const selectedTask = ref<any>(null); // For the Detail Modal

const fetchData = async () => {
  isLoading.value = true;
  try {
    const data = await $fetch("/api/tasks");
    tasks.value = data as any[];
  } catch (err) {
    console.error("Calendar fetch error:", err);
  } finally {
    // Small timeout so the skeleton isn't just a flash
    setTimeout(() => {
      isLoading.value = false;
    }, 600);
  }
};

// --- CALENDAR ENGINE ---
const calendarDays = computed(() => {
  const start = startOfWeek(startOfMonth(currentMonth.value), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(currentMonth.value), { weekStartsOn: 1 });

  return eachDayOfInterval({ start, end }).map((day) => ({
    date: day,
    dayNumber: format(day, "d"),
    isCurrentMonth: isSameMonth(day, currentMonth.value),
    isToday: isToday(day),
    dateStr: format(day, "yyyy-MM-dd"),
  }));
});

const tasksByDate = computed(() => {
  const map: Record<string, any[]> = {};
  tasks.value.forEach((task) => {
    const d = task.dueAt ? task.dueAt.split("T")[0] : null;
    if (d) {
      if (!map[d]) map[d] = [];
      map[d].push(task);
    }
  });
  return map;
});

const nextMonth = () => (currentMonth.value = addMonths(currentMonth.value, 1));
const prevMonth = () => (currentMonth.value = subMonths(currentMonth.value, 1));
const goToToday = () => (currentMonth.value = new Date());

onMounted(() => fetchData());
</script>

<template>
  <div class="flex flex-col gap-6 pt-6 pb-12 max-w-7xl mx-auto px-4">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
      <div>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
          Task Calendar
        </p>
      </div>

      <div class="flex items-center gap-4">
        <h2
          class="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]"
        >
          {{ format(currentMonth, "MMMM yyyy") }}
        </h2>

        <div
          class="flex items-center bg-slate-100 dark:bg-neutral-800 p-1 rounded-xl border border-slate-200 dark:border-neutral-700"
        >
          <button
            @click="prevMonth"
            class="p-1.5 hover:bg-white dark:hover:bg-neutral-700 rounded-lg transition-all"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <button
            @click="goToToday"
            class="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest hover:text-sky-600 dark:hover:text-white"
          >
            Today
          </button>
          <button
            @click="nextMonth"
            class="p-1.5 hover:bg-white dark:hover:bg-neutral-700 rounded-lg transition-all"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <div
      class="bg-white dark:bg-neutral-900 border border-white dark:border-neutral-900 rounded-lg overflow-hidden shadow-sm"
    >
      <div
        class="grid grid-cols-7 border-b border-slate-50 dark:border-neutral-800 bg-sky-600"
      >
        <div
          v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
          :key="day"
          class="py-4 text-center text-[10px] font-black text-sky-50 uppercase tracking-[0.2em]"
        >
          {{ day }}
        </div>
      </div>

      <div v-if="isLoading" class="grid grid-cols-7 auto-rows-[minmax(140px,1fr)]">
        <div
          v-for="i in 35"
          :key="i"
          class="p-4 border-r border-b border-slate-50 dark:border-neutral-800 animate-pulse"
        >
          <div class="w-6 h-6 bg-slate-100 dark:bg-neutral-800 rounded mb-4"></div>
          <div class="space-y-2">
            <div class="h-6 bg-slate-50 dark:bg-neutral-800/50 rounded-lg w-full"></div>
            <div class="h-6 bg-slate-50 dark:bg-neutral-800/50 rounded-lg w-2/3"></div>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-7 auto-rows-[minmax(140px,1fr)]">
        <div
          v-for="day in calendarDays"
          :key="day.dateStr"
          :class="[
            'p-3 border-r border-b border-slate-50 dark:border-neutral-800 transition-all relative',
            !day.isCurrentMonth
              ? 'bg-slate-50/20 dark:bg-neutral-900/40 opacity-40'
              : 'bg-white dark:bg-neutral-900',
          ]"
        >
          <div class="flex justify-between items-center mb-3">
            <span
              :class="[
                'text-xs font-black w-7 h-7 flex items-center justify-center rounded-lg transition-all',
                day.isToday
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/40 scale-110'
                  : day.isCurrentMonth
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-300 dark:text-neutral-700',
              ]"
            >
              {{ day.dayNumber }}
            </span>
          </div>

          <div class="space-y-1.5 overflow-y-auto max-h-[100px] pr-1 custom-scrollbar">
            <div
              v-for="task in tasksByDate[day.dateStr]"
              :key="task.id"
              @click="selectedTask = task"
              class="group flex flex-col p-2 rounded-lg bg-slate-50 dark:bg-neutral-800/50 border border-slate-100 dark:border-neutral-800 hover:border-sky-500/50 transition-all cursor-pointer hover:translate-x-0.5"
            >
              <div class="flex items-center gap-1.5">
                <Circle
                  :class="[
                    'w-1.5 h-1.5',
                    task.status === 'completed' ? 'text-emerald-500' : 'text-sky-500',
                  ]"
                  fill="currentColor"
                />
                <span
                  class="text-[9px] font-bold text-slate-700 dark:text-slate-300 truncate uppercase tracking-tight"
                >
                  {{ task.title }}
                </span>
              </div>
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
      <div
        v-if="selectedTask"
        class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm"
      >
        <div class="absolute inset-0" @click="selectedTask = null"></div>

        <div
          class="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-neutral-800"
        >
          <div
            class="p-6 border-b border-slate-50 dark:border-neutral-800 flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <div
                :class="[
                  'w-2 h-2 rounded-full',
                  selectedTask.status === 'completed' ? 'bg-emerald-500' : 'bg-sky-500',
                ]"
              ></div>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                >Task Details</span
              >
            </div>
            <button
              @click="selectedTask = null"
              class="p-2 rounded-full bg-slate-50 dark:bg-neutral-800 hover:bg-slate-100 transition-colors"
            >
              <X class="w-4 h-4 text-slate-500" />
            </button>
          </div>

          <div class="p-8">
            <div
              :class="[
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.1em] mb-4',
                selectedTask.priority === 'high'
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10'
                  : 'bg-sky-50 text-sky-600 dark:bg-sky-500/10',
              ]"
            >
              <Hash class="w-2.5 h-2.5" />
              {{ selectedTask.priority }} Priority
            </div>

            <h3
              class="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-4"
            >
              {{ selectedTask.title }}
            </h3>

            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
              {{
                selectedTask.description ||
                "No additional details provided for this task."
              }}
            </p>

            <div
              class="grid grid-cols-2 gap-4 pt-8 border-t border-slate-50 dark:border-neutral-800"
            >
              <div class="flex flex-col gap-1">
                <span
                  class="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"
                >
                  <Clock class="w-2.5 h-2.5" /> Deadline
                </span>
                <span class="text-[10px] font-bold text-slate-700 dark:text-slate-200">
                  {{ format(new Date(selectedTask.dueAt), "MMM do, yyyy") }}
                </span>
              </div>
              <div class="flex flex-col gap-1">
                <span
                  class="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"
                >
                  <Tag class="w-2.5 h-2.5" /> Category
                </span>
                <span
                  class="text-[10px] font-bold text-slate-700 dark:text-slate-200 capitalize"
                >
                  {{ selectedTask.category || "General" }}
                </span>
              </div>
            </div>
          </div>

          <div class="p-4 bg-slate-50/50 dark:bg-neutral-800/30 flex justify-end">
            <button
              @click="selectedTask = null"
              class="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              Close View <ArrowRight class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #262626;
}

/* Grid line consistency */
.grid > div {
  margin-right: -1px;
  margin-bottom: -1px;
}
</style>
