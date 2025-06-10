<template>
  <div class="min-h-screen py-8">
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

      <!-- 其他功能 Group -->
      <h2 class="text-2xl font-semibold mb-2 dark:text-white">其他功能</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <!-- QOTD Card -->
        <div ref="qotdRef">
          <QotdCard />
        </div>
        <!-- WOTD Card -->
        <div ref="wotdRef">
          <WotdCard />
        </div>
        <!-- Add more cards here -->
      </div>

      <!-- 访问统计 Group -->
      <!-- 已移除访问统计部分，将卡片移到藏书信息部分 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 导入组件
import BookSummaryCard from '~/components/home/BookSummaryCard.vue';
import ReadingSummaryCard from '~/components/home/ReadingSummaryCard.vue';
import LatestBookCard from '~/components/home/LatestBookCard.vue';
import LatestReadingCard from '~/components/home/LatestReadingCard.vue';
import BookRandomCard from '~/components/home/BookRandomCard.vue';
import RecentVisitBookCard from '~/components/home/RecentVisitBookCard.vue';
import ForgetBookCard from '~/components/home/ForgetBookCard.vue';
import BookTodayCard from '~/components/home/BookTodayCard.vue';
import VisitStatsCard from '~/components/home/VisitStatsCard.vue';
import QotdCard from '~/components/home/QotdCard.vue';
import WotdCard from '~/components/home/WotdCard.vue';

// 导入组合式API
import { useBooks } from '~/composables/useBooks';
import { useReading } from '~/composables/useReading';
import { useVisits } from '~/composables/useVisits';
import { useIntersectionObserver } from '~/composables/useIntersectionObserver';

// 使用组合式API
const {
  summary,
  summaryError,
  latestBook,
  latestBookError,
  randomBook,
  randomBookError,
  recentVisitBook,
  recentVisitBookError,
  forgetBook,
  forgetBookError,
  todayBooks,
  todayBooksError,
  loadRandomBook,
  loadRecentVisitBook,
  loadForgetBook,
  loadTodayBooks,
  refreshRandomBook,
  initializeKeyData
} = useBooks();

const {
  readingData,
  readingError,
  latestReading,
  latestReadingError,
  loadReadingData,
  loadLatestReading
} = useReading();

const {
  visitStats,
  visitStatsError,
  loadVisitStats
} = useVisits();

// 初始化关键数据
initializeKeyData();

// 创建元素引用
const randomBookRef = ref<HTMLElement | null>(null);
const recentVisitBookRef = ref<HTMLElement | null>(null);
const forgetBookRef = ref<HTMLElement | null>(null);
const todayBooksRef = ref<HTMLElement | null>(null);
const visitStatsRef = ref<HTMLElement | null>(null);
const readingDataRef = ref<HTMLElement | null>(null);
const latestReadingRef = ref<HTMLElement | null>(null);
const qotdRef = ref<HTMLElement | null>(null);

// 使用Intersection Observer管理延迟加载
const { observe } = useIntersectionObserver();

// 在组件挂载后设置观察者
onMounted(() => {
  // 观察所有需要延迟加载的组件
  observe(randomBookRef.value, loadRandomBook);
  observe(recentVisitBookRef.value, loadRecentVisitBook);
  observe(forgetBookRef.value, loadForgetBook);
  observe(todayBooksRef.value, loadTodayBooks);
  observe(visitStatsRef.value, loadVisitStats);
  observe(readingDataRef.value, loadReadingData);
  observe(latestReadingRef.value, loadLatestReading);
  // QotdCard组件会自行加载数据
  observe(qotdRef.value, () => {});
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