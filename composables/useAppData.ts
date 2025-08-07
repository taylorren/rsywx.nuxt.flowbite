// composables/useAppData.ts
import { useBooks } from './useBooks';
import { useReading } from './useReading';
import { useVisits } from './useVisits';
import { useQotd } from './useQotd';
import { useWotd } from './useWotd';
import { performanceMonitor } from '~/utils/performance';

/**
 * Master composable that coordinates all API calls for optimal performance
 * Implements concurrent loading strategies to minimize total load time
 */
export function useAppData() {
  // Initialize all composables
  const books = useBooks();
  const reading = useReading();
  const visits = useVisits();
  const qotd = useQotd();
  const wotd = useWotd();

  /**
   * Load only critical data needed for initial page render
   * These are the most important data that users see immediately
   */
  const loadCriticalData = async () => {
    console.log('🚀 Loading critical data...');
    const startTime = performance.now();
    
    try {
      // Load critical book data (summary + latest book) concurrently
      await books.initializeKeyData();
      
      const endTime = performance.now();
      console.log(`✅ Critical data loaded in ${(endTime - startTime).toFixed(2)}ms`);
    } catch (error) {
      console.error('❌ Error loading critical data:', error);
    }
  };

  /**
   * Load all non-critical data concurrently
   * This includes all the cards that are visible but not immediately critical
   */
  const loadNonCriticalData = async () => {
    console.log('🔄 Loading all non-critical data concurrently...');
    const startTime = performance.now();
    
    try {
      // Load all non-critical data in parallel for maximum speed
      await Promise.allSettled([
        // Book-related non-critical data (using optimized batch loading)
        books.loadAllBooksDataOptimized(),
        
        // Reading data
        reading.loadAllReadingData(),
        
        // Visit statistics
        visits.loadVisitStats(),
        
        // Daily content (these might be cached and fast)
        qotd.fetchQotd(),
        wotd.fetchWotd()
      ]);
      
      const endTime = performance.now();
      console.log(`✅ All non-critical data loaded in ${(endTime - startTime).toFixed(2)}ms`);
    } catch (error) {
      console.error('❌ Error loading non-critical data:', error);
    }
  };

  /**
   * Load all data with optimized strategy:
   * 1. Load critical data first (blocking)
   * 2. Load non-critical data concurrently (non-blocking)
   */
  const loadAllData = async () => {
    performanceMonitor.start('Total App Load Time');
    console.log('🎯 Starting optimized data loading strategy...');
    
    try {
      // Step 1: Load critical data first (users see something immediately)
      await loadCriticalData();
      
      // Step 2: Load non-critical data concurrently (progressive enhancement)
      // Don't await this - let it load in background
      loadNonCriticalData().then(() => {
        performanceMonitor.end('Total App Load Time');
        performanceMonitor.printSummary();
      }).catch(error => {
        console.error('Non-critical data loading failed:', error);
        performanceMonitor.end('Total App Load Time', error as Error);
      });
      
      console.log(`🎉 Optimized loading strategy initiated - critical data loaded, non-critical loading in background`);
    } catch (error) {
      console.error('❌ Error in optimized loading strategy:', error);
      performanceMonitor.end('Total App Load Time', error as Error);
    }
  };

  /**
   * Alternative strategy: Load everything concurrently
   * Use this if you want maximum parallelism but potentially slower perceived performance
   */
  const loadAllDataConcurrent = async () => {
    console.log('⚡ Loading ALL data concurrently...');
    const startTime = performance.now();
    
    try {
      await Promise.allSettled([
        // Critical data
        books.initializeKeyData(),
        
        // Non-critical data
        books.loadAllNonCriticalData(),
        reading.loadAllReadingData(),
        visits.loadVisitStats(),
        qotd.fetchQotd(),
        wotd.fetchWotd()
      ]);
      
      const endTime = performance.now();
      console.log(`✅ ALL data loaded concurrently in ${(endTime - startTime).toFixed(2)}ms`);
    } catch (error) {
      console.error('❌ Error loading all data concurrently:', error);
    }
  };

  return {
    // Individual composables (for granular access)
    books,
    reading,
    visits,
    qotd,
    wotd,
    
    // Optimized loading strategies
    loadCriticalData,
    loadNonCriticalData,
    loadAllData,
    loadAllDataConcurrent
  };
}