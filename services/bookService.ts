// filepath: services/bookService.ts
import type { Book, BooksSummary, RandomBook, RecentBook, ForgetBook, TodayBook, BookTags } from '~/types/book';
import { useRuntimeConfig } from '#app';

// API response type for books status endpoint
interface BooksStatusApiResponse {
    total_books: number;
    total_pages: number;
    total_kwords: number;
    total_visits: number;
}

const defaultBook: Book = {
    id: -1,
    place: -1,
    publisher: -1,
    bookid: "",
    title: "",
    author: "",
    region: "",
    copyrighter: "",
    translated: 0,
    purchdate: "",
    price: 0,
    pubdate: "",
    printdate: "",
    ver: "",
    deco: "",
    kword: 0,
    page: 0,
    isbn: "",
    category: "",
    ol: "",
    intro: "",
    instock: 0,
    location: "",
    pu_name: "",
    pu_place: "",
    vc: 0,
    lvt: "",
    reviews: []
};

const defaultRandomBook: RandomBook[] = [{
    id: -1,
    bookid: "",
    title: "",
    author: "",
    publisher_name: "",
    place_name: "",
    cover_uri: "",
    total_visits: 0,
    last_visited: ""
}];

export class BookService {
    private readonly $fetch: typeof globalThis.$fetch;
    
    constructor($fetch: typeof globalThis.$fetch = globalThis.$fetch) {
        this.$fetch = $fetch;
    }

    async getBooksSummary(): Promise<BooksSummary> {
        const config = useRuntimeConfig();
        console.log('📋 Runtime config:', config);
        const apiBase = config.public.apiBase || '/api';
         const apiKey = (config.public.apiKey as string) || 'your-api-key';
         const apiUrl = apiBase + "/books/status";
        console.log('🌐 API URL:', apiUrl);
        console.log('🔑 API Key:', apiKey ? apiKey.substring(0, 8) + '...' : 'NOT SET');
        try {
            const response = await this.$fetch<{success: boolean, data: BooksSummary}>(apiUrl, {
                headers: {
                    'X-API-Key': apiKey
                }
            });
            console.log('📊 API Response:', response);
            // Map the API response to the expected BooksSummary format
            // API returns: { total_books: number, total_pages: number, total_kwords: number }
            // Component expects: { bc: number, pc: string, wc: string }
            const apiData = response.data as unknown as BooksStatusApiResponse;
            const mappedData = {
                bc: apiData?.total_books || 0,
                pc: (apiData?.total_pages || 0).toString(),
                wc: (apiData?.total_kwords || 0).toString(),
                vc: apiData?.total_visits || 0
            };
            console.log('🔄 Mapped data:', mappedData);
            return mappedData;
        } catch (error: any) {
            console.error('❌ Failed to fetch book summary:', error);
            throw error;
        }
    }

    async getLatestBook(): Promise<Book> {
        const config = useRuntimeConfig();
        const apiBase = config.public.apiBase || '/api';
         const apiKey = (config.public.apiKey as string) || 'your-api-key';
         const apiUrl = apiBase + "/books/latest/1";
        try {
            const response = await this.$fetch<{success: boolean, data: any[], cached: boolean}>(apiUrl, {
                headers: {
                    'X-API-Key': apiKey
                }
            });
            // 从数组中取第一个元素，并转换为Book格式
            const latestBookData = response.data?.[0];
            if (latestBookData) {
                return {
                    ...defaultBook,
                    id: latestBookData.id,
                    bookid: latestBookData.bookid,
                    title: latestBookData.title,
                    author: latestBookData.author,
                    purchdate: latestBookData.purchdate,
                    price: latestBookData.price,
                    pu_name: latestBookData.publisher_name,
                    pu_place: latestBookData.place_name
                };
            }
            return defaultBook;
        } catch (error: any) {
            console.error('Failed to fetch latest book:', error);
            throw error;
        }
    }

    async getRandomBooks(count: number = 1, refresh: boolean = false): Promise<RandomBook[]> {
        const config = useRuntimeConfig();
        const apiBase = config.public.apiBase || '/api';
         const apiKey = (config.public.apiKey as string) || 'your-api-key';
         let apiUrl = apiBase + `/books/random/${count}`;
        
        // Add refresh parameter to force cache refresh
        if (refresh) {
            apiUrl += `?refresh=true&t=${Date.now()}`;
        }
        
        try {
            const response = await this.$fetch<{success: boolean, data: RandomBook[], cached: boolean}>(apiUrl, {
                headers: {
                    'X-API-Key': apiKey
                }
            });
            
            return response.data || defaultRandomBook;
        } catch (error: any) {
            console.error('Failed to fetch random books:', error);
            return defaultRandomBook;
        }
    }
    
