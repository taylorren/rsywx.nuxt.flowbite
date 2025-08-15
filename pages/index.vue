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

        <div ref="recentVisitBookRef" class="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] xl:w-[calc(25%-0.75rem)]">
          <RecentVisitBookCard :book="recentVisitBook?.[0] || null" />
        </div>
        <div ref="forgetBookRef" class="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] xl:w-[calc(25%-0.75rem)]">
          <ForgetBookCard :book="forgetBook?.[0] || null" />
        </div>
        <div ref="todayBooksRef" class="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] xl:w-[calc(25%-0.75rem)]">
          <BookTodayCard :todayBooks="todayBooks || []" />
        </div>
        <div ref="visitStatsRef" class="w-full md:w-[calc(100%-0.5rem)] lg:w-[calc(66.666%-0.667rem)] xl:w-[calc(50%-0.75rem)]">
          <VisitStatsCard :visitStats="visitStats" />
        </div>
        <!-- Add more 藏书 cards here -->
      </div>

      <!-- Random Books Section -->
      <div ref="randomBookRef" class="mb-8">
        <BookRandomCard :randomBooks="randomBook" @refresh="refreshRandomBook" />
      </div>

      <!-- 读书 Group -->
      <h2 class="text-2xl font-semibold mb-2 dark:text-white">读书</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <!-- Reading Summary Card -->
        <div>
          <ReadingSummaryCard :readingData="readingData" />
        </div>
        <div>
          <LatestReadingCard :latestReadings="latestReading" />
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
        <div>
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
import LatestBookCard from '~/components/home/LatestBookCard.vue';
import BookRandomCard from '~/components/home/BookRandomCard.vue';
import RecentVisitBookCard from '~/components/home/RecentVisitBookCard.vue';
import ForgetBookCard from '~/components/home/ForgetBookCard.vue';
import BookTodayCard from '~/components/home/BookTodayCard.vue';
import VisitStatsCard from '~/components/home/VisitStatsCard.vue';
import ReadingSummaryCard from '~/components/home/ReadingSummaryCard.vue';
import LatestReadingCard from '~/components/home/LatestReadingCard.vue';
import QotdCard from '~/components/home/QotdCard.vue';
import WotdCard from '~/components/home/WotdCard.vue';

// 导入组合式API
import { useAppData } from '~/composables/useAppData';
import { performanceAnalyzer, timedWithCategory } from '~/utils/performanceAnalyzer';
import { loadTimeAnalyzer } from '~/utils/loadTimeBreakdown';

// 使用优化的应用数据管理
const appData = useAppData();

// 解构需要的数据和方法
const {
  summary,
  summaryError,
  latestBook,
  latestBookError,
  randomBook,
  recentVisitBook,
  forgetBook,
  todayBooks,
  refreshRandomBook
} = appData.books;

const {
  visitStats
} = appData.visits;

const {
  readingData,
  latestReading
} = appData.reading;

const {
  qotd,
  error: qotdError,
  isLoading: qotdLoading
} = appData.qotd;

// 创建元素引用
const randomBookRef = ref<HTMLElement | null>(null);
const recentVisitBookRef = ref<HTMLElement | null>(null);
const forgetBookRef = ref<HTMLElement | null>(null);
const todayBooksRef = ref<HTMLElement | null>(null);
const visitStatsRef = ref<HTMLElement | null>(null);
const qotdRef = ref<HTMLElement | null>(null);

// 在组件挂载后使用优化的加载策略
onMounted(async () => {
  // 🎯 Start comprehensive performance analysis
  performanceAnalyzer.startPageLoad();
  loadTimeAnalyzer.startAnalysis();
  performanceAnalyzer.start('Page Mount', 'processing');
  

  
  // Track load phases for detailed breakdown
  loadTimeAnalyzer.startPhase('Initial Connection');
  
  // Skip network optimizations to avoid unnecessary preloading
  // loadTimeAnalyzer.startPhase('Network Optimizations');
  // await quickOptimizations();
  // loadTimeAnalyzer.endPhase('Network Optimizations');
  
  // Mark critical path operations
  performanceAnalyzer.markCritical('API: Books Summary');
  performanceAnalyzer.markCritical('API: Latest Book');
  
  // Track external resource loading
  loadTimeAnalyzer.startPhase('External Resources');
  await trackExternalResources();
  loadTimeAnalyzer.endPhase('External Resources');
  
  // Track component rendering
  loadTimeAnalyzer.startPhase('Component Rendering');
  performanceAnalyzer.start('Component Rendering', 'rendering');
  
  try {
    // Track API calls phase
    loadTimeAnalyzer.startPhase('API Calls');
    
    // 使用优化的加载策略
    await timedWithCategory('App Data Loading', 'processing', async () => {
      await appData.loadAllData();
    })();
    
    loadTimeAnalyzer.endPhase('API Calls');
    loadTimeAnalyzer.endPhase('Component Rendering');
    loadTimeAnalyzer.endPhase('Initial Connection');
    
    performanceAnalyzer.end('Component Rendering');
    performanceAnalyzer.end('Page Mount');
    

    
  } catch (error) {
    loadTimeAnalyzer.endPhase('API Calls');
    loadTimeAnalyzer.endPhase('Component Rendering');
    loadTimeAnalyzer.endPhase('Initial Connection');
    performanceAnalyzer.end('Component Rendering', error as Error);
    performanceAnalyzer.end('Page Mount', error as Error);
    console.error('❌ Page loading failed:', error);
  }
});

// Track external resource loading performance
async function trackExternalResources() {
  const externalResources = [
    'https://api.rsywx.com/covers/undefined.jpg',
    'https://mirrors.creativecommons.org/presskit/icons/cc.svg',
    'https://mirrors.creativecommons.org/presskit/icons/by.svg',
    'https://mirrors.creativecommons.org/presskit/icons/nc.svg',
    'https://mirrors.creativecommons.org/presskit/icons/nd.svg'
  ];
  
  for (const resource of externalResources) {
    const resourceName = `External: ${resource.split('/').pop()}`;
    performanceAnalyzer.start(resourceName, 'network', { url: resource });
    
    try {
      await fetch(resource, { method: 'HEAD' });
      performanceAnalyzer.end(resourceName);
    } catch (error) {
      performanceAnalyzer.end(resourceName, error as Error);
    }
  }
}



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

// Date calculation - client side only
const currentDate = new Date();
const cur_year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1;
const date = currentDate.getDate();
</script>