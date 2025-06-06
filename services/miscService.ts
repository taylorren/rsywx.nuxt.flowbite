// filepath: services/miscService.ts
import type { Weather, Word, Qotd } from '~/types/misc';

export class MiscService {
  private readonly apiBase = 'https://api.rsywx.com';
  private readonly $fetch: typeof globalThis.$fetch;
  
  constructor($fetch: typeof globalThis.$fetch = globalThis.$fetch) {
    this.$fetch = $fetch;
  }

  /**
   * Fetches the current weather data
   * @returns Weather data object
   */
  async getWeather(): Promise<Weather> {
    const apiUrl = `${this.apiBase}/weather`;
    
    try {
      const data = await this.$fetch<Weather>(apiUrl);
      return data;
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
    const apiUrl = `${this.apiBase}/misc/wotd`;
    
    try {
      const data = await this.$fetch<Word>(apiUrl);
      return data;
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
    const apiUrl = `${this.apiBase}/qotd`;
    
    try {
      const data = await this.$fetch<Qotd>(apiUrl);
      return data;
    } catch (error: any) {
      console.error('Failed to fetch quote of the day:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const miscService = new MiscService();