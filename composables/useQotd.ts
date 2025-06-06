// composables/useQotd.ts
import { ref } from 'vue';
import { miscService } from '~/services/miscService';
import type { Qotd } from '~/types/misc';

/**
 * 提供每日一句相关功能的组合式API
 * @returns 每日一句相关的状态和方法
 */
export function useQotd() {
  const qotd = ref<Qotd | null>(null);
  const error = ref<Error | null>(null);
  const isLoading = ref(false);
  
  // 获取每日一句
  const fetchQotd = async () => {
    isLoading.value = true;
    
    try {
      qotd.value = await miscService.getQuoteOfTheDay();
    } catch (err) {
      error.value = err as Error;
      console.error('Failed to fetch quote of the day:', err);
    } finally {
      isLoading.value = false;
    }
  };
  
  // 刷新每日一句
  const refreshQotd = async () => {
    await fetchQotd();
  };
  
  return {
    // 状态
    qotd,
    error,
    isLoading,
    
    // 方法
    fetchQotd,
    refreshQotd
  };
}