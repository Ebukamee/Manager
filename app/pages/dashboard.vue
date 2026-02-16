<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  Plus,
  Search,
  Clock,
  Folder,
  ChevronRight,
  X,
  Circle,
  Calendar,
  ArrowUpRight,
  Send,
  ChevronDown,
  Trash2,
} from "lucide-vue-next";
import { getFormattedDate, getGreeting, getPeriodEndDate } from "../utilis/helper";
import { authClient } from "~/lib/auth-client";

import ContainerCard from "~/components/ContainerCard.vue";
import TaskListItem from "~/components/TaskListItem.vue";
import TaskAccordionItem from "~/components/TaskAccordionItem.vue";

definePageMeta({
  layout: "app-layout",
  middleware: ["auth", "verified-email"],
});

const searchQuery = ref("");
const showCreateModal = ref(false);
const selectedCycle = ref<any>(null);
const expandedTaskId = ref<string | null>(null);
const session = authClient.useSession();
const isInitialLoading = ref(true);

const newTaskData = ref({
  title: "",
  description: "",
  priority: "medium",
  category: "work",
  dueAt: "",
});

const closeCycle = () => {
  selectedCycle.value = null;
};
const isAddingTask = ref(false);
const isLoading = ref(false);
const newContainer = ref({ name: "", expiresAt: "", type: "custom" });

const userName = computed(() => session.value?.data?.user?.name ?? "there");

const activeContainers = ref<any[]>([]);
const tasks = ref<any[]>([]);
const cycleTasks = ref<any[]>([]);

// --- DATE HELPERS FOR FILTERING ---
const getTodayStr = () => new Date().toISOString().split("T")[0];

const getStartOfWeek = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
  return new Date(now.setDate(diff)).toISOString().split("T")[0];
};

const getTomorrowStr = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
};

const getStartOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
};

const containerTaskCounts = computed(() => {
  const counts: Record<string, number> = {};
  const today = getTodayStr();
  const startWeek = getStartOfWeek();
  const startMonth = getStartOfMonth();
  const tomorrow = getTomorrowStr();

  tasks.value.forEach((task) => {
    const container = activeContainers.value.find((c) => c.id === task.containerId);
    if (!container) return;

    let isValid = false;
    if (container.type === "daily")
      isValid = task.dueAt >= today && task.dueAt <= tomorrow;
    else if (container.type === "weekly") isValid = task.dueAt >= startWeek;
    else if (container.type === "monthly") isValid = task.dueAt >= startMonth;
    else isValid = task.dueAt >= today;

    if (isValid) {
      counts[task.containerId] = (counts[task.containerId] || 0) + 1;
    }
  });
  return counts;
});

const allTasksSorted = computed(() => {
  if (!Array.isArray(tasks.value)) return [];
  const today = getTodayStr();
  const query = searchQuery.value.toLowerCase().trim();

  return tasks.value
    .filter((t) => {
      const isActive = t.status !== "completed" && t.dueAt >= today;
      const matchesSearch =
        t.title.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query);
      return isActive && matchesSearch;
    })
    .sort((a, b) => (a.priority === "high" ? -1 : 1));
});

// Replace the initDashboard logic for containers
const initDashboard = async () => {
  isInitialLoading.value = true;
  try {
    const [containersData, tasksData] = await Promise.all([
      $fetch("/api/containers"),
      $fetch("/api/tasks", { query: { period: "all" } }),
    ]);

    const now = new Date().toISOString().split("T")[0];

    activeContainers.value = (containersData as any[]).filter((c) => {
      if (!c.expiresAt) return true;
      return c.expiresAt >= now;
    });

    tasks.value = tasksData as any[];
  } catch (err) {
    console.error("Dashboard Load Error:", err);
  } finally {
    isInitialLoading.value = false;
  }
};

const createContainer = async () => {
  if (!newContainer.value.name.trim()) return;
  isLoading.value = true;
  try {
    const response = await $fetch("/api/containers/create", {
      method: "POST",
      body: newContainer.value,
    });
    activeContainers.value.push(response);
    showCreateModal.value = false;
    newContainer.value = { name: "", expiresAt: "", type: "custom" };
  } catch (error) {
    console.error("Failed to create container:", error);
  } finally {
    isLoading.value = false;
  }
};
const deleteContainer = async (containerId: string) => {
  if (!confirm("Are you sure? This will delete the cycle and all its tasks.")) return;

  isLoading.value = true;
  try {
    await $fetch(`/api/containers/${containerId}`, { method: "DELETE" });

    activeContainers.value = activeContainers.value.filter((c) => c.id !== containerId);

    if (selectedCycle.value?.id === containerId) {
      selectedCycle.value = null;
    }
  } catch (err) {
    console.error("Failed to delete container:", err);
    alert("Could not delete this cycle.");
  } finally {
    isLoading.value = false;
  }
};

