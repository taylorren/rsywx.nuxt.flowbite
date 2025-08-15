import type { LatestReading, ReadingSummary } from '~/types/reading';
import { useRuntimeConfig } from '#app';

export class ReadingService {
  private readonly $fetch: typeof globalThis.$fetch;
  
  constructor($fetch: typeof globalThis.$fetch = globalThis.$fetch) {
    this.$fetch = $fetch;
  }

  async getReadingData(): Promise<ReadingSummary> {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || '/api';
     const apiKey = (config.public.apiKey as string) || 'your-api-key';
     const apiUrl = `${apiBase}/readings/summary`;

    try {
      const response = await this.$fetch<{success: boolean, data: ReadingSummary}>(apiUrl, {
        headers: {
          'X-API-Key': apiKey
        }
      });
      return response.data || { 
        books_read: 0, 
        reviews_written: 0,
        reading_period: {
          earliest_date: '',
          latest_date: '',
          total_days: 0
        }
      };
    } catch (error: any) {
      console.error('Failed to fetch reading data:', error);
      throw error;
    }
  }

  async getLatestReading(count: number = 1): Promise<LatestReading[]> {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || '/api';
     const apiKey = (config.public.apiKey as string) || 'your-api-key';
     const apiUrl = `${apiBase}/readings/latest/${count}`;

    try {
      const response = await this.$fetch<{success: boolean, data: LatestReading[]}>(apiUrl, {
        headers: {
          'X-API-Key': apiKey
        }
      });
      return response.data || [];
    } catch (error: any) {
      console.error('Failed to fetch latest reading:', error);
      throw error;
    }
  }
}