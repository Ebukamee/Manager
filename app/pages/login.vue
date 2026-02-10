<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next';
import { authClient } from '~/lib/auth-client';
import { ref } from 'vue';
import { handleGoogleSignIn } from '~/utilis/helper';

definePageMeta({
    layout: 'auth-layout'
})

const email = ref('');
const password = ref('');
const showPassword = ref(false)
const loading = ref(false);
const googleLoading = ref(false);

const errorMessage = ref('');
const successMessage = ref('');

const handleSignIn = async () => {
    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    const { data, error } = await authClient.signIn.email({
        email: email.value,
        password: password.value,
    });

    loading.value = false;

    if (error) {
        errorMessage.value = error.message || 'An error occurred during sign in.';
    } else {
        successMessage.value = 'Signed in successfully. Redirecting...';
        await navigateTo('/dashboard');
    }
};

const handleGoogleSignInWrapper = async () => {
    googleLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';
    await handleGoogleSignIn();
    googleLoading.value = false;
};
</script>

<template>
    <div class="group relative">

        <div
            class="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-br from-cyan-400 to-sky-600 opacity-0 blur-xl transition duration-500 group-hover:opacity-10 dark:opacity-0 dark:group-hover:opacity-10">
        </div>

        <div
            class="relative overflow-hidden rounded-[2rem] bg-white/90 px-6 py-8 shadow-2xl backdrop-blur-xl ring-1 ring-gray-100 dark:bg-black/80 dark:ring-neutral-800 sm:px-8">

            <div class="flex flex-col items-center text-center">
                <div
                    class="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-50 to-sky-50 shadow-inner ring-1 ring-white dark:from-neutral-900 dark:to-neutral-900 dark:ring-neutral-800">
                    <svg class="h-5 w-5 text-sky-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                </div>

                <h1 class="font-display text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Welcome back
                </h1>
            </div>

            <div v-if="errorMessage"
                class="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
                {{ errorMessage }}
            </div>

            <div v-if="successMessage"
                class="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">
                {{ successMessage }}
            </div>

            <form @submit.prevent="handleSignIn" class="mt-6 space-y-3">
                <input type="email" placeholder="Email address" v-model="email"
                    class="w-full rounded-xl border-none bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-gray-200 transition-all focus:bg-white focus:ring-2 focus:ring-sky-500 dark:bg-neutral-900 dark:text-white dark:ring-neutral-800 dark:focus:bg-black dark:focus:ring-cyan-500" />

                <div class="relative">
                    <input :type="showPassword ? 'text' : 'password'" placeholder="Password" v-model="password"
                        class="w-full rounded-xl border-none bg-gray-50 px-4 py-3 pr-10 text-sm font-medium text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-gray-200 transition-all focus:bg-white focus:ring-2 focus:ring-sky-500 dark:bg-neutral-900 dark:text-white dark:ring-neutral-800 dark:focus:bg-black dark:focus:ring-cyan-500" />
                    <button type="button" @click="showPassword = !showPassword"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Eye v-if="!showPassword" class="h-4 w-4" />
                        <EyeOff v-else class="h-4 w-4" />
                    </button>
                </div>

                <div class="flex justify-end">
                    <NuxtLink to="/forgot-password"
                        class="text-xs font-semibold text-sky-600 hover:text-sky-500 dark:text-cyan-400 dark:hover:text-cyan-300">
                        Forgot password?
                    </NuxtLink>
                </div>

                <button
                    class="w-full rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    {{ loading ? 'Signing in...' : 'Sign In' }}
                </button>
            </form>

            <div class="mt-6">
                <div class="relative mb-4">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-100 dark:border-neutral-800"></div>
                    </div>
                    <div class="relative flex justify-center">
                        <span
                            class="bg-white px-2 text-[10px] font-medium uppercase tracking-widest text-gray-400 dark:bg-black">
                            Or
                        </span>
                    </div>
                </div>

                <button @click="handleGoogleSignInWrapper"
                    class="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 hover:bg-gray-50 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 transition">
                    <svg class="h-4 w-4" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4" />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853" />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05" />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335" />
                    </svg>
                    <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {{ googleLoading ? 'Signing in...' : 'Sign in with Google' }}
                    </span>
                </button>
            </div>

            <div class="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
                Don't have an account?
                <NuxtLink to="/signup"
                    class="font-semibold text-sky-600 hover:text-sky-500 hover:underline dark:text-cyan-400 dark:hover:text-cyan-300">
                    Sign up
                </NuxtLink>
            </div>

        </div>
    </div>
</template>
