<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-between h-full">
    <div>
      <h2 class="text-xl font-semibold mb-2 flex items-center dark:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
        &nbsp;&nbsp;最新书评
      </h2>

      <!-- Empty state -->
      <div v-if="!latestReadings || latestReadings.length === 0" class="text-center py-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
        <p class="text-gray-500 dark:text-gray-400">暂无书评</p>
      </div>

      <!-- Latest reading content -->
      <div v-if="latestReading">

        <!-- Feature image for the review -->
        <a :href="latestReading.uri">
          <img class="rounded-t-lg w-full" :src="latestReading.feature" :alt="latestReading.title" />
        </a>
        <br />
        <div class="space-y-3 dark:text-gray-300">
          <!-- Book title being reviewed -->
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-500 mb-1">评论书籍</p>
            <a :href="`/books/${latestReading.bookid}.html`"
              class="font-semibold text-lg text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 block">
              《{{ latestReading.book_title }}》
            </a>
          </div>

          <!-- Review title -->
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-500 mb-1">书评标题</p>
            <a :href="latestReading.uri"
              class="font-semibold text-lg text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline block">
              {{ latestReading.title }}
            </a>
          </div>

          <!-- Review date -->
          <p class="text-sm text-gray-500 dark:text-gray-500">
            书评发表于：{{ formatDate(latestReading.datein) }}
          </p>
        </div>
      </div>
    </div>

    <a v-if="latestReading" :href="latestReading.uri"
      class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 self-start mt-4">
      阅读完整书评
      <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 14 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M1 5h12m0 0L9 1m4 4L9 9" />
      </svg>
    </a>
  </div>
</template>

<script setup lang="ts">

import { computed } from 'vue';
import type { LatestReading } from '~/types/reading';

const props = defineProps<{
  latestReadings: LatestReading[] | null | undefined;
}>();

// Get the most recent reading (first item in the array)
const latestReading = computed<LatestReading | null>(() => {
  return props.latestReadings && props.latestReadings.length > 0
    ? props.latestReadings[0]
    : null;
});



// Format date for display
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>