// filepath: services/bookService.ts
import type { Book, BooksSummary, RandomBook, RecentBook, ForgetBook, TodayBook, BookTags } from '~/types/book';
import { useRuntimeConfig } from '#app';

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
    vc: 0,
    lvt: "",
    img: ""
}];

export class BookService {
    private readonly apiBase: string;
    private readonly $fetch: typeof globalThis.$fetch;
    
    constructor($fetch: typeof globalThis.$fetch = globalThis.$fetch) {
        const config = useRuntimeConfig();
        this.apiBase = config.public.apiBase || 'http://api.rsywx';
        this.$fetch = $fetch;
    }

    async getBooksSummary(): Promise<BooksSummary> {
        const apiUrl = this.apiBase + "/books/summary";
        try {
            const data = await this.$fetch<BooksSummary>(apiUrl);
            return data || { bc: 0, pc: '', wc: '' };
        } catch (error: any) {
            console.error('Failed to fetch book summary:', error);
            throw error;
        }
    }

    async getLatestBook(): Promise<Book> {
        const apiUrl = this.apiBase + "/books/latest";
        try {
            const data = await this.$fetch<Book>(apiUrl);
            return data || defaultBook;
        } catch (error: any) {
            console.error('Failed to fetch latest book:', error);
            throw error;
        }
    }

    async getRandomBooks(count: number = 1): Promise<RandomBook[]> {
        const apiUrl = this.apiBase + "/books/random/" + count;
        try {
            const data = await this.$fetch<RandomBook[]>(apiUrl);
            console.log("随机书籍：", data);
            return data || [];
        } catch (error: any) {
            console.error('Failed to fetch random books:', error);
            throw error;
        }
    }
    
    async getRecentBooks(): Promise<RecentBook[]> {
        const apiUrl = this.apiBase + "/books/recent_visit";

        try {
            const data = await this.$fetch<RecentBook[]>(apiUrl);
            return data || []; // Return an empty array as default
        } catch (error: any) {
            console.error('Failed to fetch recent books:', error);
            throw error;
        }
    }

    async getForgetBooks(): Promise<ForgetBook[]> {
        const apiUrl = this.apiBase + "/books/forgotten";

        try {
            const data = await this.$fetch<ForgetBook[]>(apiUrl);
            return data || []; // 返回空数组作为默认值
        } catch (error: any) {
            console.error('Failed to fetch forget books:', error);
            throw error;
        }
    }

    async getTodayBooks(): Promise<TodayBook[]> {
        const apiUrl = this.apiBase + "/books/today";
    
        try {
            const data = await this.$fetch<TodayBook[]>(apiUrl);
            return data || []; // 返回空数组作为默认值
        } catch (error: any) {
            console.error('Failed to fetch today books:', error);
            throw error;
        }
    }

    async getTagsByBookid(bookid: string): Promise<BookTags> {
        const apiUrl = this.apiBase + "/book/tags/" + bookid;

        try {
            const data = await this.$fetch<BookTags>(apiUrl);
            return data || []; // 返回空数组作为默认值
        } catch (error: any) {
            console.error(`Failed to fetch tags for book ${bookid}:`, error);
            throw error;
        }
    }

    async getBookByBookid(bookid: string): Promise<{ book: Book; tags: BookTags }> {
        // 获取书籍详情
        const apiUrl = this.apiBase + "/book/detail/" + bookid;
        
        try {
            // 获取书籍信息
            const bookData = await this.$fetch<Book>(apiUrl);
            const book = bookData || defaultBook;
            
            // 获取标签信息
            const tags = await this.getTagsByBookid(bookid);
            
            // 注意：访问更新已在远程 API 调用中处理，无需单独调用
            
            return { book, tags };
        } catch (error: any) {
            console.error(`Failed to fetch book ${bookid}:`, error);
            throw error;
        }
    }
}