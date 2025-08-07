// utils/networkOptimizer.ts
/**
 * Network optimization utilities to reduce the 6.5s load time
 */

import { performanceAnalyzer } from './performanceAnalyzer';

interface ResourceCache {
  [url: string]: {
    data: any;
    timestamp: number;
    ttl: number;
  };
}

class NetworkOptimizer {
  private cache: ResourceCache = {};
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Preload critical external resources
   */
  async preloadCriticalResources(): Promise<void> {
    performanceAnalyzer.start('Resource Preloading', 'network');
    
    const criticalResources = [
      '/images/logo.svg',
      '/images/bookshelf.png',
      '/_nuxt/assets/css/input.css'
    ];

    try {
      const preloadPromises = criticalResources.map(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = url.endsWith('.css') ? 'style' : 'image';
        document.head.appendChild(link);
        
        return new Promise((resolve) => {
          link.onload = resolve;
          link.onerror = resolve; // Don't fail on individual resource errors
        });
      });

      await Promise.all(preloadPromises);
      performanceAnalyzer.end('Resource Preloading');
    } catch (error) {
      performanceAnalyzer.end('Resource Preloading', error as Error);
    }
  }

  /**
   * Cache external API responses
   */
  async cachedFetch<T>(url: string, options?: RequestInit, ttl: number = this.CACHE_TTL): Promise<T> {
    const cacheKey = `${url}_${JSON.stringify(options)}`;
    const cached = this.cache[cacheKey];
    
    // Return cached data if valid
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      console.log(`📦 Cache hit for: ${url}`);
      return cached.data;
    }

    // Fetch fresh data
    performanceAnalyzer.start(`Cached Fetch: ${url}`, 'network');
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      
      // Cache the response
      this.cache[cacheKey] = {
        data,
        timestamp: Date.now(),
        ttl
      };
      
      performanceAnalyzer.end(`Cached Fetch: ${url}`);
      return data;
    } catch (error) {
      performanceAnalyzer.end(`Cached Fetch: ${url}`, error as Error);
      throw error;
    }
  }

  /**
   * Batch multiple API calls with intelligent retry
   */
  async batchApiCalls<T>(
    calls: Array<{ name: string; promise: Promise<T> }>,
    maxRetries: number = 2
  ): Promise<Array<{ name: string; result: T | null; error?: Error }>> {
    performanceAnalyzer.start('Batch API Calls', 'api');
    
    const results: Array<{ name: string; result: T | null; error?: Error }> = [];
    
    for (const call of calls) {
      let attempt = 0;
      let success = false;
      
      while (attempt < maxRetries && !success) {
        try {
          const result = await call.promise;
          results.push({ name: call.name, result });
          success = true;
        } catch (error) {
          attempt++;
          if (attempt >= maxRetries) {
            results.push({ name: call.name, result: null, error: error as Error });
            console.warn(`❌ ${call.name} failed after ${maxRetries} attempts:`, error);
          } else {
            console.log(`🔄 Retrying ${call.name} (attempt ${attempt + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
          }
        }
      }
    }
    
    performanceAnalyzer.end('Batch API Calls');
    return results;
  }

  /**
   * Optimize image loading with lazy loading and WebP support
   */
  optimizeImageLoading(): void {
    performanceAnalyzer.start('Image Optimization', 'network');
    
    // Add intersection observer for lazy loading
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
    
    performanceAnalyzer.end('Image Optimization');
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache = {};
    console.log('🗑️ Network cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; entries: string[] } {
    const entries = Object.keys(this.cache);
    return {
      size: entries.length,
      entries
    };
  }
}

// Create singleton instance
export const networkOptimizer = new NetworkOptimizer();

/**
 * Quick optimization setup for immediate performance gains
 */
export async function quickOptimizations(): Promise<void> {
  console.log('⚡ Applying quick network optimizations...');
  
  // Preload critical resources
  await networkOptimizer.preloadCriticalResources();
  
  // Optimize image loading
  networkOptimizer.optimizeImageLoading();
  
  // Add DNS prefetch for external domains
  const externalDomains = [
    'api.rsywx.com',
    'mirrors.creativecommons.org'
  ];
  
  externalDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });
  
  console.log('✅ Quick optimizations applied');
}