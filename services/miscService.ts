// filepath: services/miscService.ts
import type { Weather, Word, Qotd } from '~/types/misc';
import { useRuntimeConfig } from '#app';

export class MiscService {
  private readonly $fetch: typeof globalThis.$fetch;
  
  constructor($fetch: typeof globalThis.$fetch = globalThis.$fetch) {
    this.$fetch = $fetch;
  }

  /**
   * Fetches the current weather data
   * @returns Weather data object
   */
  async getWeather(): Promise<Weather> {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || '/api';
     const apiKey = (config.public.apiKey as string) || 'your-api-key';
     const apiUrl = `${apiBase}/weather`;
    
    try {
      const response = await this.$fetch<{success: boolean, data: Weather}>(apiUrl, {
        headers: {
          'X-API-Key': apiKey
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch weather data:', error);
      throw error;
    }
  }

  /**
   * Fetches the word of the day
   * @returns Word of the day object
   */
  async getWordOfTheDay(): Promise<Word> {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || '/api';
     const apiKey = (config.public.apiKey as string) || 'your-api-key';
     const apiUrl = `${apiBase}/misc/wotd`;
    
    try {
      const response = await this.$fetch<{success: boolean, data: Word}>(apiUrl, {
        headers: {
          'X-API-Key': apiKey
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch word of the day:', error);
      throw error;
    }
  }

  /**
   * Fetches the quote of the day
   * @returns Quote of the day object
   */
  async getQuoteOfTheDay(): Promise<Qotd> {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || '/api';
     const apiKey = (config.public.apiKey as string) || 'your-api-key';
     const apiUrl = `${apiBase}/qotd`;
    
    try {
      const response = await this.$fetch<{success: boolean, data: Qotd}>(apiUrl, {
        headers: {
          'X-API-Key': apiKey
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch quote of the day:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const miscService = new MiscService();