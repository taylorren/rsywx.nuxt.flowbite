import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    '~/assets/css/input.css', 
  ],

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
    public: {
      apiBase: 'http://api.rsywx', // 这里可以改成你的实际 API 地址
    }
  },
});