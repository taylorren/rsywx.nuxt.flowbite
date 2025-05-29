// filepath: services/bookService.ts
import type { Book, BooksSummary } from '~/types/book';

export class BookService {
    private readonly apiBase = 'https://api.rsywx.com';

    async getBooksSummary(): Promise<BooksSummary> {
        const apiUrl=this.apiBase+"/book/summary";
        try {
            const { data, error } = await useFetch<BooksSummary>(apiUrl);

            if (error.value) {
                throw error.value;
            }

            return data.value || { bc: 0, pc: '', wc: '' };
        } catch (error: any) {
            console.error('Failed to fetch book summary:', error);
            throw error;
        }
    }
}