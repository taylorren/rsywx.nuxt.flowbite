// composables/useBooks.ts
import { ref, nextTick } from 'vue';
import { BookService } from '~/services/bookService';
import type { BooksSummary, RandomBook, RecentBook, ForgetBook, TodayBook } from '~/types/book';

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
  
  const latestBook = ref<any | null>(null);
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
  
  const todayBooks = ref<TodayBook[] | null>(null);
  const todayBooksError = ref<Error | null>(null);
  const todayBooksLoaded = ref(false);
  
  // 加载关键数据
  const loadSummary = async () => {
    try {
      summary.value = await bookService.getBooksSummary();
    } catch (error) {
      summaryError.value = error as Error;
      console.error('Failed to fetch book summary:', error);
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
    if (randomBookLoaded.value) return;
    
    try {
      randomBook.value = await bookService.getRandomBooks();
      randomBookLoaded.value = true;
      await nextTick(); // 等待DOM更新
    } catch (error) {
      randomBookError.value = error as Error;
      console.error('Failed to fetch random book:', error);
    }
  };
  
  // 刷新随机书籍的方法
  const refreshRandomBook = async () => {
    try {
      randomBook.value = await bookService.getRandomBooks();
    } catch (error) {
      randomBookError.value = error as Error;
      console.error('Failed to fetch random book:', error);
    }
  };
  
  const loadRecentVisitBook = async () => {
    if (recentVisitBookLoaded.value) return;
    
    try {
      recentVisitBook.value = await bookService.getRecentBooks();
      recentVisitBookLoaded.value = true;
      await nextTick(); // 等待DOM更新
    } catch (error) {
      recentVisitBookError.value = error as Error;
      console.error('Failed to fetch recent visit book:', error);
    }
  };
  
  const loadForgetBook = async () => {
    if (forgetBookLoaded.value) return;
    
    try {
      forgetBook.value = await bookService.getForgetBooks();
      forgetBookLoaded.value = true;
      await nextTick(); // 等待DOM更新
    } catch (error) {
      forgetBookError.value = error as Error;
      console.error('Failed to fetch forget book:', error);
    }
  };
  
  const loadTodayBooks = async () => {
    if (todayBooksLoaded.value) return;
    
    try {
      todayBooks.value = await bookService.getTodayBooks();
      todayBooksLoaded.value = true;
      await nextTick(); // 等待DOM更新
    } catch (error) {
      todayBooksError.value = error as Error;
      console.error('Failed to fetch today books:', error);
    }
  };
  
  // 初始加载关键数据
  const initializeKeyData = async () => {
    await Promise.all([
      loadSummary(),
      loadLatestBook()
    ]);
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
    todayBooks,
    todayBooksError,
    todayBooksLoaded,
    
    // 方法
    loadSummary,
    loadLatestBook,
    loadRandomBook,
    refreshRandomBook,
    loadRecentVisitBook,
    loadForgetBook,
    loadTodayBooks,
    initializeKeyData
  };
}