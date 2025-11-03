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
    tursoDbUrl: (() => {
      const url = process.env.TURSO_DB_URL
      if (!url) {
        console.error('❌ Missing TURSO_DB_URL environment variable')
        throw new Error('Missing TURSO_DB_URL environment variable. Please check your .env file.')
      }
      if (!url.startsWith('libsql://')) {
        console.error('❌ Invalid TURSO_DB_URL format')
        throw new Error('TURSO_DB_URL must start with "libsql://"')
      }
      return url
    })(),
    tursoAuthToken: (() => {
      const token = process.env.TURSO_AUTH_TOKEN
      if (!token) {
        console.error('❌ Missing TURSO_AUTH_TOKEN environment variable')
        throw new Error('Missing TURSO_AUTH_TOKEN environment variable. Please check your .env file.')
      }
      if (token.split('.').length !== 3) {
        console.error('❌ Invalid TURSO_AUTH_TOKEN format')
        throw new Error('TURSO_AUTH_TOKEN must be a valid JWT token')
      }
      
      // Check token expiration
      try {
        const parts = token.split('.')
        const payloadBase64 = parts[1]
        if (payloadBase64) {
          const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString())
          if (payload.exp) {
            const expiresAt = new Date(payload.exp * 1000)
            const now = new Date()
            if (expiresAt < now) {
              console.error('❌ TURSO_AUTH_TOKEN has expired')
              throw new Error(`TURSO_AUTH_TOKEN expired on ${expiresAt.toLocaleDateString()}. Please regenerate your token.`)
            }
            console.log(`✅ Token expires: ${expiresAt.toLocaleDateString()}`)
          }
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('expired')) {
          throw error
        }
        console.warn('⚠️  Could not verify token expiration')
      }
      
      return token
    })(),
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