    // 获取最近访问的书籍
    async getRecentBooks(): Promise<RecentBook[]> {
        const config = useRuntimeConfig();
        const apiBase = config.public.apiBase || '/api';
        const apiKey = (config.public.apiKey as string) || 'your-api-key';
        const apiUrl = apiBase + "/books/last_visited/1";
        
        try {
            const response = await this.$fetch<{success: boolean, data: any[], cached: boolean}>(apiUrl, {
                headers: {
                    'X-API-Key': apiKey
                }
            });
            
            if (response.success && response.data && response.data.length > 0) {
                return response.data.map(item => ({
                    title: item.title,
                    bookid: item.bookid,
                    vc: item.vc || 0,
                    lvt: item.last_visited || '',
                    region: item.region || '未知'
                }));
            }
            return [];
        } catch (error: any) {
            console.error('Failed to fetch recent visit books:', error);
            return [];
        }
    }

    // 获取遗忘书籍
    async getForgetBooks(): Promise<ForgetBook[]> {
        const config = useRuntimeConfig();
        const apiBase = config.public.apiBase || '/api';
        const apiKey = (config.public.apiKey as string) || 'your-api-key';
        const apiUrl = apiBase + "/books/forgotten/1";
        
        try {
            const response = await this.$fetch<{success: boolean, data: any[], cached: boolean}>(apiUrl, {
                headers: {
                    'X-API-Key': apiKey
                }
            });
            
            if (response.success && response.data && response.data.length > 0) {
                return response.data.map(item => ({
                    title: item.title,
                    bookid: item.bookid,
                    author: item.author || '未知',
                    last_visited: item.last_visited || '',
                    days_since_visit: item.days_since_visit || 0
                }));
            }
            return [];
        } catch (error: any) {
            console.error('Failed to fetch forgotten books:', error);
            return [];
        }
    }

    // 注意：新API暂时不支持今日书籍功能
    async getTodayBooks(): Promise<TodayBook[]> {
        console.warn('Today books API is not available in the new API');
        return [];
    }



    // 注意：新API暂时不支持书籍标签功能
    async getTagsByBookid(bookid: string): Promise<BookTags> {
        console.warn('Book tags API is not available in the new API');
        return [];
    }

    async getBookDetail(bookid: string): Promise<Book> {
        // 获取书籍详情
        const config = useRuntimeConfig();
        const apiBase = config.public.apiBase || '/api';
         const apiKey = (config.public.apiKey as string) || 'your-api-key';
         const apiUrl = apiBase + "/books/" + bookid;
        
        try {
            const response = await this.$fetch<{success: boolean, data: Book, cached: boolean}>(apiUrl, {
                method: 'GET',
                headers: {
                    'X-API-Key': apiKey
                }
            });
            
            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error('Failed to fetch book detail');
            }
        } catch (error) {
            console.error('Error fetching book detail:', error);
            throw error;
        }
    }

    async getBookByBookid(bookid: string): Promise<{ book: Book; tags: BookTags }> {
        // 获取书籍详情
        const config = useRuntimeConfig();
        const apiBase = config.public.apiBase || '/api';
         const apiKey = (config.public.apiKey as string) || 'your-api-key';
         const apiUrl = apiBase + "/books/" + bookid;
        
        try {
            // 获取书籍信息
            const response = await this.$fetch<{success: boolean, data: any}>(apiUrl, {
                headers: {
                    'X-API-Key': apiKey
                }
            });
            
            const bookData = response.data;
            const book = bookData ? {
                ...defaultBook,
                id: bookData.id,
                bookid: bookData.bookid,
                title: bookData.title,
                author: bookData.author,
                purchdate: bookData.purchdate,
                price: bookData.price,
                pubdate: bookData.pubdate,
                printdate: bookData.printdate,
                ver: bookData.ver,
                page: bookData.page,
                isbn: bookData.isbn,
                category: bookData.category,
                intro: bookData.intro,
                instock: bookData.instock,
                location: bookData.location,
                pu_name: bookData.publisher_name,
                pu_place: bookData.place_name,
                vc: bookData.vc,
                lvt: bookData.lvt
            } : defaultBook;
            
            // 新API暂时没有标签信息，返回空数组
            const tags: BookTags = [];
            
            return { book, tags };
        } catch (error: any) {
            console.error(`Failed to fetch book ${bookid}:`, error);
            throw error;
        }
    }
}