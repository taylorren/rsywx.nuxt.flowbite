// composables/useBooks.ts
import { ref, nextTick } from 'vue';
import { BookService } from '~/services/bookService';
import type { BooksSummary, LatestBook, RandomBook, RecentBook, ForgetBook, TodayBook } from '~/types/book';

/**
 * 提供书籍相关功能的组合式API
 * @param $fetch 可选的fetch实例
 * @returns 书籍相关的状态和方法
 */
export function useBooks($fetch: typeof globalThis.$fetch = globalThis.$fetch) {
  const bookService = new BookService($fetch);

  // 关键数据（立即加载）
  const summary = ref<BooksSummary | null>(null);
  const summaryError = ref<Error | null>(null);

  const latestBook = ref<LatestBook | null>(null);
  const latestBookError = ref<Error | null>(null);

  // 非关键数据（延迟加载）
  const randomBook = ref<RandomBook[] | null>(null);
  const randomBookError = ref<Error | null>(null);
  const randomBookLoaded = ref(false);

  const recentVisitBook = ref<RecentBook[] | null>(null);
  const recentVisitBookError = ref<Error | null>(null);
  const recentVisitBookLoaded = ref(false);

  const forgetBook = ref<ForgetBook[] | null>(null);
  const forgetBookError = ref<Error | null>(null);
  const forgetBookLoaded = ref(false);

  const todayBook = ref<TodayBook[] | null>(null);
  const todayBookError = ref<Error | null>(null);
  const todayBookLoaded = ref(false);

  // 加载关键数据
  const loadSummary = async () => {
    try {
      summary.value = await bookService.getBooksSummary();
    } catch (error) {
      summaryError.value = error as Error;
      console.error('❌ Failed to fetch book summary:', error);
    }
  };

  const loadLatestBook = async () => {
    try {
      latestBook.value = await bookService.getLatestBook();
    } catch (error) {
      latestBookError.value = error as Error;
      console.error('Failed to fetch latest book:', error);
    }
  };

  // 加载非关键数据的方法
  const loadRandomBook = async () => {
    if (randomBookLoaded.value) {
      return;
    }

    try {
      randomBook.value = await bookService.getRandomBooks(4); // Get 4 random books
      randomBookLoaded.value = true;
      await nextTick(); // 等待DOM更新
    } catch (error) {
      randomBookError.value = error as Error;
      console.error('❌ Failed to fetch random books:', error);
    }
  };

  // 刷新随机书籍的方法
  const refreshRandomBook = async (count: number = 4) => {
    try {
      randomBook.value = await bookService.getRandomBooks(count, true); // Get random books with refresh
    } catch (error) {
      randomBookError.value = error as Error;
      console.error('❌ Failed to refresh random books:', error);
    }
  };

  const loadRecentVisitBook = async () => {
    if (recentVisitBookLoaded.value) {
      return;
    }

    try {
      recentVisitBook.value = await bookService.getRecentBooks();
      recentVisitBookLoaded.value = true;
      await nextTick(); // 等待DOM更新
    } catch (error) {
      recentVisitBookError.value = error as Error;
      console.error('❌ Failed to fetch recent visit book:', error);
    }
  };

  const loadForgetBook = async () => {
    if (forgetBookLoaded.value) {
      return;
    }

    try {
      forgetBook.value = await bookService.getForgetBooks();
      forgetBookLoaded.value = true;
      await nextTick(); // 等待DOM更新
    } catch (error) {
      forgetBookError.value = error as Error;
      console.error('❌ Failed to fetch forget book:', error);
    }
  };

  const loadTodayBook = async () => {
    if (todayBookLoaded.value) {
      return;
    }

    try {
      todayBook.value = await bookService.getTodayBooks();
      todayBookLoaded.value = true;
      await nextTick(); // 等待DOM更新
    } catch (error) {
      todayBookError.value = error as Error;
      console.error('❌ Failed to fetch today books:', error);
    }
  };

  // 初始加载关键数据
  const initializeKeyData = async () => {
    await Promise.all([
      loadSummary(),
      loadLatestBook()
    ]);
  };

    // 重置加载状态标志
  const resetLoadedFlags = () => {
    randomBookLoaded.value = false;
    recentVisitBookLoaded.value = false;
    forgetBookLoaded.value = false;
    todayBookLoaded.value = false;
  };  // 批量加载所有非关键数据
  const loadAllNonCriticalData = async () => {
    const startTime = performance.now();

    try {
      const results = await Promise.allSettled([
        loadRandomBook(),
        loadRecentVisitBook(),
        loadForgetBook(),
        loadTodayBook()
      ]);

      // Log individual results for debugging
      const taskNames = ['Random Book', 'Recent Visit Book', 'Forget Book', 'Today Books'];
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`❌ ${taskNames[index]} failed:`, result.reason);
        } else {
        }
      });

      const endTime = performance.now();
      console.log(`✅ All non-critical data loaded in ${(endTime - startTime).toFixed(2)}ms`);
    } catch (error) {
      console.error('❌ Error loading non-critical data:', error);
    }
  };

  // 使用批量API优化加载所有书籍数据
  const loadAllBooksDataOptimized = async () => {
    try {
      const batchData = await bookService.loadBooksDataBatch();

      // 更新所有相关状态
      summary.value = batchData.summary;
      latestBook.value = batchData.latestBook;
      randomBook.value = batchData.randomBooks;
      recentVisitBook.value = batchData.recentBooks;
      forgetBook.value = batchData.forgetBooks;
      todayBook.value = batchData.todayBooks;

      // 标记所有数据为已加载
      randomBookLoaded.value = true;
      recentVisitBookLoaded.value = true;
      forgetBookLoaded.value = true;
      todayBookLoaded.value = true;

    } catch (error) {
      console.error('❌ Optimized batch loading failed:', error);
      // 重置标志并回退到单独加载
      console.log('🔄 Falling back to individual API calls...');
      resetLoadedFlags();
      await loadAllNonCriticalData();
    }
  };

  return {
    // 状态
    summary,
    summaryError,
    latestBook,
    latestBookError,
    randomBook,
    randomBookError,
    randomBookLoaded,
    recentVisitBook,
    recentVisitBookError,
    recentVisitBookLoaded,
    forgetBook,
    forgetBookError,
    forgetBookLoaded,
    todayBook,
    todayBookError,
    todayBookLoaded,

    // 方法
    loadSummary,
    loadLatestBook,
    loadRandomBook,
    refreshRandomBook,
    loadRecentVisitBook,
    loadForgetBook,
    loadTodayBook,
    resetLoadedFlags,
    initializeKeyData,
    loadAllNonCriticalData,
    loadAllBooksDataOptimized
  };
}