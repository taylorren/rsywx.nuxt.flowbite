import type { LatestReading, ReadingSummary } from '~/types/reading';

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

  async getLatestReading(): Promise<LatestReading> {
    const apiUrl = `${this.apiBase}/read/latest`;

    try {
      const { data, error } = await useFetch<LatestReading>(apiUrl);

      if (error.value) {
        throw error.value;
      }

      return data.value || {
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