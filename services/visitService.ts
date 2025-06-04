// filepath: services/visitService.ts
import type { VisitStatsArray } from '~/types/visit';

export class VisitService {
  private readonly apiBase = 'https://api.rsywx.com';

  /**
   * 获取过去30天的访问统计数据
   * @returns 包含最多30天访问统计的数组
   */
  async getVisitStats(): Promise<VisitStatsArray> {
    const apiUrl = `${this.apiBase}/admin/visitByDay`;

    try {
      const { data, error } = await useFetch<VisitStatsArray>(apiUrl);

      if (error.value) {
        throw error.value;
      }

      return data.value || []; // 如果没有数据，返回空数组
    } catch (error: any) {
      console.error('获取访问统计数据失败:', error);
      throw error;
    }
  }
}
// 创建单例实例
export const visitService = new VisitService();