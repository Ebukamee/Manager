<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  Search,
  X,
  Circle,
  ChevronDown,
  Calendar,
  ArrowUpRight,
  Send,
  Briefcase,
  User,
  HeartPulse,
  Wallet,
} from "lucide-vue-next";
import { getFormattedDate, getGreeting, getCategoryClass } from "../utilis/helper";
import TaskAccordionItem from "~/components/TaskAccordionItem.vue";

definePageMeta({
  layout: "app-layout",
  middleware: ["auth", "verified-email"],
});

// --- STATE ---
const tasks = ref<any[]>([]);
const selectedCategory = ref<string | null>(null);
const expandedTaskId = ref<string | null>(null);
const showCompletedInModal = ref(false);
const isInitialLoading = ref(true);

// --- CONFIG ---
const categoryCards = [
  {
    name: "Work",
    icon: Briefcase,
    color: "bg-sky-500",
    lightColor: "bg-sky-50",
    textColor: "text-sky-600",
  },
  {
    name: "Personal",
    icon: User,
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    textColor: "text-purple-600",
  },
  {
    name: "Health",
    icon: HeartPulse,
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    name: "Finance",
    icon: Wallet,
    color: "bg-rose-500",
    lightColor: "bg-rose-50",
    textColor: "text-rose-600",
  },
];

// --- LOGIC ---
const initCategories = async () => {
  isInitialLoading.value = true;
  try {
    tasks.value = await $fetch("/api/tasks");
  } catch (err) {
    console.error("Failed to load tasks:", err);
  } finally {
    isInitialLoading.value = false;
  }
};

const filteredCategoryTasks = computed(() => {
  if (!selectedCategory.value) return [];
  let catTasks = tasks.value.filter(
    (t) => t.category?.toLowerCase() === selectedCategory.value?.toLowerCase()
  );

  if (!showCompletedInModal.value) {
    catTasks = catTasks.filter((t) => t.status !== "completed");
  }
  return catTasks;
});

const toggleTaskStatus = async (taskItem: any) => {
  const newStatus = taskItem.status === "completed" ? "pending" : "completed";
  taskItem.status = newStatus;
  try {
    await $fetch(`/api/tasks/${taskItem.id}`, {
      method: "PATCH",
      body: { status: newStatus },
    });
  } catch (err) {
    taskItem.status = taskItem.status === "completed" ? "pending" : "completed";
  }
};

const deleteTask = async (taskId: string) => {
  if (!confirm("Delete this task?")) return;
  try {
    await $fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    tasks.value = tasks.value.filter((t) => t.id !== taskId);
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => initCategories());
</script>

<template>
  <div class="flex flex-col gap-8 pt-12 lg:pt-0">
    <header>
      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
        CATEGORIES
      </p>
    </header>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="cat in categoryCards"
        :key="cat.name"
        @click="selectedCategory = cat.name"
        class="group cursor-pointer p-6 bg-white rounded-xl border border-white shadow-sm hover:border-[#fefefe] hover:shadow-md transition-all dark:bg-neutral-900 dark:border-neutral-900"
      >
        <div
          :class="[cat.lightColor, cat.textColor]"
          class="mb-4 h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
        >
          <component :is="cat.icon" class="w-6 h-6" />
        </div>
        <h3 class="font-bold text-sm text-slate-900 dark:text-white">{{ cat.name }}</h3>
        <p class="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tight">
          Focus Area
        </p>
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
        v-if="selectedCategory"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
          @click="selectedCategory = null"
        ></div>
        <div
          class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden dark:bg-neutral-900 dark:border dark:border-neutral-800"
        >
          <div
            class="px-6 pt-6 pb-4 flex items-start justify-between border-b border-slate-50 dark:border-neutral-800"
          >
            <div>
              <h2 class="font-sans text-xl font-bold text-slate-900 dark:text-white">
                {{ selectedCategory }}
              </h2>
              <p class="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">
                Global Category View
              </p>
            </div>
            <button
              @click="selectedCategory = null"
              class="p-2 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-neutral-800"
            >
              <X class="w-4 h-4 text-slate-500" />
            </button>
          </div>

          <div
            class="px-6 py-2 flex items-center justify-between bg-slate-50/50 dark:bg-neutral-800/30"
          >
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {{ showCompletedInModal ? "Showing All" : "Hiding Completed" }}
            </p>
            <button
              @click="showCompletedInModal = !showCompletedInModal"
              class="text-[10px] font-bold text-sky-600 uppercase"
            >
              {{ showCompletedInModal ? "Hide Done" : "Show Done" }}
            </button>
          </div>

          <div class="px-6 py-4 max-h-[50vh] overflow-y-auto space-y-2">
            <TaskAccordionItem
              v-for="task in filteredCategoryTasks"
              :key="task.id"
              :task="task"
              :isExpanded="expandedTaskId === task.id"
              @toggle="expandedTaskId = expandedTaskId === task.id ? null : task.id"
              @toggleStatus="toggleTaskStatus(task)"
              @delete="deleteTask(task.id)"
            />
            <p
              v-if="filteredCategoryTasks.length === 0"
              class="text-center py-8 text-xs text-slate-400 font-medium"
            >
              No tasks found in {{ selectedCategory }}.
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
