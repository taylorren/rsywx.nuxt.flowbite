<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-between h-full">
    <div>
      <p class="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">PHRASES WITH VALUE, INSIGHTS</p>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-4xl font-bold dark:text-white">QOTD</h2>
        <button @click="refreshQotd"
          class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
          换一句
        </button>
      </div>
      <div class="flex flex-col md:flex-row rounded-lg overflow-hidden">
        <!-- 左侧图片区域 -->
        <div class="md:w-1/2 relative bg-gray-300 dark:bg-gray-600">
          <div class="relative w-full h-full">
            <img class="w-full h-full object-contain" src="/images/qotd.jpg" alt="每日一句" />
            <!-- 图片分隔线 - 仅在中等屏幕及以上显示 -->
            <svg class="hidden md:block absolute right-0 top-0 h-full" style="color:var(--tw-bg-opacity-1)" preserveAspectRatio="none" width="20" height="100%" viewBox="0 0 58 583" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0 583L9.66667 534.417C19.3333 485.833 38.6667 388.667 39.7407 291.5C40.8148 194.333 23.6296 97.1667 15.037 48.5833L6.44444 -1.62125e-05H58V48.5833C58 97.1667 58 194.333 58 291.5C58 388.667 58 485.833 58 534.417V583H0Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
        <!-- 右侧内容区域 -->
        <div class="md:w-1/2 p-6 flex flex-col justify-center bg-black text-white">
          <blockquote class="mb-4">
            <p class="mb-4 text-xl font-medium" x-text="qotd.quote">
              {{ qotd?.quote || '加载中...' }}
            </p>
            <footer class="text-sm text-gray-400">
              <span class="block text-right" x-text="qotd.source">— {{ qotd?.source || '' }}</span>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
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