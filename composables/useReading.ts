// composables/useReading.ts
import { ref, nextTick } from 'vue';
import { ReadingService } from '~/services/readingService';
import type { ReadingSummary, LatestReading } from '~/types/reading';

/**
 * 提供阅读相关功能的组合式API
 * @returns 阅读相关的状态和方法
 */
export function useReading() {
  const readingService = new ReadingService();
  
  // 阅读数据
  const readingData = ref<ReadingSummary | null>(null);
  const readingError = ref<Error | null>(null);
  const readingDataLoaded = ref(false);
  
  // 最新阅读
  const latestReading = ref<LatestReading | null>(null);
  const latestReadingError = ref<Error | null>(null);
  const latestReadingLoaded = ref(false);
  
  // 加载阅读数据
  const loadReadingData = async () => {
    if (readingDataLoaded.value) return;
    
    try {
      readingData.value = await readingService.getReadingData();
      readingDataLoaded.value = true;
      await nextTick(); // 等待DOM更新
    } catch (error) {
      readingError.value = error as Error;
      console.error('Failed to fetch reading data:', error);
    }
  };
  
  // 加载最新阅读
  const loadLatestReading = async () => {
    if (latestReadingLoaded.value) return;
    
    try {
      latestReading.value = await readingService.getLatestReading();
      latestReadingLoaded.value = true;
      await nextTick(); // 等待DOM更新
    } catch (error) {
      latestReadingError.value = error as Error;
      console.error('Failed to fetch latest reading:', error);
    }
  };
  
  return {
    // 状态
    readingData,
    readingError,
    readingDataLoaded,
    latestReading,
    latestReadingError,
    latestReadingLoaded,
    
    // 方法
    loadReadingData,
    loadLatestReading
  };
}