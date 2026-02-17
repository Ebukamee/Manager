<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  User,
  Mail,
  ShieldAlert,
  Trash2,
  Save,
  UserCircle,
  Briefcase,
  Info,
  Flame,
  CheckCircle2,
  XCircle,
  Lock,
} from "lucide-vue-next";
import { authClient } from "~/lib/auth-client";

definePageMeta({ layout: "app-layout", middleware: ["auth", "verified-email"] });

const session = authClient.useSession();
const isLoading = ref(false);
const isDeleting = ref(false);
const showDeleteModal = ref(false);
const message = ref({ text: "", type: "" });

const form = ref({
  name: "",
  email: "",
  bio: "",
  role: "",
  roastLevel: "",
});

const passwordData = ref({
  current: "",
  new: "",
  confirm: "",
});

const fillForm = (userData: any) => {
  if (!userData) return;
  form.value.name = userData.name || "";
  form.value.email = userData.email || "";
  form.value.bio = userData.bio || "";
  form.value.role = userData.jobTitle || "";
  form.value.roastLevel = userData.roastLevel || "";
};

watch(
  () => session.value?.data?.user,
  (newUser) => {
    if (newUser) {
      fillForm(newUser);
    }
  },
  { immediate: true, deep: true }
);

const isGoogleUser = computed(() => {
  return !!session.value?.data?.user?.image?.includes("googleusercontent.com");
});

const roastOptions = [
  {
    id: "gentle",
    label: "Gentle",
    desc: "Supportive & kind.",
    color: "text-emerald-500",
    border: "hover:border-emerald-500/50",
    active: "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5",
  },
  {
    id: "firm",
    label: "Firm",
    desc: "Strict but fair.",
    color: "text-sky-500",
    border: "hover:border-sky-500/50",
    active: "border-sky-500 bg-sky-50/50 dark:bg-sky-500/5",
  },
  {
    id: "toxic",
    label: "Toxic",
    desc: "Passive aggressive.",
    color: "text-orange-500",
    border: "hover:border-orange-500/50",
    active: "border-orange-500 bg-orange-50/50 dark:bg-orange-500/5",
  },
  {
    id: "unhinged",
    label: "Unhinged",
    desc: "Pure emotional damage.",
    color: "text-rose-500",
    border: "hover:border-rose-500/50",
    active: "border-rose-500 bg-rose-50/50 dark:bg-rose-500/5",
  },
];

const updateProfile = async () => {
  isLoading.value = true;
  try {
    const { data, error } = await authClient.updateUser({
      name: form.value.name,
      jobTitle: form.value.role,
      bio: form.value.bio,
      roastLevel: form.value.roastLevel,
    } as any);
    if (error) throw error;
    message.value = { text: "Settings saved!", type: "success" };
  } catch (err: any) {
    message.value = { text: err.message || "Update failed", type: "error" };
  } finally {
    isLoading.value = false;
    setTimeout(() => {
      message.value = { text: "", type: "" };
    }, 3000);
  }
};

const changePassword = async () => {
  if (passwordData.value.new !== passwordData.value.confirm) {
    message.value = { text: "Passwords do not match", type: "error" };
    return;
  }
  isLoading.value = true;
  try {
    const { error } = await authClient.changePassword({
      newPassword: passwordData.value.new,
      currentPassword: passwordData.value.current,
      revokeOtherSessions: true,
    });
    if (error) throw error;
    message.value = { text: "Password updated!", type: "success" };
    passwordData.value = { current: "", new: "", confirm: "" };
  } catch (err: any) {
    message.value = { text: err.message || "Failed to change password", type: "error" };
  } finally {
    isLoading.value = false;
    setTimeout(() => {
      message.value = { text: "", type: "" };
    }, 3000);
  }
};

const deleteAccount = async () => {
  isDeleting.value = true;
  try {
    // We send a verification email to handle the deletion securely
    const { error } = await authClient.deleteUser({
      callbackURL: "/signup",
    });

    if (error) throw error;

    message.value = { text: "Verification Email Sent", type: "success" };
    showDeleteModal.value = false;
  } catch (err: any) {
    message.value = { text: err.message, type: "error" };
  } finally {
    isDeleting.value = false;
    setTimeout(() => {
      message.value = { text: "", type: "" };
    }, 4000);
  }
};
</script>

