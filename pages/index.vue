<template>
  <div class="min-h-screen py-8">
    <div class="container mx-auto px-4">
      <!-- API迁移通知 -->
      <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 dark:bg-yellow-900 dark:text-yellow-200">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm">
              <strong>API迁移通知：</strong>后端API已重写，大部分功能已恢复。随机书籍功能、访问统计和每日一词已正常工作。详情请查看 <a href="/API_MIGRATION.md" class="underline">API迁移指南</a>。
            </p>
          </div>
        </div>
      </div>
      
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
        <div ref="randomBookRef" class="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] xl:w-[calc(25%-0.75rem)]">
          <BookRandomCard :randomBook="randomBook?.[0] || null" @refresh="refreshRandomBook" />
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

      <!-- 读书 Group -->
      <h2 class="text-2xl font-semibold mb-2 dark:text-white">读书</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <!-- 暂时不可用的读书功能 -->
        <div>
          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md p-4 h-full flex items-center justify-center">
            <div class="text-center text-gray-500 dark:text-gray-400">
              <svg class="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p class="text-sm font-medium">读书统计</p>
              <p class="text-xs">暂时不可用</p>
            </div>
          </div>
        </div>
        <div>
          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md p-4 h-full flex items-center justify-center">
            <div class="text-center text-gray-500 dark:text-gray-400">
              <svg class="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 01-6 2.292m0-14.25v14.25" />
              </svg>
              <p class="text-sm font-medium">最新阅读</p>
              <p class="text-xs">暂时不可用</p>
            </div>
          </div>
        </div>
        <!-- Add more 读书 cards here -->
      </div>

      <!-- 其他功能 Group -->
      <h2 class="text-2xl font-semibold mb-2 dark:text-white">其他功能</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <!-- 暂时不可用的其他功能 -->
        <div>
          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md p-4 h-full flex items-center justify-center">
            <div class="text-center text-gray-500 dark:text-gray-400">
              <svg class="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <p class="text-sm font-medium">每日一句</p>
              <p class="text-xs">暂时不可用</p>
            </div>
          </div>
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
import { useAppData } from '~/composables/useAppData';
import { useIntersectionObserver } from '~/composables/useIntersectionObserver';
import { performanceAnalyzer, timedWithCategory } from '~/utils/performanceAnalyzer';
import { quickOptimizations, networkOptimizer } from '~/utils/networkOptimizer';
import { loadTimeAnalyzer, analyzeFullLoadTime } from '~/utils/loadTimeBreakdown';
import { generateAndSaveReport, performanceReporter } from '~/utils/performanceReporter';

// 使用优化的应用数据管理
const appData = useAppData();

// 解构需要的数据和方法
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
  refreshRandomBook
} = appData.books;

const {
  readingData,
  readingError,
  latestReading,
  latestReadingError
} = appData.reading;

const {
  visitStats,
  visitStatsError
} = appData.visits;

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

// 在组件挂载后使用优化的加载策略
onMounted(async () => {
  // 🎯 Start comprehensive performance analysis
  performanceAnalyzer.startPageLoad();
  loadTimeAnalyzer.startAnalysis();
  performanceAnalyzer.start('Page Mount', 'processing');
  
  console.log('🎯 Index page mounted, starting comprehensive performance analysis...');
  
  // Track load phases for detailed breakdown
  loadTimeAnalyzer.startPhase('Initial Connection');
  
  // Apply quick optimizations first
  loadTimeAnalyzer.startPhase('Network Optimizations');
  await quickOptimizations();
  loadTimeAnalyzer.endPhase('Network Optimizations');
  
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
    
    // Simple completion log after 2 seconds
    setTimeout(() => {
      console.log('✅ App loading completed successfully');
      console.log('📊 Data Status:');
      console.log('   Summary:', summary.value ? '✅ Loaded' : '❌ Failed');
      console.log('   Latest Book:', latestBook.value ? '✅ Loaded' : '❌ Failed');
      console.log('   Random Book:', randomBook.value ? '✅ Loaded' : '❌ Failed');
      console.log('   Recent Visit:', recentVisitBook.value ? '✅ Loaded' : '❌ Failed');
      console.log('   Forgotten Books:', forgetBook.value ? '✅ Loaded' : '❌ Failed');
      console.log('   Today Books:', todayBooks.value ? '✅ Loaded' : '❌ Failed');
    }, 2000);
    
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
      const response = await fetch(resource, { method: 'HEAD' });
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

const currentDate = new Date();
const cur_year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1;
const date = currentDate.getDate();
</script>