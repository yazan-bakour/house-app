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
    tursoDbUrl: process.env.TURSO_DB_URL,
    tursoAuthToken: process.env.TURSO_AUTH_TOKEN,
    blobReadWriteToken: process.env.BLOB_READ_WRITE_TOKEN,
    cronSecret: process.env.CRON_SECRET,

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
