import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineNuxtConfig({
  debug:true,
  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    cronSecret: process.env.CRON_SECRET,
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  future: {
    compatibilityVersion: 4,
  },
  modules: ['@nuxtjs/color-mode','@vite-pwa/nuxt'],
srcDir: 'app/',
  css: ['~/assets/css/main.css'],
 app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        // { rel: 'icon', type: 'image/png', href: '/' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Space+Grotesk:wght@300..700&display=swap' }
      ],
      meta: [
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
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

  pwa: {
    registerType: 'autoUpdate',
    
    manifest: {
      name: 'Manager App',
      short_name: 'Manager',
      theme_color: '#000000',
      icons: [
        {
          src: '/logo.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/logo.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    client: {
      installPrompt: true,
    },
  },
  
  imports: {
    transform: {
      exclude: [/\bIcon\b/]
    },
    presets: [
      {
        from: 'lucide-vue-next',
        imports: ['Sun', 'Moon', 'Menu', 'X', 'Check', 'ArrowRight'] 
      }
    ]
  },
   
})