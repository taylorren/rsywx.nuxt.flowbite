<template>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-between h-full">
        <div>
            <h2 class="text-xl font-semibold mb-2 flex items-center dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-6 h-6 mr-2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
                读书摘要
            </h2>
            <img class="rounded-t-lg" src="/images/reading_summary.png" alt="任氏有无轩" />
            <br />
            <div class="space-y-3 dark:text-gray-300">
              <p>任氏有无轩主人共读书<span class="font-semibold text-blue-600 dark:text-blue-400">{{ formatNumber(readingData?.books_read || 0) }}</span>本，写了<span class="font-semibold text-green-600 dark:text-green-400">{{ formatNumber(readingData?.reviews_written || 0) }}</span>篇读书笔记。</p>
              
              <div v-if="readingData?.reading_period" class="text-sm text-gray-600 dark:text-gray-400">
                <p>阅读时间跨度：{{ formatReadingPeriod(readingData.reading_period) }}</p>
                <p>总计：{{ readingData.reading_period.total_days }}天</p>
              </div>
            </div><br />
        </div>
        <a href="#"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 self-start">
            浏览全部书评
            <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9" />
            </svg>
        </a>
    </div>
</template>

<script setup lang="ts">
import type { ReadingSummary } from '~/types/reading';
import { formatNumber } from '~/utils/helper';

defineProps<{
    readingData: ReadingSummary | null | undefined;
}>();

// Format reading period dates
const formatReadingPeriod = (period: { earliest_date: string; latest_date: string; total_days: number }) => {
  if (!period.earliest_date || !period.latest_date) return '暂无数据';
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return `${formatDate(period.earliest_date)} 至 ${formatDate(period.latest_date)}`;
};
</script>