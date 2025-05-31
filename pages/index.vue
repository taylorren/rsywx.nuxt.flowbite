<template>
  <div class="bg-gray-100 min-h-screen py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold mb-4">Dashboard</h1>

      <!-- 藏书 Group -->
      <h2 class="text-2xl font-semibold mb-2">藏书</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <!-- Book Summary Card -->
        <BookSummaryCard :summary="summary" />
        <!-- Latest Book Card -->
        <LatestBookCard :latestBook="latestBook" />
        <!-- Add more 藏书 cards here -->
      </div>

      <!-- 读书 Group -->
      <h2 class="text-2xl font-semibold mb-2">读书</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Reading Data Card -->
        <ReadingSummaryCard :readingData="readingData" />
        <!-- Add more 读书 cards here -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookService } from '~/services/bookService';
import { ReadingService } from '~/services/readingService';

import type { BooksSummary } from '~/types/book';
import type { ReadingSummary } from '~/types/reading';

import BookSummaryCard from '~/components/home/BookSummaryCard.vue';
import ReadingSummaryCard from '~/components/home/ReadingSummaryCard.vue';
import LatestBookCard from '~/components/home/LatestBookCard.vue';

const bookService = new BookService();
const readingService = new ReadingService();

const { data: summary, error: summaryError } = await useAsyncData<BooksSummary>(
  'summary',
  async () => {
    return await bookService.getBooksSummary();
  }
);

if (summaryError.value) {
  console.error('Failed to fetch book summary:', summaryError.value);
}

const { data: latestBook, error: latestBookError } = await useAsyncData(
    'latestBook',
    async () => {
        return await bookService.getLatestBook();
    }
);

if (latestBookError.value) {
    console.error('Failed to fetch latest book:', latestBookError.value);
}

const { data: readingData, error: readingError } = await useAsyncData<ReadingSummary>(
  'reading-data',
  async () => {
    return await readingService.getReadingData();
  }
);

if (readingError.value) {
  console.error('Failed to fetch reading data:', readingError.value);
}

// Setup meta data
useHead({
  title: '任氏有无轩 | 藏书、读书、博客、维客', // 设置页面标题
  meta: [
    {
      name: 'description',
      content: '任氏有无轩，创立于1989年。其对应站点专注于藏书、读书、博客、维客等构造。是中国大陆不多的质量较高的个人站点。', // 设置页面描述
    },
    {
      name: 'keywords',
      content: '藏书, 读书，博客，维客，资源，个人', // 设置关键词
    },
  ],
});
</script>