const showCompletedInModal = ref(false);

const filteredCycleTasks = computed(() => {
  if (!selectedCycle.value) return [];
  const today = getTodayStr();
  const startWeek = getStartOfWeek();
  const startMonth = getStartOfMonth();
  const tomorrow = getTomorrowStr();

  // Filter by container ID
  let list = tasks.value.filter(
    (t) => String(t.containerId) === String(selectedCycle.value.id)
  );

  // Filter by current time window
  list = list.filter((t) => {
    const type = selectedCycle.value.type;
    // Daily cutoff now includes Today and Tomorrow
    if (type === "daily") return t.dueAt >= today && t.dueAt <= tomorrow;
    if (type === "weekly") return t.dueAt >= startWeek;
    if (type === "monthly") return t.dueAt >= startMonth;
    return t.dueAt >= today;
  });

  // Apply the "Show Completed" toggle
  if (!showCompletedInModal.value) {
    list = list.filter((t) => t.status !== "completed");
  }

  return list;
});

const openCycle = (container: any) => {
  selectedCycle.value = container;
  isAddingTask.value = false;
  expandedTaskId.value = null;
};

const addTask = async () => {
  if (!newTaskData.value.title.trim() || !selectedCycle.value) return;

  const payload = { ...newTaskData.value };
  const cycleType = selectedCycle.value.type;

  if (cycleType === "daily") {
    // Set dueAt to tomorrow at midnight (00:00:00)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    payload.dueAt = tomorrow.toISOString() as any;
  } else if (payload.dueAt) {
    const taskDate = new Date(payload.dueAt).getTime();

    let limitDate;
    if (cycleType === "custom" && selectedCycle.value.expiresAt) {
      limitDate = new Date(selectedCycle.value.expiresAt).getTime();
    } else {
      const periodEnd = getPeriodEndDate(cycleType);
      limitDate = periodEnd ? new Date(periodEnd).getTime() : null;
    }

    if (limitDate && taskDate > limitDate) {
      alert(`Deadline must be within the current ${cycleType} period.`);
      return;
    }
  }
  isLoading.value = true;
  try {
    const response = await $fetch("/api/tasks/create", {
      method: "POST",
      body: { ...payload, containerId: selectedCycle.value.id },
    });
    tasks.value.push(response);
    newTaskData.value = {
      title: "",
      description: "",
      priority: "medium",
      category: "work",
      dueAt: "",
    };
    isAddingTask.value = false;
  } catch (error) {
    console.error("Task creation failed:", error);
  } finally {
    isLoading.value = false;
  }
};

const todayDate = ref("");
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
    console.error("Failed to update status:", err);
  }
};

const deleteTask = async (taskId: string) => {
  if (!confirm("Are you sure you want to delete this task?")) return;
  try {
    await $fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    tasks.value = tasks.value.filter((t) => t.id !== taskId);
  } catch (err) {
    console.error("Failed to delete task:", err);
  }
};

onMounted(() => {
  todayDate.value = getFormattedDate();
  initDashboard();
});
</script>

