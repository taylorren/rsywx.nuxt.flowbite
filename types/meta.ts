/**
 * Meta tag type definitions for SEO and social media optimization
 */

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'book';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export interface BookMeta extends PageMeta {
  bookTitle: string;
  author: string;
  isbn?: string;
  publisher?: string;
  publishDate?: string;
  category?: string;
  tags?: string[];
  price?: number;
  coverImage?: string;
}

export interface StructuredDataBook {
  '@context': 'https://schema.org';
  '@type': 'Book';
  name: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  isbn?: string;
  publisher?: {
    '@type': 'Organization';
    name: string;
  };
  datePublished?: string;
  image?: string;
  description?: string;
}

export interface ListPageMeta extends PageMeta {
  filterType: 'author' | 'category' | 'tag' | 'all';
  filterValue?: string;
  itemCount?: number;
}

export interface ReadingPageMeta extends PageMeta {
  contentType: 'latest' | 'review' | 'summary';
  pageNumber?: number;
}

export interface SocialMediaMeta {
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

export interface MetaTagConfig {
  base: PageMeta;
  social: SocialMediaMeta;
  structured?: StructuredDataBook;
  canonical?: string;
}