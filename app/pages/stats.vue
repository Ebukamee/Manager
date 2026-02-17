<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ChevronDown } from "lucide-vue-next";

ChartJS.register(ArcElement, Tooltip, Legend);

definePageMeta({ layout: "app-layout", middleware: ["auth", "verified-email"] });

const tasks = ref<any[]>([]);
const containers = ref<any[]>([]);
const isLoading = ref(true);

// --- FILTERS ---
const activePeriod = ref<"all" | "daily" | "weekly" | "monthly" | "custom">("all");
const selectedContainerId = ref<string | null>(null);
const activeCategory = ref("All");

const getLocalToday = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().split("T")[0];
};

const getTomorrowStr = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
};

const getLocalStartOfWeek = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  const offset = monday.getTimezoneOffset() * 60000;
  return new Date(monday.getTime() - offset).toISOString().split("T")[0];
};

const getLocalStartOfMonth = () => {
  const d = new Date();
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const offset = first.getTimezoneOffset() * 60000;
  return new Date(first.getTime() - offset).toISOString().split("T")[0];
};

const fetchData = async () => {
  isLoading.value = true;
  try {
    const [taskRes, containerRes] = await Promise.all([
      $fetch("/api/tasks"),
      $fetch("/api/containers"),
    ]);
    tasks.value = taskRes;
    containers.value = containerRes;
  } catch (err) {
    console.error("Data fetch error:", err);
  } finally {
    isLoading.value = false;
  }
};

const isTaskExpired = (task: any) => {
  if (task.status === "completed" || !task.dueAt) return false;
  const due = new Date(task.dueAt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
};

const customContainers = computed(() => {
  return containers.value.filter((c) => c.type === "custom");
});

const setActivePeriod = (period: string) => {
  activePeriod.value = period as any;
  if (period !== "custom") {
    selectedContainerId.value = null;
  }
};

watch(selectedContainerId, (newVal) => {
  if (newVal) {
    activePeriod.value = "custom";
  }
});

const findTaskContainer = (task: any) => {
  const possibleIds = [task.containerId, task.container_id, task.containerID];
  for (const id of possibleIds) {
    if (id) {
      const found = containers.value.find((c) => String(c.id) === String(id));
      if (found) return found;
    }
  }
  return null;
};

const processedStats = computed(() => {
  if (!tasks.value.length) return { completed: 0, pending: 0, expired: 0, total: 0 };

  const today : any = getLocalToday();
  const tomorrow : any = getTomorrowStr();
  const startWeek: any= getLocalStartOfWeek();
  const startMonth : any = getLocalStartOfMonth();

  // DASHBOARD STYLE FILTERING + CREATION DATE CHECK
  let list = tasks.value.filter((t) => {
    // Category Filter
    if (activeCategory.value !== "All") {
      if (t.category?.toLowerCase() !== activeCategory.value.toLowerCase()) return false;
    }

    const container = findTaskContainer(t);
    if (!container) return false;

    // Get the container's creation date (YYYY-MM-DD)
    const containerCreated = container.createdAt
      ? container.createdAt.split("T")[0]
      : "0000-00-00";

    // Specific Container Selection (Overwrites period logic)
    if (activePeriod.value === "custom" && selectedContainerId.value) {
      return String(container.id) === String(selectedContainerId.value);
    }

    // Tab Filter (Daily, Weekly, Monthly)
    if (activePeriod.value !== "all" && container.type !== activePeriod.value) {
      return false;
    }

    // Strict Time Window Logic (Using Task DueAt AND Container CreatedAt)
    if (container.type === "daily") {
      return t.dueAt >= today  && t.dueAt <= tomorrow;
    }

    if (container.type === "weekly") {
      return t.dueAt >= startWeek;
    }

    if (container.type === "monthly") {
      return t.dueAt >= startMonth && containerCreated >= startMonth;
    }

    if (container.type === "custom") {
      // Hides custom containers created in previous months (like Jan in Feb)
      return t.dueAt >= today && containerCreated >= startMonth;
    }

    // Default for 'all' period: show only today onwards
    return t.dueAt >= today;
  });

  const completed = list.filter((t) => t.status === "completed").length;
  const expired = list.filter((t) => isTaskExpired(t)).length;
  const pending = list.length - (completed + expired);

  return { completed, pending, expired, total: list.length };
});

const pieData = computed(() => ({
  labels: ["Done", "Pending", "Expired"],
  datasets: [
    {
      data: [
        processedStats.value.completed,
        processedStats.value.pending,
        processedStats.value.expired,
      ],
      backgroundColor: ["#0ea5e9", "#cbd5e1", "#f43f5e"],
      borderWidth: 0,
      hoverOffset: 4,
    },
  ],
}));

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  cutout: "75%",
};

onMounted(() => fetchData());
</script>