<template>
  <div class="flex flex-col gap-8 pt-12 lg:pt-0">
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p
          class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-0.5"
        >
          {{ todayDate }}
        </p>
        <div class="flex items-baseline gap-2 mt-5 font-display">
          <h1 class="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {{ getGreeting() }},
          </h1>
          <span class="text-lg font-medium capitalize text-sky-600">{{ userName }}</span>
        </div>
      </div>
      <div class="flex items-center gap-3 w-full md:w-auto">
        <div class="relative group flex-1 md:w-64">
          <Search
            class="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-sky-600 transition-colors"
          />
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
        <template v-if="isInitialLoading">
          <div
            v-for="i in 4"
            :key="i"
            class="h-32 bg-slate-100 dark:bg-neutral-800 animate-pulse rounded-xl"
          ></div>
        </template>
        <template v-else>
          <ContainerCard
            v-for="c in activeContainers"
            :key="c.id"
            :container="c"
            :taskCount="containerTaskCounts[c.id] || 0"
            @click="openCycle(c)"
          />
        </template>
        <button
          @click="showCreateModal = true"
          class="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 transition-all dark:border-neutral-800 dark:hover:bg-neutral-800"
        >
          <div
            class="mb-2 h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center dark:bg-neutral-800"
          >
            <Plus class="w-4 h-4" />
          </div>
          <span class="text-[10px] font-bold uppercase tracking-wider">New Cycle</span>
        </button>
      </div>
    </div>

    <div>
      <div class="flex items-center justify-between px-1 mb-3 mt-2">
        <h2 class="text-sm font-bold text-slate-900 dark:text-white">
          Upcoming Deadlines
        </h2>
        <button class="text-[10px] font-bold text-slate-400 hover:text-sky-600">
          View Calendar
        </button>
      </div>
      <div
        class="bg-white rounded-xl border border-slate-100 overflow-hidden dark:bg-neutral-900 dark:border-neutral-800"
      >
        <template v-if="isInitialLoading">
          <div
            v-for="i in 3"
            :key="i"
            class="h-16 bg-slate-50 dark:bg-neutral-800/50 animate-pulse border-b border-slate-50 dark:border-neutral-800"
          ></div>
        </template>
        <template v-else>
          <TaskListItem v-for="task in allTasksSorted" :key="task.id" :task="task" />
        </template>
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
        v-if="showCreateModal"
        class="fixed inset-0 z-[110] flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          @click="showCreateModal = false"
        ></div>
        <div
          class="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden dark:bg-neutral-900"
        >
          <div
            class="p-6 border-b border-slate-50 dark:border-neutral-800 flex items-center justify-between"
          >
            <h2 class="font-bold text-lg dark:text-white uppercase tracking-tight">
              New Project
            </h2>
            <button
              @click="showCreateModal = false"
              class="p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <X class="w-4 h-4 text-slate-400" />
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label
                class="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1"
                >Cycle Name</label
              >
              <input
                v-model="newContainer.name"
                type="text"
                placeholder="Project name..."
                class="w-full h-11 bg-slate-50 dark:bg-neutral-800 rounded-xl px-4 text-xs font-medium focus:ring-2 focus:ring-sky-500/20 outline-none dark:text-white"
              />
            </div>
            <div class="grid grid-cols-1 gap-3">
              <div>
                <label
                  class="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1"
                  >Expiry</label
                >
                <input
                  v-model="newContainer.expiresAt"
                  type="date"
                  class="w-full h-11 bg-slate-50 dark:bg-neutral-800 rounded-xl px-3 text-xs font-bold text-slate-600 dark:text-slate-300 outline-none border-none"
                />
              </div>
            </div>
          </div>
          <div class="p-6 pt-0">
            <button
              @click="createContainer"
              :disabled="isLoading"
              class="w-full h-11 bg-sky-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-600/20 hover:bg-sky-500 transition-all flex items-center justify-center gap-2"
            >
              <Plus v-if="!isLoading" class="w-4 h-4" />
              {{ isLoading ? "Creating..." : "Create Cycle" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <div
        v-if="selectedCycle"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
          @click="closeCycle"
        ></div>
        <div
          class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden dark:bg-neutral-900 dark:border dark:border-neutral-800"
        >
          <div
            class="px-6 pt-6 pb-4 flex items-start justify-between border-b border-slate-50 dark:border-neutral-800"
          >
            <div>
              <h2 class="font-sans text-xl font-bold text-slate-900 dark:text-white">
                {{ selectedCycle.name }}
              </h2>
              <p class="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Calendar class="w-3 h-3" /> Expires:
                {{
                  selectedCycle.expiresAt
                    ? new Date(selectedCycle.expiresAt).toLocaleDateString()
                    : "Permanent"
                }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button
                v-if="selectedCycle.type === 'custom'"
                @click="deleteContainer(selectedCycle.id)"
                class="p-2 rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                title="Delete Cycle"
              >
                <Trash2 class="w-4 h-4" />
              </button>

              <button
                @click="closeCycle"
                class="p-2 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-neutral-800"
              >
                <X class="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>

          <div
            class="px-6 pt-2 pb-2 flex items-center justify-between bg-slate-50/50 dark:bg-neutral-800/30"
          >
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {{ showCompletedInModal ? "Showing All Tasks" : "Hiding Completed" }}
            </p>
            <button
              @click="showCompletedInModal = !showCompletedInModal"
              class="text-[10px] font-bold text-sky-600 hover:text-sky-500 transition-colors uppercase"
            >
              {{ showCompletedInModal ? "Hide Completed" : "Show Completed" }}
            </button>
          </div>

          <div class="px-6 py-4 max-h-[40vh] overflow-y-auto space-y-2">
            <TaskAccordionItem
              v-for="task in filteredCycleTasks"
              :key="task.id"
              :task="task"
              :isExpanded="expandedTaskId === task.id"
              @toggle="expandedTaskId = expandedTaskId === task.id ? null : task.id"
              @toggleStatus="toggleTaskStatus(task)"
              @delete="deleteTask(task.id)"
            />
            <p
              v-if="filteredCycleTasks.length === 0"
              class="text-center py-4 text-xs text-slate-400"
            >
              {{ showCompletedInModal ? "No tasks found." : "All tasks caught up!" }}
            </p>
          </div>

          <div class="p-4 border-t border-slate-50 dark:border-neutral-800">
            <div
              v-if="isAddingTask"
              class="max-h-[30vh] overflow-y-auto pr-1 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2"
            >
              <div>
                <label
                  class="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block"
                  >Task Title</label
                >
                <input
                  v-model="newTaskData.title"
                  type="text"
                  placeholder="Task title..."
                  class="w-full bg-slate-50 h-10 rounded-xl px-4 text-xs font-medium focus:ring-2 focus:ring-sky-500/20 outline-none dark:bg-neutral-800 dark:text-white"
                />
              </div>
              <div>
                <label
                  class="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block"
                  >Description</label
                >
                <textarea
                  v-model="newTaskData.description"
                  placeholder="Add description..."
                  class="w-full bg-slate-50 p-3 rounded-xl text-xs font-medium focus:ring-2 focus:ring-sky-500/20 outline-none dark:bg-neutral-800 dark:text-white h-16 resize-none"
                ></textarea>
              </div>
              <div class="flex gap-2">
                <div class="flex-1">
                  <label
                    class="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block"
                    >Priority</label
                  >
                  <select
                    v-model="newTaskData.priority"
                    class="w-full bg-slate-50 h-9 rounded-xl px-2 text-[10px] font-bold text-slate-500 dark:bg-neutral-800 border-none outline-none"
                  >
                    <option value="low">LOW PRIORITY</option>
                    <option value="medium">MED PRIORITY</option>
                    <option value="high">HIGH PRIORITY</option>
                  </select>
                </div>
                <div class="flex-1">
                  <label
                    class="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block"
                    >Category</label
                  >
                  <select
                    v-model="newTaskData.category"
                    class="w-full bg-slate-50 h-9 rounded-xl px-2 text-[10px] font-bold text-slate-500 dark:bg-neutral-800 border-none outline-none"
                  >
                    <option
                      v-for="cat in ['work', 'personal', 'health', 'finance']"
                      :key="cat"
                      :value="cat"
                    >
                      {{ cat.toUpperCase() }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <div v-if="selectedCycle.type !== 'daily'" class="flex-1">
                  <label
                    class="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block"
                    >Expiry Date</label
                  >
                  <div class="relative">
                    <Calendar
                      class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
                    />
                    <input
                      v-model="newTaskData.dueAt"
                      type="date"
                      :min="getTodayStr()"
                      :max="
                        selectedCycle.type === 'custom'
                          ? selectedCycle.expiresAt
                            ? new Date(selectedCycle.expiresAt)
                                .toISOString()
                                .split('T')[0]
                            : undefined
                          : getPeriodEndDate(selectedCycle.type)
                      "
                      class="w-full bg-slate-50 h-10 rounded-xl pl-9 pr-3 text-xs dark:bg-neutral-800 outline-none"
                    />
                  </div>
                </div>
                <div
                  v-else
                  class="flex-1 flex items-center h-10 px-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20"
                >
                  <span
                    class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest"
                    >Due: Tonight</span
                  >
                </div>
                <button
                  @click="addTask"
                  :disabled="isLoading"
                  class="h-10 w-12 flex items-center justify-center rounded-xl bg-sky-600 text-white disabled:opacity-50 self-end transition-all hover:bg-sky-500"
                >
                  <Send v-if="!isLoading" class="w-4 h-4" />
                  <div
                    v-else
                    class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  ></div>
                </button>
              </div>
            </div>
            <button
              v-else
              @click="isAddingTask = true"
              class="w-full py-3 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 transition-colors flex items-center justify-center gap-2"
            >
              <Plus class="w-4 h-4" /> Add Task
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
