// filepath: services/bookService.ts
import type { Book, BooksSummary, RandomBook, RecentBook, ForgetBook } from '~/types/book';

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
    private readonly apiBase = 'https://api.rsywx.com';

    async getBooksSummary(): Promise<BooksSummary> {
        const apiUrl = this.apiBase + "/book/summary";
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

    async getLatestBook(): Promise<Book> {
        const apiUrl = this.apiBase + "/book/latest";
        try {
            const { data, error } = await useFetch<Book>(apiUrl);

            if (error.value) {
                throw error.value;
            }

            return data.value || defaultBook;
        } catch (error: any) {
            console.error('Failed to fetch book summary:', error);
            throw error;
        }
    }

    async getRandomBook(): Promise<RandomBook[]> {
        const apiUrl = this.apiBase + "/book/random";
        
        try {
            const { data, error } = await useFetch<RandomBook[]>(apiUrl);
            if (error.value) {
                throw error.value;
            }
            
            return data.value || defaultRandomBook;
        } catch (error: any) {
            console.error('Failed to fetch random book:', error);
            throw error;
        }
    }

    async getRecentBooks(): Promise<RecentBook[]> {
        const apiUrl = this.apiBase + "/admin/recentbooks";

        try {
            const { data, error } = await useFetch<RecentBook[]>(apiUrl);

            if (error.value) {
                throw error.value;
            }

            return data.value || []; // Return an empty array as default
        } catch (error: any) {
            console.error('Failed to fetch recent books:', error);
            throw error;
        }
    }

    async getForgetBooks(): Promise<ForgetBook[]> {
        const apiUrl = this.apiBase + "/admin/forgetbooks";

        try {
            const { data, error } = await useFetch<ForgetBook[]>(apiUrl);

            if (error.value) {
                throw error.value;
            }

            return data.value || []; // 返回空数组作为默认值
        } catch (error: any) {
            console.error('Failed to fetch forget books:', error);
            throw error;
        }
    }
}