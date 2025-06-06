// composables/useVisits.ts
import { ref, nextTick } from 'vue';
import { visitService } from '~/services/visitService';
import type { VisitStatsArray } from '~/types/visit';

/**
 * 提供访问统计相关功能的组合式API
 * @returns 访问统计相关的状态和方法
 */
export function useVisits() {
  // 访问统计数据
  const visitStats = ref<VisitStatsArray | null>(null);
  const visitStatsError = ref<Error | null>(null);
  const visitStatsLoaded = ref(false);
  
  // 加载访问统计数据
  const loadVisitStats = async () => {
    if (visitStatsLoaded.value) return;
    
    try {
      visitStats.value = await visitService.getVisitStats();
      visitStatsLoaded.value = true;
      await nextTick(); // 等待DOM更新
    } catch (error) {
      visitStatsError.value = error as Error;
      console.error('Failed to fetch visit stats:', error);
    }
  };
  
  return {
    // 状态
    visitStats,
    visitStatsError,
    visitStatsLoaded,
    
    // 方法
    loadVisitStats
  };
}