import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  // 1. This enables the Nuxt 4 folder structure (app/ directory)
  future: {
    compatibilityVersion: 4,
  },
srcDir: 'app/',
  // 2. Register your global CSS file here
  // The ~ alias points to your app/ folder in Nuxt 4
  css: ['~/assets/css/main.css'],
 app: {
    head: {
      link: [
        // Preconnect to Google
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        // Load Inter and Space Grotesk
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Space+Grotesk:wght@300..700&display=swap' }
      ]
    }
  },

  // 3. Add the Tailwind Vite plugin
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  imports: {
    transform: {
      exclude: [/\bIcon\b/]
    },
    presets: [
      {
        from: 'lucide-vue-next',
        imports: ['Sun', 'Moon', 'Menu', 'X', 'Check', 'ArrowRight'] // Add icons you need here
      }
    ]
  }
})