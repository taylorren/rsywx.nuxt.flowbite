// filepath: services/visitService.ts
import type { VisitStatsArray, VisitHistoryResponse, VisitHistoryItem } from '~/types/visit';
import { useRuntimeConfig } from '#app';
import { timedWithCategory } from '~/utils/performanceAnalyzer';

export class VisitService {
  private readonly $fetch: typeof globalThis.$fetch;
  
  constructor($fetch: typeof globalThis.$fetch = globalThis.$fetch) {
    this.$fetch = $fetch;
  }

  /**
   * 获取访问历史数据 (新API)
   * @param days 获取多少天的数据 (默认30天，最大365天)
   * @returns 访问历史数据
   */
  async getVisitHistory(days: number = 30): Promise<VisitHistoryResponse> {
    return await timedWithCategory('API: Visit History', 'api', async (): Promise<VisitHistoryResponse> => {
      const config = useRuntimeConfig();
      const apiBase = config.public.apiBase || '/api';
      const apiKey = (config.public.apiKey as string) || 'your-api-key';
      const apiUrl = `${apiBase}/books/visit_history?days=${days}`;

      try {
        const response = await this.$fetch<VisitHistoryResponse>(apiUrl, {
          headers: {
            'X-API-Key': apiKey
          }
        });
        return response;
      } catch (error: any) {
        console.error('获取访问历史数据失败:', error);
        throw error;
      }
    })();
  }

  /**
   * 获取过去30天的访问统计数据 (旧格式，保持兼容性)
   * @returns 包含最多30天访问统计的数组
   */
  async getVisitStats(): Promise<VisitStatsArray> {
    return await timedWithCategory('API: Visit Stats (Legacy)', 'api', async (): Promise<VisitStatsArray> => {
      try {
        // 使用新API获取数据
        const historyResponse = await this.getVisitHistory(30);
        
        // 转换为旧格式以保持兼容性
        return historyResponse.data.map(item => ({
          vc: item.visit_count,
          vd: item.date
        }));
      } catch (error) {
        console.error('获取访问统计数据失败:', error);
        throw error;
      }
    })();
  }
}
// 创建单例实例
export const visitService = new VisitService();