# Design Document

## Overview

This design outlines the implementation of a comprehensive metadata system for the 任氏有无轩 Nuxt.js application. The system will provide dynamic, SEO-optimized meta tags for all page types including home, book details, book lists, and reading pages. The design leverages Nuxt 3's built-in `useHead()` and `useSeoMeta()` composables for optimal performance and SEO.

## Architecture

### Meta Tag Management Strategy

The system will use a layered approach:

1. **Global Base Meta Tags** - Set in `nuxt.config.ts` for site-wide defaults
2. **Layout-Level Meta Tags** - Common meta tags applied in layouts
3. **Page-Level Meta Tags** - Specific meta tags for individual pages
4. **Dynamic Meta Tags** - Generated based on page content and data

### Component Structure

```
composables/
├── useSeoMeta.ts          # Custom composable for SEO meta management
├── useStructuredData.ts   # JSON-LD structured data generation
└── usePageMeta.ts         # Page-specific meta tag utilities

utils/
├── metaHelpers.ts         # Helper functions for meta tag generation
└── structuredDataSchemas.ts # Schema.org structured data templates

types/
└── meta.ts                # TypeScript interfaces for meta data
```

## Components and Interfaces

### 1. Meta Data Types

```typescript
// types/meta.ts
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
```

### 2. SEO Meta Composable

```typescript
// composables/useSeoMeta.ts
export const useSeoMeta = () => {
  const generateBookMeta = (book: any): BookMeta => {
    const title = `《${book.title}》- ${book.author} | 任氏有无轩`;
    const description = book.intro 
      ? `${book.title}，${book.author}著。${book.intro.substring(0, 120)}...`
      : `《${book.title}》是${book.author}的作品，收藏于任氏有无轩。出版社：${book.publisher_name}，ISBN：${book.isbn}`;
    
    return {
      title,
      description,
      keywords: [book.title, book.author, book.category, ...(book.tags || [])],
      image: `/covers/${book.bookid}.webp`,
      type: 'book',
      author: book.author,
      bookTitle: book.title,
      isbn: book.isbn,
      publisher: book.publisher_name,
      publishDate: book.pubdate,
      category: book.category,
      tags: book.tags,
      price: book.price,
      coverImage: `/covers/${book.bookid}.webp`
    };
  };

  const generateListMeta = (type: string, value?: string, count?: number): PageMeta => {
    const titles = {
      author: `${value}的作品 | 任氏有无轩`,
      category: `${value}分类图书 | 任氏有无轩`,
      tag: `标签"${value}"的图书 | 任氏有无轩`,
      all: '全部藏书 | 任氏有无轩'
    };

    const descriptions = {
      author: `浏览${value}的所有作品，共${count || 0}本图书收藏于任氏有无轩`,
      category: `${value}分类下的图书收藏，共${count || 0}本`,
      tag: `标签为"${value}"的图书列表，共${count || 0}本`,
      all: `任氏有无轩的完整藏书目录，包含各类图书${count || 0}本`
    };

    return {
      title: titles[type as keyof typeof titles] || '图书列表 | 任氏有无轩',
      description: descriptions[type as keyof typeof descriptions] || '任氏有无轩图书收藏',
      keywords: ['藏书', '图书', '任氏有无轩', value].filter(Boolean) as string[]
    };
  };

  return {
    generateBookMeta,
    generateListMeta
  };
};
```

### 3. Structured Data Composable

```typescript
// composables/useStructuredData.ts
export const useStructuredData = () => {
  const generateBookStructuredData = (book: any): StructuredDataBook => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: book.title,
      author: {
        '@type': 'Person',
        name: book.author
      },
      isbn: book.isbn,
      publisher: book.publisher_name ? {
        '@type': 'Organization',
        name: book.publisher_name
      } : undefined,
      datePublished: book.pubdate,
      image: `/covers/${book.bookid}.webp`,
      description: book.intro || `《${book.title}》是${book.author}的作品`
    };
  };

  const injectStructuredData = (data: any) => {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(data)
        }
      ]
    });
  };

  return {
    generateBookStructuredData,
    injectStructuredData
  };
};
```

### 4. Global Meta Configuration

```typescript
// nuxt.config.ts additions
export default defineNuxtConfig({
  app: {
    head: {
      title: '任氏有无轩',
      titleTemplate: '%s | 任氏有无轩',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#1f2937' },
        { name: 'color-scheme', content: 'light dark' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'canonical', href: 'https://rsywx.com' }
      ]
    }
  }
});
```

## Data Models

### Meta Tag Data Flow

1. **Page Load** → **Data Fetch** → **Meta Generation** → **Head Update**
2. **Route Change** → **Meta Cleanup** → **New Meta Generation** → **Head Update**

### Page-Specific Meta Patterns

#### Home Page Meta
- Title: "任氏有无轩 | 藏书、读书、博客、维客"
- Description: Site overview with current statistics
- Keywords: Core site terms
- Open Graph: Site logo and description

#### Book Detail Page Meta
- Title: "《[书名]》- [作者] | 任氏有无轩"
- Description: Book summary with author and publication info
- Keywords: Book title, author, category, tags
- Open Graph: Book cover image
- Structured Data: Book schema

#### Book List Page Meta
- Title: Based on filter type (author, category, tag)
- Description: List description with count
- Keywords: Filter terms and general book terms
- Open Graph: Default library image

#### Reading Pages Meta
- Title: "最新阅读评论 | 任氏有无轩"
- Description: Reading content description
- Keywords: Reading, reviews, books
- Open Graph: Reading-related image

## Error Handling

### Fallback Strategies

1. **Missing Book Cover**: Use default library image
2. **Missing Book Data**: Use generic book description template
3. **API Failures**: Use cached meta data or defaults
4. **Invalid Structured Data**: Skip structured data injection

### Error Recovery

```typescript
const safeMetaGeneration = (dataFetcher: () => Promise<any>, fallback: PageMeta) => {
  try {
    const data = await dataFetcher();
    return generateMeta(data);
  } catch (error) {
    console.warn('Meta generation failed, using fallback:', error);
    return fallback;
  }
};
```

## Testing Strategy

### Unit Tests
- Meta generation functions
- Structured data generation
- Fallback mechanisms
- Helper utilities

### Integration Tests
- Page meta tag rendering
- Dynamic meta updates
- Social media preview validation
- SEO meta tag completeness

### E2E Tests
- Meta tags in browser
- Social media sharing previews
- Search engine crawler simulation
- Performance impact measurement

### Validation Tools
- Schema.org structured data validator
- Open Graph debugger
- Twitter Card validator
- Google Rich Results Test

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Generate meta tags only when needed
2. **Caching**: Cache generated meta data for repeated requests
3. **Minimal DOM Updates**: Use Nuxt's efficient head management
4. **Image Optimization**: Optimize Open Graph images

### Bundle Size Impact

- Composables: ~2KB gzipped
- Helper utilities: ~1KB gzipped
- Type definitions: 0KB (TypeScript only)

## Implementation Phases

### Phase 1: Core Infrastructure
- Create composables and utilities
- Set up global meta configuration
- Implement basic meta generation

### Phase 2: Page-Specific Implementation
- Home page meta tags
- Book detail page meta tags
- Book list page meta tags

### Phase 3: Advanced Features
- Structured data implementation
- Social media optimization
- Error handling and fallbacks

### Phase 4: Testing and Optimization
- Comprehensive testing
- Performance optimization
- SEO validation