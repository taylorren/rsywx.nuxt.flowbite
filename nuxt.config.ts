import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  devtools: { enabled: true },

  css: [
    '~/assets/css/input.css',
  ],

  app: {
    head: {
      title: '任氏有无轩',
      titleTemplate: '%s | 任氏有无轩',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '任氏有无轩 - 个人藏书、读书笔记、博客和维客的综合平台。收藏各类优质图书，分享阅读心得，记录知识点滴。' },
        { name: 'keywords', content: '任氏有无轩,藏书,读书,博客,维客,图书收藏,阅读笔记,知识分享' },
        { name: 'author', content: '任氏有无轩' },

        // Mobile and PWA meta tags
        { name: 'theme-color', content: '#1f2937' },
        { name: 'color-scheme', content: 'light dark' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: '任氏有无轩' },
        { name: 'format-detection', content: 'telephone=no' },

        // Open Graph meta tags
        { property: 'og:site_name', content: '任氏有无轩' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'zh_CN' },

        // Twitter Card meta tags
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@rsywx' },

        // Additional SEO meta tags
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'revisit-after', content: '7 days' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'canonical', href: 'https://rsywx.net' }
      ]
    }
  },

  runtimeConfig: {
    // 公共配置（客户端和服务端都可用）
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      apiKey: process.env.NUXT_API_KEY,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://rsywx.net'
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

  compatibilityDate: "2025-02-28"
});