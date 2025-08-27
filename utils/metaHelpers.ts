/**
 * Utility functions for meta tag generation and optimization
 */

/**
 * Truncate text to specified length with proper word boundaries
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text
  
  const truncated = text.substring(0, maxLength - 3)
  const lastSpace = truncated.lastIndexOf(' ')
  
  return lastSpace > 0 
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...'
}

/**
 * Clean and deduplicate keywords array
 */
export function cleanKeywords(keywords: (string | undefined | null)[]): string[] {
  return [...new Set(
    keywords
      .filter((keyword): keyword is string => Boolean(keyword?.trim()))
      .map(keyword => keyword.trim())
  )]
}

/**
 * Generate canonical URL with proper formatting
 */
export function generateCanonicalUrl(path: string, baseUrl?: string): string {
  const base = baseUrl || useRuntimeConfig().public.siteUrl || 'https://rsywx.com'
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  
  return `${base.replace(/\/$/, '')}${cleanPath}`
}

/**
 * Generate book cover URL with fallback
 */
export function generateBookCoverUrl(bookid: string | number | undefined): string {
  if (!bookid) return '/images/default-book-cover.jpg'
  
  const paddedId = String(bookid).padStart(5, '0')
  return `/covers/${paddedId}.webp`
}

/**
 * Generate optimized meta description from book data
 */
export function generateBookDescription(book: any): string {
  if (book.intro) {
    return truncateText(`《${book.title}》，${book.author}著。${book.intro}`, 160)
  }
  
  const parts = [
    `《${book.title}》是${book.author}的作品，收藏于任氏有无轩。`,
    book.publisher_name && `出版社：${book.publisher_name}`,
    book.isbn && `ISBN：${book.isbn}`,
    book.pubdate && `出版日期：${book.pubdate}`
  ].filter(Boolean)
  
  return truncateText(parts.join(''), 160)
}

/**
 * Validate and sanitize meta tag content
 */
export function sanitizeMetaContent(content: string | undefined): string | undefined {
  if (!content) return undefined
  
  return content
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .replace(/[<>]/g, '') // Remove HTML brackets
    .trim()
}

/**
 * Generate structured keywords for different page types
 */
export function generatePageKeywords(type: 'home' | 'book' | 'list' | 'reading', data?: any): string[] {
  const baseKeywords = ['任氏有无轩', '藏书', '读书']
  
  switch (type) {
    case 'home':
      return [...baseKeywords, '博客', '维客', '图书收藏', '阅读笔记']
    
    case 'book':
      return cleanKeywords([
        ...baseKeywords,
        data?.title,
        data?.author,
        data?.category,
        ...(data?.tags || [])
      ])
    
    case 'list':
      return cleanKeywords([
        ...baseKeywords,
        '图书列表',
        data?.filterValue,
        data?.category
      ])
    
    case 'reading':
      return [...baseKeywords, '阅读', '读书笔记', '书评']
    
    default:
      return baseKeywords
  }
}

/**
 * Check if image URL is valid and accessible
 */
export function validateImageUrl(url: string): boolean {
  try {
    new URL(url, 'https://rsywx.com')
    return true
  } catch {
    return false
  }
}

/**
 * Generate fallback image based on content type
 */
export function getFallbackImage(type: 'book' | 'list' | 'reading' | 'default'): string {
  const fallbacks = {
    book: '/images/default-book-cover.jpg',
    list: '/images/default-library.jpg',
    reading: '/images/default-reading.jpg',
    default: '/images/default-og-image.jpg'
  }
  
  return fallbacks[type] || fallbacks.default
}