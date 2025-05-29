<template>
  <div class="bg-gray-600 min-h-screen py-8">
    <div class="container mx-auto px-4">
      <section class="mb-8">
        <h2 class="text-3xl font-bold mb-4 dark:text-white">网站统计</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4" v-if="summary">
          <div class="bg-white rounded-lg shadow-md p-4 dark:bg-gray-800">
            <h4 class="text-xl font-bold mb-2 dark:text-white">书籍总数</h4>
            <p class="text-gray-700 dark:text-gray-300">{{ summary.bc }}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-4 dark:bg-gray-800">
            <h4 class="text-xl font-bold mb-2 dark:text-white">页面总数</h4>
            <p class="text-gray-700 dark:text-gray-300">{{ summary.pc }}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-4 dark:bg-gray-800">
            <h4 class="text-xl font-bold mb-2 dark:text-white">文字总数</h4>
            <p class="text-gray-700 dark:text-gray-300">{{ summary.wc }}</p>
          </div>
        </div>
        <p v-else>Loading...</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookService } from '~/services/bookService';
import type { BooksSummary } from '~/types/book';

const bookService = new BookService();

const { data: summary, error } = await useAsyncData<BooksSummary>(
  'summary',
  async () => {
    return await bookService.getBooksSummary();
  }
);

if (error.value) {
  console.error('Failed to fetch summary:', error);
}
</script>