<template>
  <div class="flex flex-col gap-6 pt-6 pb-12 max-w-7xl mx-auto px-4">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
      <div>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
          Stats and Analytics
        </p>
      </div>

      <div
        class="flex bg-slate-100 dark:bg-neutral-800 p-1 rounded-xl border border-slate-200 dark:border-neutral-700"
      >
        <button
          v-for="p in ['all', 'daily', 'weekly', 'monthly']"
          :key="p"
          @click="setActivePeriod(p)"
          :class="[
            'px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all',
            activePeriod === p
              ? 'bg-white text-slate-900 shadow-sm dark:bg-neutral-700 dark:text-white'
              : 'text-slate-500 hover:text-slate-700',
          ]"
        >
          {{ p }}
        </button>

        <div class="relative ml-1">
          <select
            v-model="selectedContainerId"
            :class="[
              'pl-3 pr-8 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-lg appearance-none bg-transparent outline-none cursor-pointer',
              activePeriod === 'custom'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-neutral-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-700',
            ]"
          >
            <option :value="null">Custom</option>
            <option v-for="c in customContainers" :key="c.id" :value="c.id">
              {{ c.name }}
            </option>
          </select>
          <ChevronDown
            class="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none"
          />
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="i in 4"
        :key="i"
        class="h-24 bg-slate-100 dark:bg-neutral-800/50 animate-pulse rounded-2xl"
      ></div>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="m in [
          {
            label: 'Total Tasks',
            val: processedStats.total,
            color: 'text-slate-900 dark:text-white',
          },
          { label: 'Completed', val: processedStats.completed, color: 'text-sky-600' },
          { label: 'Ongoing', val: processedStats.pending, color: 'text-slate-400' },
          { label: 'Lapsed', val: processedStats.expired, color: 'text-rose-500' },
        ]"
        :key="m.label"
        class="p-5 bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 rounded-xl shadow-sm"
      >
        <p class="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">
          {{ m.label }}
        </p>
        <p :class="['text-2xl font-black tracking-tighter', m.color]">{{ m.val }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div
        class="lg:col-span-2 bg-white dark:bg-neutral-900 p-8 rounded-xl border border-slate-100 dark:border-neutral-800 h-[450px] flex flex-col shadow-sm"
      >
        <div
          v-if="isLoading"
          class="h-full w-full bg-slate-50 dark:bg-neutral-800/30 animate-pulse rounded-xl"
        ></div>
        <template v-else>
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              Volume Distribution
            </h3>
            <select
              v-model="activeCategory"
              class="text-[10px] font-bold uppercase tracking-widest bg-slate-100 dark:bg-neutral-800 px-3 py-1.5 rounded-lg border-none outline-none"
            >
              <option value="All">All Categories</option>
              <option
                v-for="cat in ['Work', 'Personal', 'Health', 'Finance']"
                :value="cat"
              >
                {{ cat }}
              </option>
            </select>
          </div>
          <div class="flex-1">
            <ClientOnly>
              <AnalyticsChart
                :completed="processedStats.completed"
                :pending="processedStats.pending"
                :expired="processedStats.expired"
              />
            </ClientOnly>
          </div>
        </template>
      </div>

      <div
        class="bg-white dark:bg-neutral-900 p-8 rounded-xl border border-slate-100 dark:border-neutral-800 h-[450px] flex flex-col items-center justify-center text-center shadow-sm"
      >
        <div
          v-if="isLoading"
          class="h-48 w-48 bg-slate-50 dark:bg-neutral-800/30 animate-pulse rounded-full"
        ></div>
        <template v-else>
          <h3
            class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-12"
          >
            Efficiency Ratio
          </h3>
          <div class="relative h-48 w-48">
            <ClientOnly>
              <Doughnut :data="pieData" :options="pieOptions" />
            </ClientOnly>
            <div
              class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            >
              <span
                class="text-3xl font-black text-slate-900 dark:text-white leading-none"
              >
                {{
                  Math.round(
                    (processedStats.completed / (processedStats.total || 1)) * 100
                  )
                }}%
              </span>
              <span
                class="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-2"
                >Success</span
              >
            </div>
          </div>
          <div class="mt-10 space-y-2.5 w-full">
            <div
              v-for="item in [
                { l: 'Done', v: processedStats.completed, c: 'bg-sky-500' },
                { l: 'Pending', v: processedStats.pending, c: 'bg-slate-300' },
                { l: 'Expired', v: processedStats.expired, c: 'bg-rose-500' },
              ]"
              :key="item.l"
              class="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest px-4"
            >
              <div class="flex items-center gap-2.5">
                <div :class="['w-2 h-2 rounded-sm', item.c]"></div>
                <span class="text-slate-500">{{ item.l }}</span>
              </div>
              <span class="text-slate-900 dark:text-white font-black">{{ item.v }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
