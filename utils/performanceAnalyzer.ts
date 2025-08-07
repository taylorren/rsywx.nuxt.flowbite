// utils/performanceAnalyzer.ts
/**
 * Advanced performance analyzer to identify bottlenecks in the 6.5s load time
 */

interface DetailedMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  category: 'api' | 'network' | 'rendering' | 'processing';
  status: 'pending' | 'completed' | 'failed';
  error?: Error;
  metadata?: Record<string, any>;
}

class PerformanceAnalyzer {
  private metrics: Map<string, DetailedMetric> = new Map();
  private pageLoadStart: number = 0;
  private criticalPathMetrics: string[] = [];

  /**
   * Mark the start of page loading
   */
  startPageLoad(): void {
    this.pageLoadStart = performance.now();
    console.log('🎯 Page load analysis started');
  }

  /**
   * Start timing with category and metadata
   */
  start(name: string, category: DetailedMetric['category'], metadata?: Record<string, any>): void {
    this.metrics.set(name, {
      name,
      category,
      startTime: performance.now(),
      status: 'pending',
      metadata
    });
    console.log(`⏱️ [${category.toUpperCase()}] Started: ${name}`);
  }

  /**
   * End timing with optional error
   */
  end(name: string, error?: Error): void {
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`⚠️ No metric found for: ${name}`);
      return;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    metric.endTime = endTime;
    metric.duration = duration;
    metric.status = error ? 'failed' : 'completed';
    metric.error = error;

