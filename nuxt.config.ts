import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    '~/assets/css/input.css',
  ],

  // Disable automatic resource preloading to prevent warnings
  app: {
    head: {
      link: []
    }
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  plugins: [
    '~/plugins/chart.js'
  ],

  compatibilityDate: "2025-02-28",

  runtimeConfig: {
    // 公共配置（客户端和服务端都可用）
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      apiKey: process.env.NUXT_API_KEY,
    }
  },
});