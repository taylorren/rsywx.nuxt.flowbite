// utils/loadTimeBreakdown.ts
/**
 * Detailed load time breakdown analyzer to identify the exact cause of 6.5s load time
 */

import { performanceAnalyzer } from './performanceAnalyzer';

interface LoadTimeBreakdown {
  phase: string;
  startTime: number;
  endTime: number;
  duration: number;
  percentage: number;
  description: string;
  optimization: string;
}

class LoadTimeAnalyzer {
  private phases: Map<string, { start: number; end?: number }> = new Map();
  private totalStartTime: number = 0;

  /**
   * Start the overall load time analysis
   */
  startAnalysis(): void {
    this.totalStartTime = performance.now();
    console.log('🔍 Starting detailed load time breakdown analysis...');
  }

  /**
   * Mark the start of a load phase
   */
  startPhase(phase: string): void {
    this.phases.set(phase, { start: performance.now() });
    console.log(`📍 Phase started: ${phase}`);
  }

  /**
   * Mark the end of a load phase
   */
  endPhase(phase: string): void {
    const phaseData = this.phases.get(phase);
    if (phaseData) {
      phaseData.end = performance.now();
      const duration = phaseData.end - phaseData.start;
      console.log(`✅ Phase completed: ${phase} (${duration.toFixed(2)}ms)`);
    }
  }

  /**
   * Generate comprehensive load time breakdown
   */
  generateBreakdown(): LoadTimeBreakdown[] {
    const totalTime = performance.now() - this.totalStartTime;
    const breakdown: LoadTimeBreakdown[] = [];

    // Define expected phases and their descriptions
    const phaseDescriptions = {
      'DNS Resolution': {
        description: 'Time to resolve domain names',
        optimization: 'Use DNS prefetch or local caching'
      },
      'Initial Connection': {
        description: 'TCP connection establishment',
        optimization: 'Use HTTP/2 or connection pooling'
      },
      'SSL Handshake': {
        description: 'HTTPS certificate negotiation',
        optimization: 'Use HTTP/2 or optimize certificates'
      },
      'Server Response': {
        description: 'Time for server to process and respond',
        optimization: 'Optimize backend API performance'
      },
      'Content Download': {
        description: 'Time to download response content',
        optimization: 'Compress responses or use CDN'
      },
      'DOM Processing': {
        description: 'Browser parsing HTML/CSS/JS',
        optimization: 'Minimize and optimize assets'
      },
      'API Calls': {
        description: 'Time for all API requests to complete',
        optimization: 'Use concurrent requests and caching'
      },
      'Component Rendering': {
        description: 'Vue component mounting and rendering',
        optimization: 'Use lazy loading and code splitting'
      },
      'External Resources': {
        description: 'Loading external images and assets',
        optimization: 'Cache locally or use lazy loading'
      }
    };

    this.phases.forEach((phaseData, phase) => {
      if (phaseData.end) {
        const duration = phaseData.end - phaseData.start;
        const percentage = (duration / totalTime) * 100;
        const phaseInfo = phaseDescriptions[phase as keyof typeof phaseDescriptions] || {
          description: 'Custom phase',
          optimization: 'Analyze and optimize'
        };

        breakdown.push({
          phase,
          startTime: phaseData.start,
          endTime: phaseData.end,
          duration,
          percentage,
          description: phaseInfo.description,
          optimization: phaseInfo.optimization
        });
      }
    });

    return breakdown.sort((a, b) => b.duration - a.duration);
  }

  /**
   * Print detailed load time breakdown report
   */
  printLoadTimeBreakdown(): void {
    const breakdown = this.generateBreakdown();
    const totalTime = performance.now() - this.totalStartTime;

    console.log('\n🔍 ===== DETAILED LOAD TIME BREAKDOWN =====');
    console.log(`⏱️ Total Load Time: ${totalTime.toFixed(2)}ms (${(totalTime/1000).toFixed(2)}s)`);
    console.log('');

    console.log('📊 PHASE BREAKDOWN (sorted by duration):');
    breakdown.forEach((phase, index) => {
      const bar = '█'.repeat(Math.max(1, Math.floor(phase.percentage / 2)));
      const impact = phase.percentage > 30 ? '🚨' : phase.percentage > 15 ? '⚠️' : '💡';
      
      console.log(`${index + 1}. ${impact} ${phase.phase}`);
      console.log(`   Duration: ${phase.duration.toFixed(2)}ms (${phase.percentage.toFixed(1)}%)`);
      console.log(`   ${bar} ${phase.percentage.toFixed(1)}%`);
      console.log(`   📝 ${phase.description}`);
      console.log(`   💡 ${phase.optimization}`);
      console.log('');
    });

    // Identify the biggest bottlenecks
    const majorBottlenecks = breakdown.filter(phase => phase.percentage > 20);
    if (majorBottlenecks.length > 0) {
      console.log('🚨 MAJOR BOTTLENECKS (>20% of total time):');
      majorBottlenecks.forEach(phase => {
        console.log(`   - ${phase.phase}: ${phase.duration.toFixed(2)}ms (${phase.percentage.toFixed(1)}%)`);
        console.log(`     💡 Priority fix: ${phase.optimization}`);
      });
      console.log('');
    }

    // Performance recommendations
    console.log('🎯 PERFORMANCE RECOMMENDATIONS:');
    if (totalTime > 5000) {
      console.log('🚨 CRITICAL: Load time > 5s - Immediate action required');
    } else if (totalTime > 3000) {
      console.log('⚠️ WARNING: Load time > 3s - Optimization recommended');
    } else if (totalTime > 1000) {
      console.log('💡 INFO: Load time > 1s - Consider optimization');
    } else {
      console.log('✅ GOOD: Load time < 1s - Performance is acceptable');
    }

    console.log('\n===============================================\n');
  }

  /**
   * Analyze Navigation Timing API for additional insights
   */
  analyzeNavigationTiming(): void {
    if (typeof window !== 'undefined' && window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const navigationStart = timing.navigationStart;

      const phases = {
        'DNS Lookup': timing.domainLookupEnd - timing.domainLookupStart,
        'TCP Connection': timing.connectEnd - timing.connectStart,
        'Request': timing.responseStart - timing.requestStart,
        'Response': timing.responseEnd - timing.responseStart,
        'DOM Processing': timing.domComplete - timing.domLoading,
        'Load Event': timing.loadEventEnd - timing.loadEventStart
      };

      console.log('🌐 NAVIGATION TIMING BREAKDOWN:');
      Object.entries(phases).forEach(([phase, duration]) => {
        if (duration > 0) {
          console.log(`   ${phase}: ${duration}ms`);
        }
      });
      console.log('');
    }
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.phases.clear();
    this.totalStartTime = 0;
  }
}

// Create singleton instance
export const loadTimeAnalyzer = new LoadTimeAnalyzer();

/**
 * Comprehensive performance analysis function
 */
export function analyzeFullLoadTime(): void {
  // Start the analysis
  loadTimeAnalyzer.startAnalysis();

  // Track key phases
  loadTimeAnalyzer.startPhase('Initial Connection');
  
  // Use requestIdleCallback to analyze after page is fully loaded
  if (typeof window !== 'undefined' && window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      loadTimeAnalyzer.endPhase('Initial Connection');
      loadTimeAnalyzer.printLoadTimeBreakdown();
      loadTimeAnalyzer.analyzeNavigationTiming();
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      loadTimeAnalyzer.endPhase('Initial Connection');
      loadTimeAnalyzer.printLoadTimeBreakdown();
      loadTimeAnalyzer.analyzeNavigationTiming();
    }, 100);
  }
}