    const statusIcon = error ? '❌' : '✅';
    const categoryIcon = this.getCategoryIcon(metric.category);
    console.log(`${statusIcon} ${categoryIcon} [${metric.category.toUpperCase()}] ${name}: ${duration.toFixed(2)}ms`);
  }

  /**
   * Mark a metric as part of the critical path
   */
  markCritical(name: string): void {
    this.criticalPathMetrics.push(name);
  }

  /**
   * Get category icon for better visualization
   */
  private getCategoryIcon(category: DetailedMetric['category']): string {
    const icons = {
      api: '🌐',
      network: '📡',
      rendering: '🎨',
      processing: '⚙️'
    };
    return icons[category] || '📊';
  }

  /**
   * Analyze performance bottlenecks
   */
  analyzeBottlenecks(): {
    totalTime: number;
    criticalPath: number;
    bottlenecks: Array<{
      name: string;
      duration: number;
      category: string;
      impact: 'high' | 'medium' | 'low';
      recommendation: string;
    }>;
    categoryBreakdown: Record<string, { count: number; totalTime: number; avgTime: number }>;
  } {
    const completed = Array.from(this.metrics.values()).filter(m => m.status === 'completed');
    const totalTime = this.pageLoadStart > 0 ? performance.now() - this.pageLoadStart : 0;
    
    // Calculate critical path time
    const criticalMetrics = completed.filter(m => this.criticalPathMetrics.includes(m.name));
    const criticalPath = Math.max(...criticalMetrics.map(m => m.duration || 0));

    // Identify bottlenecks (operations taking > 500ms)
    const bottlenecks = completed
      .filter(m => (m.duration || 0) > 500)
      .map(m => ({
        name: m.name,
        duration: m.duration || 0,
        category: m.category,
        impact: this.getImpactLevel(m.duration || 0),
        recommendation: this.getRecommendation(m)
      }))
      .sort((a, b) => b.duration - a.duration);

    // Category breakdown
    const categoryBreakdown: Record<string, { count: number; totalTime: number; avgTime: number }> = {};
    completed.forEach(m => {
      if (!categoryBreakdown[m.category]) {
        categoryBreakdown[m.category] = { count: 0, totalTime: 0, avgTime: 0 };
      }
      categoryBreakdown[m.category].count++;
      categoryBreakdown[m.category].totalTime += m.duration || 0;
    });

    Object.keys(categoryBreakdown).forEach(category => {
      const data = categoryBreakdown[category];
      data.avgTime = data.totalTime / data.count;
    });

    return {
      totalTime,
      criticalPath,
      bottlenecks,
      categoryBreakdown
    };
  }

  /**
   * Get impact level based on duration
   */
  private getImpactLevel(duration: number): 'high' | 'medium' | 'low' {
    if (duration > 2000) return 'high';
    if (duration > 1000) return 'medium';
    return 'low';
  }

  /**
   * Get optimization recommendation
   */
  private getRecommendation(metric: DetailedMetric): string {
    const recommendations = {
      api: {
        high: 'Consider API optimization, caching, or pagination',
        medium: 'Add request caching or optimize query',
        low: 'Monitor for consistency'
      },
      network: {
        high: 'Cache resources locally or use CDN',
        medium: 'Optimize resource size or add preloading',
        low: 'Consider lazy loading'
      },
      rendering: {
        high: 'Optimize component rendering or use virtualization',
        medium: 'Add loading states or skeleton screens',
        low: 'Consider code splitting'
      },
      processing: {
        high: 'Move to web worker or optimize algorithm',
        medium: 'Add progress indicators',
        low: 'Consider debouncing'
      }
    };

    const impact = this.getImpactLevel(metric.duration || 0);
    return recommendations[metric.category][impact];
  }

  /**
   * Print comprehensive performance report
   */
  printDetailedReport(): void {
    const analysis = this.analyzeBottlenecks();
    
    console.log('\n📊 ===== DETAILED PERFORMANCE ANALYSIS =====');
    console.log(`🕐 Total Load Time: ${analysis.totalTime.toFixed(2)}ms`);
    console.log(`⚡ Critical Path: ${analysis.criticalPath.toFixed(2)}ms`);
    
    console.log('\n🔥 TOP BOTTLENECKS:');
    analysis.bottlenecks.slice(0, 5).forEach((bottleneck, index) => {
      const impactIcon = bottleneck.impact === 'high' ? '🚨' : bottleneck.impact === 'medium' ? '⚠️' : '💡';
      console.log(`${index + 1}. ${impactIcon} ${bottleneck.name}`);
      console.log(`   Duration: ${bottleneck.duration.toFixed(2)}ms`);
      console.log(`   Category: ${bottleneck.category}`);
      console.log(`   💡 Recommendation: ${bottleneck.recommendation}`);
      console.log('');
    });

    console.log('📈 CATEGORY BREAKDOWN:');
    Object.entries(analysis.categoryBreakdown).forEach(([category, data]) => {
      const icon = this.getCategoryIcon(category as DetailedMetric['category']);
      console.log(`${icon} ${category.toUpperCase()}: ${data.count} calls, ${data.totalTime.toFixed(2)}ms total, ${data.avgTime.toFixed(2)}ms avg`);
    });

    console.log('\n🎯 OPTIMIZATION PRIORITIES:');
    const highImpact = analysis.bottlenecks.filter(b => b.impact === 'high');
    if (highImpact.length > 0) {
      console.log('🚨 HIGH PRIORITY:');
      highImpact.forEach(b => console.log(`   - ${b.name}: ${b.recommendation}`));
    }

    const mediumImpact = analysis.bottlenecks.filter(b => b.impact === 'medium');
    if (mediumImpact.length > 0) {
      console.log('⚠️ MEDIUM PRIORITY:');
      mediumImpact.forEach(b => console.log(`   - ${b.name}: ${b.recommendation}`));
    }

    console.log('\n===============================================\n');
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
    this.criticalPathMetrics = [];
    this.pageLoadStart = 0;
  }
}

// Create singleton instance
export const performanceAnalyzer = new PerformanceAnalyzer();

/**
 * Enhanced timed function with category support
 */
export function timedWithCategory<T extends (...args: any[]) => Promise<any>>(
  name: string,
  category: DetailedMetric['category'],
  fn: T,
  metadata?: Record<string, any>
): T {
  return (async (...args: any[]) => {
    performanceAnalyzer.start(name, category, metadata);
    try {
      const result = await fn(...args);
      performanceAnalyzer.end(name);
      return result;
    } catch (error) {
      performanceAnalyzer.end(name, error as Error);
      throw error;
    }
  }) as T;
}