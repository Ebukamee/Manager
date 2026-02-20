import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineNuxtConfig({
  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    cronSecret: process.env.CRON_SECRET,
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  future: {
    compatibilityVersion: 4,
  },
  modules: ['@nuxtjs/color-mode'],
srcDir: 'app/',
  css: ['~/assets/css/main.css'],
 app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'icon', type: 'image/png', href: 'https://manager-sandy-nine.vercel.app/_nuxt/logo.CTHVlRu7.png' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Space+Grotesk:wght@300..700&display=swap' }
      ]
    }
  },

  vite: {
    plugins: [
      tailwindcss(),
       nodePolyfills({
        globals: {
          Buffer: true, 
          process: true,
        },
      }),
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
  },
   
})