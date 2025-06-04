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
        <div class="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] xl:w-[calc(25%-0.75rem)]" ref="randomBookRef">
          <BookRandomCard :randomBook="randomBook?.[0]" @refresh="refreshRandomBook"/>
        </div>
        <!-- Recent Visit Book Card -->
        <div class="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] xl:w-[calc(25%-0.75rem)]" ref="recentVisitBookRef">
          <RecentVisitBookCard :book="recentVisitBook?.[0]"/>
        </div>
        <!-- Forget Book Card -->
        <div class="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] xl:w-[calc(25%-0.75rem)]" ref="forgetBookRef">
          <ForgetBookCard :book="forgetBook?.[0]"/>
        </div>
        <!-- Today Books Card -->
        <div class="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] xl:w-[calc(25%-0.75rem)]" ref="todayBooksRef">
          <BookTodayCard :todayBooks="todayBooks || []"/>
        </div>
        <!-- Visit Stats Card -->
        <div class="w-full md:w-[calc(100%-0.5rem)] lg:w-[calc(66.666%-0.667rem)] xl:w-[calc(50%-0.75rem)]" ref="visitStatsRef">
          <VisitStatsCard :visitStats="visitStats" />
        </div>
        <!-- Add more 藏书 cards here -->
      </div>

      <!-- 读书 Group -->
      <h2 class="text-2xl font-semibold mb-2 dark:text-white">读书</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <!-- Reading Data Card -->
        <div ref="readingDataRef">
          <ReadingSummaryCard :readingData="readingData" />
        </div>
        <!-- Latest Reading Card -->
        <div ref="latestReadingRef">
          <LatestReadingCard :latestReading="latestReading" />
        </div>
        <!-- Add more 读书 cards here -->
      </div>

      <!-- 访问统计 Group -->
      <!-- 已移除访问统计部分，将卡片移到藏书信息部分 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
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

// 关键数据（立即加载）
const { data: summary, error: summaryError } = await useAsyncData<BooksSummary>('summary', () => bookService.getBooksSummary());
const { data: latestBook, error: latestBookError } = await useAsyncData('latestBook', () => bookService.getLatestBook());

// 非关键数据（延迟加载）
const randomBook = ref<RandomBook[] | null>(null);
const randomBookError = ref<Error | null>(null);
const randomBookRef = ref<HTMLElement | null>(null);
const randomBookLoaded = ref(false);

const recentVisitBook = ref<RecentBook[] | null>(null);
const recentVisitBookError = ref<Error | null>(null);
const recentVisitBookRef = ref<HTMLElement | null>(null);
const recentVisitBookLoaded = ref(false);

const forgetBook = ref<ForgetBook[] | null>(null);
const forgetBookError = ref<Error | null>(null);
const forgetBookRef = ref<HTMLElement | null>(null);
const forgetBookLoaded = ref(false);

const todayBooks = ref<TodayBook[] | null>(null);
const todayBooksError = ref<Error | null>(null);
const todayBooksRef = ref<HTMLElement | null>(null);
const todayBooksLoaded = ref(false);

const visitStats = ref<VisitStatsArray | null>(null);
const visitStatsError = ref<Error | null>(null);
const visitStatsRef = ref<HTMLElement | null>(null);
const visitStatsLoaded = ref(false);

const readingData = ref<ReadingSummary | null>(null);
const readingError = ref<Error | null>(null);
const readingDataRef = ref<HTMLElement | null>(null);
const readingDataLoaded = ref(false);

const latestReading = ref<LatestReading | null>(null);
const latestReadingError = ref<Error | null>(null);
const latestReadingRef = ref<HTMLElement | null>(null);
const latestReadingLoaded = ref(false);

// 刷新随机书籍的方法
const refreshRandomBook = async () => {
  try {
    randomBook.value = await bookService.getRandomBook();
  } catch (error) {
    randomBookError.value = error as Error;
    console.error('Failed to fetch random book:', error);
  }
};

