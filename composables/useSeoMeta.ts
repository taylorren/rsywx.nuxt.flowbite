import type { BookMeta, PageMeta, ListPageMeta, SocialMediaMeta, MetaTagConfig } from '~/types/meta'
import { 
  truncateText, 
  cleanKeywords, 
  generateCanonicalUrl, 
  generateBookCoverUrl, 
  generateBookDescription,
  generatePageKeywords,
  getFallbackImage
} from '~/utils/metaHelpers'

/**
 * Composable for SEO meta tag management
 */
export const useSeoMeta = () => {
  /**
   * Generate meta tags for book detail pages
   */
  const generateBookMeta = (book: any): BookMeta => {
    const title = `《${book.title}》- ${book.author} | 任氏有无轩`
    const description = generateBookDescription(book)
    const keywords = generatePageKeywords('book', book)

    return {
      title,
      description,
      keywords,
      image: generateBookCoverUrl(book.bookid),
      type: 'book',
      author: book.author,
      bookTitle: book.title,
      isbn: book.isbn,
      publisher: book.publisher_name,
      publishDate: book.pubdate,
      category: book.category,
      tags: book.tags,
      price: book.price,
      coverImage: generateBookCoverUrl(book.bookid)
    }
  }

  /**
   * Generate meta tags for book list pages
   */
  const generateListMeta = (type: string, value?: string, count?: number): ListPageMeta => {
    const titles = {
      author: `${value}的作品 | 任氏有无轩`,
      category: `${value}分类图书 | 任氏有无轩`,
      tag: `标签"${value}"的图书 | 任氏有无轩`,
      all: '全部藏书 | 任氏有无轩'
    }

    const descriptions = {
      author: `浏览${value}的所有作品，共${count || 0}本图书收藏于任氏有无轩`,
      category: `${value}分类下的图书收藏，共${count || 0}本`,
      tag: `标签为"${value}"的图书列表，共${count || 0}本`,
      all: `任氏有无轩的完整藏书目录，包含各类图书${count || 0}本`
    }

    const keywords = generatePageKeywords('list', { filterValue: value, category: value })

    return {
      title: titles[type as keyof typeof titles] || '图书列表 | 任氏有无轩',
      description: descriptions[type as keyof typeof descriptions] || '任氏有无轩图书收藏',
      keywords,
      filterType: type as 'author' | 'category' | 'tag' | 'all',
      filterValue: value,
      itemCount: count
    }
  }

  /**
   * Generate social media meta tags
   */
  const generateSocialMeta = (pageMeta: PageMeta): SocialMediaMeta => {
    const fallbackImage = getFallbackImage(pageMeta.type === 'book' ? 'book' : 'default')
    
    return {
      ogTitle: pageMeta.title,
      ogDescription: pageMeta.description,
      ogImage: pageMeta.image || fallbackImage,
      ogType: pageMeta.type || 'website',
      ogUrl: pageMeta.url,
      twitterCard: 'summary_large_image',
      twitterTitle: pageMeta.title,
      twitterDescription: pageMeta.description,
      twitterImage: pageMeta.image || fallbackImage
    }
  }

  /**
   * Generate complete meta tag configuration
   */
  const generateMetaConfig = (pageMeta: PageMeta, canonicalUrl?: string): MetaTagConfig => {
    return {
      base: pageMeta,
      social: generateSocialMeta(pageMeta),
      canonical: canonicalUrl
    }
  }

  /**
   * Apply meta tags to the page head
   */
  const applyMetaTags = (config: MetaTagConfig) => {
    const { base, social, canonical } = config

    // Apply basic meta tags
    useHead({
      title: base.title,
      meta: [
        { name: 'description', content: base.description },
        { name: 'keywords', content: base.keywords?.join(', ') },
        { name: 'author', content: base.author },
        
        // Open Graph meta tags
        { property: 'og:title', content: social.ogTitle },
        { property: 'og:description', content: social.ogDescription },
        { property: 'og:image', content: social.ogImage },
        { property: 'og:type', content: social.ogType },
        { property: 'og:url', content: social.ogUrl },
        
        // Twitter Card meta tags
        { name: 'twitter:card', content: social.twitterCard },
        { name: 'twitter:title', content: social.twitterTitle },
        { name: 'twitter:description', content: social.twitterDescription },
        { name: 'twitter:image', content: social.twitterImage }
      ].filter(meta => meta.content), // Filter out undefined content
      
      link: canonical ? [
        { rel: 'canonical', href: canonical }
      ] : []
    })
  }

  return {
    generateBookMeta,
    generateListMeta,
    generateSocialMeta,
    generateMetaConfig,
    applyMetaTags
  }
}

