<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-6 dark:text-white">联系站长</h1>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
        <!-- Introduction -->
        <div class="prose dark:prose-invert max-w-none">
          <p class="text-gray-600 dark:text-gray-300">
            任氏有无轩创立于1989年，经过多年发展，现已成为一个包含藏书、读书、博客、维客等多个板块的个人网站。如果您有任何问题、建议或合作意向，欢迎通过以下方式与我联系。
          </p>
        </div>

        <!-- Contact Methods -->
        <div class="space-y-4">
          <!-- Email -->
          <div class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="text-blue-600 dark:text-blue-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold dark:text-white">电子邮件</h3>
              <p class="text-gray-600 dark:text-gray-300 mt-1">
                这是联系我的首选方式
              </p>
              <a href="mailto:webmaster@rsywx.net" 
                class="inline-flex items-center mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                taylor.ren@gmail.com
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          <!-- Blog -->
          <div class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="text-green-600 dark:text-green-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold dark:text-white">博客留言</h3>
              <p class="text-gray-600 dark:text-gray-300 mt-1">
                您也可以在我的博客相关文章下留言
              </p>
              <a href="https://blog.rsywx.net" target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                访问博客
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          <!-- WeChat -->
          <div class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="text-green-600 dark:text-green-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <div class="w-full">
              <h3 class="text-lg font-semibold dark:text-white">微信</h3>
              <p class="text-gray-600 dark:text-gray-300 mt-1 mb-4">
                欢迎通过微信联系或关注公众号
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Personal WeChat -->
                <div class="space-y-2">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">个人微信</p>
                  <div class="bg-white p-4 rounded-lg shadow-sm w-48">
                    <img src="/images/qrcode_for_me.jpg" alt="个人微信二维码" class="w-full">
                  </div>
                </div>
                <!-- WeChat Subscription -->
                <div class="space-y-2">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">微信公众号</p>
                  <div class="bg-white p-4 rounded-lg shadow-sm w-48">
                    <img src="/images/qrcode_for_subscription.jpg" alt="微信公众号二维码" class="w-full">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Social Media -->
          <div class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="text-purple-600 dark:text-purple-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold dark:text-white">社交媒体</h3>
              <p class="text-gray-600 dark:text-gray-300 mt-1">
                欢迎在社交媒体上关注我
              </p>
              <div class="flex gap-4 mt-2">
                <a href="https://github.com/taylorren" target="_blank" rel="noopener noreferrer"
                  class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Note -->
        <div class="mt-6 text-sm text-gray-500 dark:text-gray-400">
          <p>注：我会尽量在24小时内回复邮件。如果是技术问题，建议直接在GitHub上提交issue。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Setup SEO meta tags
useHead({
  title: '联系站长 | 任氏有无轩',
  meta: [
    {
      name: 'description',
      content: '联系任氏有无轩站长，讨论藏书、读书、博客等相关话题，或提出建议和合作意向。'
    }
  ]
});
</script>
