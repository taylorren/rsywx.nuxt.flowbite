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
});