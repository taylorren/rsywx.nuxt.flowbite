// composables/useWotd.ts
import { ref } from 'vue';
import { miscService } from '~/services/miscService';
import type { Word } from '~/types/misc';

/**
 * 提供每日单词相关功能的组合式API
 * @returns 每日单词相关的状态和方法
 */
export function useWotd() {
  const wotd = ref<Word | null>(null);
  const error = ref<Error | null>(null);
  const isLoading = ref(false);
  
  // 获取每日单词
  const fetchWotd = async () => {
    isLoading.value = true;
    
    try {
      wotd.value = await miscService.getWordOfTheDay();
    } catch (err) {
      error.value = err as Error;
      console.error('Failed to fetch word of the day:', err);
    } finally {
      isLoading.value = false;
    }
  };
  
  // 刷新每日单词
  const refreshWotd = async () => {
    await fetchWotd();
  };
  
  // 初始加载
  fetchWotd();
  
  return {
    wotd,
    error,
    isLoading,
    fetchWotd,
    refreshWotd
  };
}