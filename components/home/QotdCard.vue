<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-between h-full">
    <div>
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-xl font-semibold flex items-center dark:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
          &nbsp;&nbsp;QOTD
        </h2>
        <button @click="refreshQotd"
          class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          换一句
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ms-2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
      </div>
      <div class="flex flex-col md:flex-row rounded-lg overflow-hidden">
        <div class="md:w-1/2 relative">
          <img class="w-full h-full object-cover" src="/images/qotd.jpg" alt="每日一句" />
          <!-- 图片分隔线 - 仅在中等屏幕及以上显示 -->
          <svg class="hidden md:block absolute right-0 top-0 h-full" style="color:var(--tw-bg-opacity-1)" preserveAspectRatio="none" width="20" height="100%" viewBox="0 0 58 583" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 583L9.66667 534.417C19.3333 485.833 38.6667 388.667 39.7407 291.5C40.8148 194.333 23.6296 97.1667 15.037 48.5833L6.44444 -1.62125e-05H58V48.5833C58 97.1667 58 194.333 58 291.5C58 388.667 58 485.833 58 534.417V583H0Z" fill="currentColor"/>
          </svg>
        </div>
        <div class="md:w-1/2 p-4 flex flex-col justify-center bg-gray-50 dark:bg-gray-700">
          <blockquote class="text-center mb-4">
            <p class="mb-4 text-lg italic font-medium text-gray-900 dark:text-white" x-text="qotd.quote">
              {{ qotd?.quote || '加载中...' }}
            </p>
            <footer class="text-sm text-gray-500 dark:text-gray-400">
              <span x-text="qotd.source">{{ qotd?.source || '' }}</span>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
    <!-- 按钮已移至标题行 -->
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useQotd } from '~/composables/useQotd';

// 使用组合式API获取每日一句功能
const { qotd, error, refreshQotd, fetchQotd } = useQotd();

onMounted(() => {
  fetchQotd();
});
</script>