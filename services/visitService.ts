// filepath: services/visitService.ts
import type { VisitStatsArray } from '~/types/visit';
import { useRuntimeConfig } from '#app';

export class VisitService {
  private readonly $fetch: typeof globalThis.$fetch;
  
  constructor($fetch: typeof globalThis.$fetch = globalThis.$fetch) {
    this.$fetch = $fetch;
  }

  /**
   * 获取过去30天的访问统计数据
   * @returns 包含最多30天访问统计的数组
   */
  async getVisitStats(): Promise<VisitStatsArray> {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || '/api';
     const apiKey = (config.public.apiKey as string) || 'your-api-key';
     const apiUrl = `${apiBase}/admin/visitByDay`;

    try {
      const response = await this.$fetch<{success: boolean, data: VisitStatsArray}>(apiUrl, {
        headers: {
          'X-API-Key': apiKey
        }
      });
      return response.data || []; // 如果没有数据，返回空数组
    } catch (error: any) {
      console.error('获取访问统计数据失败:', error);
      throw error;
    }
  }
}
// 创建单例实例
export const visitService = new VisitService();