// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  
  // Enable TypeScript
  typescript: {
    strict: true,
    typeCheck: true
  },

  // CSS preprocessor
  css: ['~/public/assets/scss/main.scss'],

  // Modules
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    'nuxt-svgo',
  ],

  // Google Fonts configuration
  googleFonts: {
    families: {
      Montserrat: ['400', '500', '600', '700'],
      OpenSans: ['400', '600']
    },
    display: 'swap',
  },

  // Runtime Configuration
  runtimeConfig: {
    // Server-side configuration (private)
    dttApiUrl: process.env.DTT_API_URL,
    dttApiKey: process.env.DTT_API_KEY,
    
    // Public configuration (exposed to client-side)
    public: {
      apiUrl: '/api'
    }
  },

  // Vite configuration for SCSS
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/public/assets/scss/variables.scss" as *;'
        }
      }
    }
  }
})
