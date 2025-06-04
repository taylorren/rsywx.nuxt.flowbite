<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold mb-4 dark:text-white">任氏有无轩基本情况一览</h1>

      <!-- 藏书 Group -->
      <h2 class="text-2xl font-semibold mb-2 dark:text-white">藏书信息</h2>
      <h3 class="dark:text-gray-300">（截止{{ cur_year }}年{{ month }}月{{ date }}日）</h3>
      <br />
      <div class="flex flex-wrap gap-4 mb-8">
        <!-- Book Summary Card -->
        <div class="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] xl:w-[calc(25%-0.75rem)]">
          <BookSummaryCard :summary="summary" />
        </div>
        <!-- Latest Book Card -->
        <div class="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] xl:w-[calc(25%-0.75rem)]">
          <LatestBookCard :latestBook="latestBook" />
        </div>
        <!-- Random Book Card -->
        <div class="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] xl:w-[calc(25%-0.75rem)]">
          <BookRandomCard :randomBook="randomBook?.[0]" @refresh="refreshRandomBook"/>
        </div>
        <!-- Recent Visit Book Card -->
        <div class="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] xl:w-[calc(25%-0.75rem)]">
          <RecentVisitBookCard :book="recentVisitBook?.[0]"/>
        </div>
        <!-- Forget Book Card -->
        <div class="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] xl:w-[calc(25%-0.75rem)]">
          <ForgetBookCard :book="forgetBook?.[0]"/>
        </div>
        <!-- Today Books Card -->
        <div class="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] xl:w-[calc(25%-0.75rem)]">
          <BookTodayCard :todayBooks="todayBooks || []"/>
        </div>
        <!-- Visit Stats Card -->
        <div class="w-full md:w-[calc(100%-0.5rem)] lg:w-[calc(66.666%-0.667rem)] xl:w-[calc(50%-0.75rem)]">
          <VisitStatsCard :visitStats="visitStats" />
        </div>
        <!-- Add more 藏书 cards here -->
      </div>

      <!-- 读书 Group -->
      <h2 class="text-2xl font-semibold mb-2 dark:text-white">读书</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <!-- Reading Data Card -->
        <ReadingSummaryCard :readingData="readingData" />
        <!-- Latest Reading Card -->
        <LatestReadingCard :latestReading="latestReading" />
        <!-- Add more 读书 cards here -->
      </div>

      <!-- 访问统计 Group -->
      <!-- 已移除访问统计部分，将卡片移到藏书信息部分 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookService } from '~/services/bookService';
import { ReadingService } from '~/services/readingService';
import { visitService } from '~/services/visitService';

import type { BooksSummary, RandomBook, RecentBook, ForgetBook, TodayBook } from '~/types/book';
import type { LatestReading, ReadingSummary } from '~/types/reading';
import type { VisitStatsArray } from '~/types/visit';

import BookSummaryCard from '~/components/home/BookSummaryCard.vue';
import ReadingSummaryCard from '~/components/home/ReadingSummaryCard.vue';
import LatestBookCard from '~/components/home/LatestBookCard.vue';
import LatestReadingCard from '~/components/home/LatestReadingCard.vue';
import BookRandomCard from '~/components/home/BookRandomCard.vue';
import RecentVisitBookCard from '~/components/home/RecentVisitBookCard.vue';
import ForgetBookCard from '~/components/home/ForgetBookCard.vue';
import BookTodayCard from '~/components/home/BookTodayCard.vue';
import VisitStatsCard from '~/components/home/VisitStatsCard.vue';

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

const { data: randomBook, error: randomBookError, refresh: refreshRandomBook } = await useAsyncData<RandomBook[]>(
  'randomBook',
  async () => {
    return await bookService.getRandomBook();
  }, 
);

if (randomBookError.value) {
  console.error('Failed to fetch random book:', randomBookError.value);
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

const { data: latestReading, error: latestReadingError } = await useAsyncData<LatestReading>(
  'latest-reading',
  async () => {
    return await readingService.getLatestReading();
  }
);

if (latestReadingError.value) {
  console.error('Failed to fetch latest reading:', latestReadingError.value);
}

const { data: recentVisitBook, error: recentVisitBookError } = await useAsyncData<RecentBook[]>(
  'recent-book', 
  async () => {
    return await bookService.getRecentBooks();
  }
);

if (recentVisitBookError.value) {
  console.error('Failed to fetch recent visit book:', recentVisitBookError.value);
}

const { data: forgetBook, error: forgetBookError } = await useAsyncData<ForgetBook[]>(
  'forget-book', 
  async () => {
    return await bookService.getForgetBooks();
  }
);

if (forgetBookError.value) {
  console.error('Failed to fetch forget book:', forgetBookError.value);
}

const { data: todayBooks, error: todayBooksError } = await useAsyncData<TodayBook[]>(
  'today-books', 
  async () => {
    return await bookService.getTodayBooks();
  }
);

if (todayBooksError.value) {
  console.error('Failed to fetch today books:', todayBooksError.value);
}

// 获取访问统计数据
const { data: visitStats, error: visitStatsError } = await useAsyncData<VisitStatsArray>(
  'visit-stats',
  async () => {
    return await visitService.getVisitStats();
  }
);

if (visitStatsError.value) {
  console.error('Failed to fetch visit stats:', visitStatsError.value);
}

// Setup meta data
useHead({
  title: '任氏有无轩 | 藏书、读书、博客、维客', // 设置页面标题
  meta: [
    {
      name: 'description',
      content:
        '任氏有无轩，创立于1989年。其对应站点专注于藏书、读书、博客、维客等构造。是中国大陆不多的质量较高的个人站点。', // 设置页面描述
    },
    {
      name: 'keywords',
      content: '藏书, 读书，博客，维客，资源，个人', // 设置关键词
    },
  ],
});

const currentDate = new Date();
const cur_year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1;
const date = currentDate.getDate();
</script>