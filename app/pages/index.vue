<script setup lang="ts">
// No script changes needed
</script>

<template>
  <div
    class="min-h-screen bg-white text-gray-900 transition-colors dark:bg-black dark:text-white selection:bg-cyan-500 selection:text-white"
  >
    <NavBar />

    <main class="relative pt-[100px] pb-20 sm:pt-40 overflow-hidden">
      <div class="absolute inset-0 min-h-full">
        <div class="hero-pattern pattern-light opacity-15 dark:opacity-0"></div>

        <div class="hero-pattern pattern-dark opacity-0 dark:opacity-15"></div>

        <div
          class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-black"
        ></div>
      </div>

      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[1000px] h-[600px] bg-gradient-to-tr from-cyan-400/20 to-sky-600/20 opacity-50 blur-[120px] dark:from-cyan-500/10 dark:to-sky-600/10"
      ></div>

      <div class="relative z-10 mx-auto max-w-7xl px-6 text-center">
        <div
          class="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50/80 px-3 py-1 text-xs font-medium text-cyan-700 backdrop-blur-md dark:border-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"
            ></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          Task management with a personal touch
        </div>

        <h1
          class="font-sans mx-auto max-w-5xl text-5xl font-bold tracking-tight sm:text-6xl"
        >
          Finally, A Manager You <br />
          <span
            class="bg-gradient-to-r from-cyan-400 to-sky-600 bg-clip-text text-transparent"
          >
            Can Actually Configure.
          </span>
        </h1>

        <p
          class="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400"
        >
          Stop missing deadlines.
          <span class="font-bold text-gray-900 dark:text-gray-100"
            >Choose your accountability level</span
          >
          —from a supportive coach to an unhinged tyrant—and get
          <em>personalised</em> emails in the exact tone that motivates <em>you</em>.
        </p>

        <div
          class="mt-8 grid grid-cols-2 gap-3 text-sm text-gray-600 sm:flex sm:justify-center dark:text-gray-400"
        >
          <span
            class="flex items-center gap-2 rounded-md border border-gray-200 bg-white/60 px-3 py-1 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/60"
          >
            <span class="h-2 w-2 rounded-full bg-emerald-400"></span> Mode: Gentle
          </span>
          <span
            class="flex items-center gap-2 rounded-md border border-gray-200 bg-white/60 px-3 py-1 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/60"
          >
            <span class="h-2 w-2 rounded-full bg-yellow-400"></span> Mode: Firm
          </span>
          <span
            class="flex items-center gap-2 rounded-md border border-gray-200 bg-white/60 px-3 py-1 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/60"
          >
            <span class="h-2 w-2 rounded-full bg-orange-500"></span> Mode: Toxic
          </span>
          <span
            class="flex items-center gap-2 rounded-md border border-gray-200 bg-white/60 px-3 py-1 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/60"
          >
            <span class="h-2 w-2 rounded-full bg-red-600"></span> Mode: Unhinged
          </span>
        </div>
        <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <NuxtLink to="/dashboard">
            <button
              class="h-12 w-full rounded-full bg-sky-600 px-8 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-500 hover:scale-105 hover:shadow-sky-500/40 sm:w-auto"
            >
              Get Started
            </button>
          </NuxtLink>
          <a
            href="#sample-email"
            class="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white/50 px-8 text-sm font-bold text-gray-700 backdrop-blur-sm transition hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-gray-300 dark:hover:bg-neutral-800 sm:w-auto"
          >
            See How It Works
          </a>
        </div>
      </div>

      <div class="relative mx-auto mt-24 max-w-4xl px-4 sm:px-6">
        <div
          class="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-600 opacity-20 blur-2xl dark:opacity-10"
        ></div>

        <div
          class="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-black"
          id="sample-email"
        >
          <div
            class="border-b border-gray-100 bg-gray-50 px-6 py-4 flex items-center justify-between dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div class="flex items-center gap-4">
              <div
                class="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center text-sm font-bold text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200"
              >
                MM
              </div>
              <div>
                <p class="font-bold text-gray-900 dark:text-white">From: MyManager AI</p>
                <p class="text-xs text-gray-500">Subject: API Documentation</p>
              </div>
            </div>
            <span class="text-xs text-gray-400">10:42 AM</span>
          </div>

          <div class="p-8 font-sans text-gray-700 dark:text-gray-300">
            <p class="mb-4">Hi there,</p>
            <p class="mb-4">
              I see you still haven't finished the <strong>"API Documentation"</strong>.
              This is your notice.
            </p>
            <p class="mb-4">
              I'm not mad, I'm just confused. Do you enjoy being the bottleneck? Is this a
              cry for help?
            </p>
            <div
              class="my-6 rounded-lg border-l-4 border-orange-500 bg-orange-50 p-4 text-sm text-orange-900 dark:bg-orange-900/10 dark:text-orange-100"
            >
              <strong>Analysis:</strong> Your scrolling speed on Twitter suggests you are
              perfectly capable of reading text, just not writing it. Interesting.
            </div>
            <p class="text-sm text-gray-400">- MyManager Team</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.hero-pattern {
  position: absolute;
  inset: 0;
  background-repeat: repeat;
  background-size: 400px;
  transition: opacity 0.5s ease-in-out;
}

.pattern-light {
  background-image: url("../assets/bg-light.jpg");
}

.pattern-dark {
  background-image: url("@/assets/bg-dark.jpg");
}
</style>
