/**
 * Composable for generating and injecting structured data (JSON-LD) for SEO
 * Implements schema.org Book schema for rich snippets in search results
 */

import type { StructuredDataBook } from '~/types/meta'
import type { Book } from '~/types/book'

export const useStructuredData = () => {
  /**
   * Generate Book schema structured data from book object
   * Implements requirements 5.1, 5.2, 5.3 for JSON-LD Book schema
   * 
   * @param book - Book object containing book details
   * @returns StructuredDataBook - Schema.org compliant Book structured data
   */
  const generateBookStructuredData = (book: Book): StructuredDataBook => {
    // Build the base structured data object
    const structuredData: StructuredDataBook = {
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: book.title,
      author: {
        '@type': 'Person',
        name: book.author
      }
    }

    // Add optional fields if they exist (requirement 5.2)
    if (book.isbn) {
      structuredData.isbn = book.isbn
    }

    if (book.publisher_name || book.pu_name) {
      structuredData.publisher = {
        '@type': 'Organization',
        name: book.publisher_name || book.pu_name
      }
    }

    if (book.pubdate) {
      structuredData.datePublished = book.pubdate
    }

    // Add book cover image if available (requirement 5.3)
    if (book.bookid) {
      structuredData.image = `/covers/${book.bookid}.webp`
    }

    // Add description from intro or generate default (requirement 5.2)
    if (book.intro) {
      structuredData.description = book.intro
    } else {
      structuredData.description = `《${book.title}》是${book.author}的作品，收藏于任氏有无轩。`
    }

    return structuredData
  }

  /**
   * Inject structured data into page head as JSON-LD script
   * Implements requirement 5.1 for JSON-LD structured data injection
   * 
   * @param data - Structured data object to inject
   */
  const injectStructuredData = (data: StructuredDataBook | any) => {
    // Validate structured data before injection (requirement 5.4)
    if (!data || typeof data !== 'object') {
      console.warn('Invalid structured data provided for injection')
      return
    }

    // Ensure required schema.org fields are present
    if (!data['@context'] || !data['@type']) {
      console.warn('Structured data missing required @context or @type fields')
      return
    }

    try {
      // Inject as JSON-LD script tag using Nuxt's useHead
      useHead({
        script: [
          {
            type: 'application/ld+json',
            children: JSON.stringify(data)
          }
        ]
      })
    } catch (error) {
      console.error('Failed to inject structured data:', error)
    }
  }

  /**
   * Generate and inject Book structured data in one call
   * Convenience method that combines generation and injection
   * 
   * @param book - Book object to generate structured data for
   */
  const injectBookStructuredData = (book: Book) => {
    try {
      const structuredData = generateBookStructuredData(book)
      injectStructuredData(structuredData)
    } catch (error) {
      console.error('Failed to generate and inject book structured data:', error)
    }
  }

  /**
   * Validate structured data against basic schema.org requirements
   * Implements requirement 5.4 for structured data validation
   * 
   * @param data - Structured data to validate
   * @returns boolean - True if valid, false otherwise
   */
  const validateStructuredData = (data: any): boolean => {
    if (!data || typeof data !== 'object') {
      return false
    }

    // Check required schema.org fields
    if (!data['@context'] || !data['@type']) {
      return false
    }

    // For Book schema, validate required fields
    if (data['@type'] === 'Book') {
      if (!data.name || !data.author || typeof data.author !== 'object' || !data.author.name) {
        return false
      }
    }

    return true
  }

  return {
    generateBookStructuredData,
    injectStructuredData,
    injectBookStructuredData,
    validateStructuredData
  }
}