import type { ReadingSummary } from '~/types/reading';

export class ReadingService {
  private readonly apiBase = 'https://api.rsywx.com'; // Replace with your actual API base URL

  async getReadingData(): Promise<ReadingSummary> {
    const apiUrl = `${this.apiBase}/read/summary`; // Replace with your actual API endpoint

    try {
      const { data, error } = await useFetch<ReadingSummary>(apiUrl);

      if (error.value) {
        throw error.value;
      }

      return data.value || { hc: 0, rc: 0 }; // Provide default values in case of an empty response
    } catch (error: any) {
      console.error('Failed to fetch reading data:', error);
      throw error;
    }
  }
}