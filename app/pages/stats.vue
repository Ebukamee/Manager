<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ChevronDown } from "lucide-vue-next";

ChartJS.register(ArcElement, Tooltip, Legend);

definePageMeta({ layout: "app-layout", middleware: ["auth"] });

const tasks = ref<any[]>([]);
const containers = ref<any[]>([]);
const isLoading = ref(true);

// --- FILTERS ---
const activePeriod = ref<"all" | "daily" | "weekly" | "monthly" | "custom">("all");
const selectedContainerId = ref<string | null>(null);
const activeCategory = ref("All");

const fetchData = async () => {
  isLoading.value = true;
  try {
    const [taskRes, containerRes] = await Promise.all([
      $fetch("/api/tasks"),
      $fetch("/api/containers"),
    ]);
    tasks.value = taskRes;
    containers.value = containerRes;

    // DEBUG: Check data structure
    console.log("Tasks sample:", tasks.value.slice(0, 3));
    console.log("Containers sample:", containers.value.slice(0, 3));
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

// Helper function to find task's container
const findTaskContainer = (task: any) => {
  // Try multiple possible field names
  const possibleIds = [
    task.containerId,
    task.container_id,
    task.containerID,
    task.parentId,
    task.parent_id,
    task.listId,
    task.list_id,
  ];

  for (const id of possibleIds) {
    if (id) {
      const found = containers.value.find(
        (c) => String(c.id) === String(id) || String(c._id) === String(id)
      );
      if (found) return found;
    }
  }

  return null;
};

const processedStats = computed(() => {
  if (!tasks.value.length) return { completed: 0, pending: 0, expired: 0, total: 0 };

  let list = [...tasks.value];

  // 1. Category Filter
  if (activeCategory.value !== "All") {
    list = list.filter(
      (t) =>
        t.category?.toLowerCase().trim() === activeCategory.value.toLowerCase().trim()
    );
  }

  // 2. Period Filter
  if (activePeriod.value !== "all") {
    list = list.filter((t) => {
      const parent = findTaskContainer(t);

      // If no parent container found, check if task itself has a type/period property
      if (!parent) {
        // Maybe tasks have their own type/period field?
        const taskType = t.type || t.period || t.frequency;
        if (taskType) {
          if (activePeriod.value === "custom") {
            return taskType === "custom";
          }
          return taskType === activePeriod.value;
        }
        return false; // No parent and no type field
      }

      // Handle custom container selection
      if (activePeriod.value === "custom") {
        if (selectedContainerId.value) {
          return (
            String(t.containerId || t.container_id) === String(selectedContainerId.value)
          );
        }
        return parent.type === "custom";
      }

      // Match parent type
      return parent.type === activePeriod.value;
    });
  }

  // 3. Status Counts
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
  <!-- Same template as before -->
  <div class="flex flex-col gap-6 pt-6 pb-12 max-w-7xl mx-auto px-4">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
      <div>
        <h1
          class="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight"
        >
          Analytics Center
        </h1>
        <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
          Performance Breakdown
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