// 创建Intersection Observer实例
const createObserver = () => {
  const options = {
    root: null, // 使用视口作为根
    rootMargin: '0px', // 无边距
    threshold: 0.1 // 当10%的元素可见时触发
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 根据目标元素加载相应数据
        if (entry.target === randomBookRef.value && !randomBookLoaded.value) {
          loadRandomBook();
          randomBookLoaded.value = true;
        } else if (entry.target === recentVisitBookRef.value && !recentVisitBookLoaded.value) {
          loadRecentVisitBook();
          recentVisitBookLoaded.value = true;
        } else if (entry.target === forgetBookRef.value && !forgetBookLoaded.value) {
          loadForgetBook();
          forgetBookLoaded.value = true;
        } else if (entry.target === todayBooksRef.value && !todayBooksLoaded.value) {
          loadTodayBooks();
          todayBooksLoaded.value = true;
        } else if (entry.target === visitStatsRef.value && !visitStatsLoaded.value) {
          loadVisitStats();
          visitStatsLoaded.value = true;
        } else if (entry.target === readingDataRef.value && !readingDataLoaded.value) {
          loadReadingData();
          readingDataLoaded.value = true;
        } else if (entry.target === latestReadingRef.value && !latestReadingLoaded.value) {
          loadLatestReading();
          latestReadingLoaded.value = true;
        }
        
        // 一旦加载，取消观察
        observer.unobserve(entry.target);
      }
    });
  }, options);

  return observer;
};

// 加载各个非关键数据的方法
const loadRandomBook = async () => {
  try {
    randomBook.value = await bookService.getRandomBook();
    await nextTick(); // 等待DOM更新
  } catch (error) {
    randomBookError.value = error as Error;
    console.error('Failed to fetch random book:', error);
  }
};

const loadRecentVisitBook = async () => {
  try {
    recentVisitBook.value = await bookService.getRecentBooks();
    await nextTick(); // 等待DOM更新
  } catch (error) {
    recentVisitBookError.value = error as Error;
    console.error('Failed to fetch recent visit book:', error);
  }
};

const loadForgetBook = async () => {
  try {
    forgetBook.value = await bookService.getForgetBooks();
    await nextTick(); // 等待DOM更新
  } catch (error) {
    forgetBookError.value = error as Error;
    console.error('Failed to fetch forget book:', error);
  }
};

const loadTodayBooks = async () => {
  try {
    todayBooks.value = await bookService.getTodayBooks();
    await nextTick(); // 等待DOM更新
  } catch (error) {
    todayBooksError.value = error as Error;
    console.error('Failed to fetch today books:', error);
  }
};

const loadVisitStats = async () => {
  try {
    visitStats.value = await visitService.getVisitStats();
    await nextTick(); // 等待DOM更新
  } catch (error) {
    visitStatsError.value = error as Error;
    console.error('Failed to fetch visit stats:', error);
  }
};

const loadReadingData = async () => {
  try {
    readingData.value = await readingService.getReadingData();
    await nextTick(); // 等待DOM更新
  } catch (error) {
    readingError.value = error as Error;
    console.error('Failed to fetch reading data:', error);
  }
};

const loadLatestReading = async () => {
  try {
    latestReading.value = await readingService.getLatestReading();
    await nextTick(); // 等待DOM更新
  } catch (error) {
    latestReadingError.value = error as Error;
    console.error('Failed to fetch latest reading:', error);
  }
};

// 在组件挂载后设置观察者
onMounted(() => {
  const observer = createObserver();
  
  // 观察所有需要延迟加载的组件
  if (randomBookRef.value) observer.observe(randomBookRef.value);
  if (recentVisitBookRef.value) observer.observe(recentVisitBookRef.value);
  if (forgetBookRef.value) observer.observe(forgetBookRef.value);
  if (todayBooksRef.value) observer.observe(todayBooksRef.value);
  if (visitStatsRef.value) observer.observe(visitStatsRef.value);
  if (readingDataRef.value) observer.observe(readingDataRef.value);
  if (latestReadingRef.value) observer.observe(latestReadingRef.value);
});

// 错误处理
if (summaryError.value) console.error('Failed to fetch book summary:', summaryError.value);
if (latestBookError.value) console.error('Failed to fetch latest book:', latestBookError.value);

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