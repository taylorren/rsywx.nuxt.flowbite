// types/book.ts
export type SearchType = 'title' | 'author' | 'tag' | 'location';

export interface BookListItem {
  id: number;
  bookid: string;
  title: string;
  author: string;
  translated: boolean;
  copyrighter: string | null;
  region: string;
  location: string;
  purchdate: string;
  tags: string[];
  cover_uri: string;
}

export interface BookListResponse {
  success: boolean;
  data: BookListItem[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_results: number;
    per_page: number;
  };
}