<template>
  <div class="flex flex-col gap-8 pt-12 lg:pt-0 max-w-4xl mx-auto pb-20">
    <header class="flex flex-col gap-1">
      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
        Profile and Settings
      </p>
    </header>

    <div v-if="session.isPending" class="grid grid-cols-1 gap-4">
      <div
        class="bg-white dark:bg-neutral-900 rounded-lg border border-slate-100 dark:border-neutral-800 p-6 animate-pulse"
      >
        <div class="flex items-center justify-between mb-8">
          <div class="h-3 w-24 bg-slate-100 dark:bg-neutral-800 rounded"></div>
          <div class="h-8 w-24 bg-slate-100 dark:bg-neutral-800 rounded-full"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="h-11 bg-slate-50 dark:bg-neutral-800 rounded-xl"></div>
          <div class="h-11 bg-slate-50 dark:bg-neutral-800 rounded-xl"></div>
          <div
            class="md:col-span-2 h-11 bg-slate-50 dark:bg-neutral-800 rounded-xl"
          ></div>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 gap-4">
      <div
        class="bg-white dark:bg-neutral-900 rounded-lg border border-white dark:border-neutral-900 p-6 shadow-sm"
      >
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Public Identity
          </h2>
          <button
            @click="updateProfile"
            :disabled="isLoading"
            class="h-8 px-4 bg-sky-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-sky-500 transition-all disabled:opacity-50"
          >
            Save Profile
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-1.5">
            <label
              class="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1"
              >Name</label
            >
            <input
              v-model="form.name"
              type="text"
              class="w-full bg-slate-50 dark:bg-neutral-800 h-11 rounded-xl px-4 text-xs font-medium dark:text-white outline-none ring-1 ring-transparent focus:ring-sky-500/20 transition-all"
            />
          </div>
          <div class="space-y-1.5">
            <label
              class="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1"
              >Email</label
            >
            <input
              v-model="form.email"
              type="email"
              class="w-full bg-slate-50 dark:bg-neutral-800 h-11 rounded-xl px-4 text-xs font-medium dark:text-white outline-none disabled:opacity-50"
            />
          </div>
          <div class="md:col-span-2 space-y-1.5">
            <label
              class="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1"
              >Bio & Role</label
            >
            <div class="flex gap-2">
              <input
                v-model="form.role"
                type="text"
                placeholder="Role"
                class="w-1/3 bg-slate-50 dark:bg-neutral-800 h-11 rounded-xl px-4 text-xs font-medium dark:text-white outline-none ring-1 ring-transparent focus:ring-sky-500/20"
              />
              <input
                v-model="form.bio"
                type="text"
                placeholder="Short bio"
                class="w-2/3 bg-slate-50 dark:bg-neutral-800 h-11 rounded-xl px-4 text-xs font-medium dark:text-white outline-none ring-1 ring-transparent focus:ring-sky-500/20"
              />
            </div>
          </div>
        </div>
        <div class="mt-10">
          <div class="flex items-center gap-2 mb-4">
            <label
              class="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1"
              >AI Manager Level</label
            >
            <Flame class="w-3 h-3 text-slate-300" />
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              v-for="opt in roastOptions"
              :key="opt.id"
              @click="form.roastLevel = opt.id"
              :class="[
                'h-12 rounded-xl border font-bold text-[10px] uppercase tracking-widest transition-all',
                form.roastLevel === opt.id
                  ? opt.active + ' border-transparent ' + opt.color
                  : 'border-slate-50 dark:border-neutral-800 text-slate-400',
              ]"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="!isGoogleUser"
        class="bg-white dark:bg-neutral-900 rounded-lg border border-white dark:border-neutral-900 p-6 shadow-sm"
      >
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Security
          </h2>
          <button
            @click="changePassword"
            :disabled="isLoading"
            class="h-8 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50"
          >
            Update Password
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            v-model="passwordData.current"
            type="password"
            placeholder="Current Password"
            class="w-full bg-slate-50 dark:bg-neutral-800 h-11 rounded-xl px-4 text-xs font-medium dark:text-white outline-none ring-1 ring-transparent focus:ring-sky-500/20"
          />
          <input
            v-model="passwordData.new"
            type="password"
            placeholder="New Password"
            class="w-full bg-slate-50 dark:bg-neutral-800 h-11 rounded-xl px-4 text-xs font-medium dark:text-white outline-none ring-1 ring-transparent focus:ring-sky-500/20"
          />
          <input
            v-model="passwordData.confirm"
            type="password"
            placeholder="Confirm New"
            class="w-full bg-slate-50 dark:bg-neutral-800 h-11 rounded-xl px-4 text-xs font-medium dark:text-white outline-none ring-1 ring-transparent focus:ring-sky-500/20"
          />
        </div>
      </div>

      <div
        class="bg-white dark:bg-neutral-900 rounded-lg border border-white dark:border-neutral-900 p-6 shadow-sm"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2
              class="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1"
            >
              Danger Zone
            </h2>
            <p class="text-[9px] text-slate-400 font-medium uppercase tracking-tight">
              Permanently delete all account data
            </p>
          </div>
          <button
            @click="showDeleteModal = true"
            class="h-8 px-4 border border-rose-500 text-rose-500 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm"
      >
        <div
          class="bg-white dark:bg-neutral-900 w-full max-w-sm rounded-2xl border border-slate-200 dark:border-neutral-800 p-8 shadow-2xl"
        >
          <div class="flex flex-col items-center text-center">
            <h3
              class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2"
            >
              Final Warning
            </h3>
            <p class="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-6">
              This action cannot be undone. To continue, we will send a confirmation link
              to your email address.
            </p>

            <div class="grid grid-cols-2 gap-3 w-full">
              <button
                @click="showDeleteModal = false"
                class="h-10 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-neutral-800 transition-all"
              >
                Cancel
              </button>
              <button
                @click="deleteAccount"
                :disabled="isDeleting"
                class="h-10 rounded-full text-[10px] font-bold uppercase tracking-widest bg-rose-600 text-white hover:bg-rose-500 transition-all disabled:opacity-50"
              >
                {{ isDeleting ? "Sending..." : "Send Email" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition
      enter-active-class="transition duration-300"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200"
      leave-to-class="opacity-0"
    >
      <div
        v-if="message.text"
        :class="[
          'fixed bottom-8 right-8 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl z-[200]',
          message.type === 'success' ? 'bg-sky-600 text-white' : 'bg-rose-600 text-white',
        ]"
      >
        {{ message.text }}
      </div>
    </Transition>
  </div>
</template>
