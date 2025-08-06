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
     const apiUrl = `${apiBase}/read/summary`;

    try {
      const response = await this.$fetch<{success: boolean, data: ReadingSummary}>(apiUrl, {
        headers: {
          'X-API-Key': apiKey
        }
      });
      return response.data || { hc: 0, rc: 0 }; // Provide default values in case of an empty response
    } catch (error: any) {
      console.error('Failed to fetch reading data:', error);
      throw error;
    }
  }

  async getLatestReading(): Promise<LatestReading> {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || '/api';
     const apiKey = (config.public.apiKey as string) || 'your-api-key';
     const apiUrl = `${apiBase}/read/latest`;

    try {
      const response = await this.$fetch<{success: boolean, data: LatestReading}>(apiUrl, {
        headers: {
          'X-API-Key': apiKey
        }
      });
      return response.data || {
        hid: 0,
        bid: 0,
        reviewtitle: 'No reading yet',
        create_at: '',
        display: 0,
        id: -1,
        title: 'No reading yet',
        datein: '',
        uri: '',
        feature: '',
        book_reviewcol: null,
        book_title: '',
        book_bookid: ''
      };
    } catch (error: any) {
      console.error('Failed to fetch latest reading:', error);
      throw error;
    }
  }
}