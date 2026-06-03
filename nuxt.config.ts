export default defineNuxtConfig({
  compatibilityDate: '2025-11-01',
  srcDir: 'src',
  serverDir: 'src/server',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],
  colorMode: {
    classSuffix: ''
  },
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
    }
  },
  css: ['~/assets/css/main.css'],
  typescript: {
    strict: true,
    typeCheck: true
  },
  runtimeConfig: {
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || '',
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL || ''
    }
  },
  nitro: {
    vercel: {
      functions: {
        maxDuration: 300
      }
    }
  }
})
