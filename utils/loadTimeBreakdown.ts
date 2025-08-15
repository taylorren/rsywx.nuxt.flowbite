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
  }

  /**
   * Mark the start of a load phase
   */
  startPhase(phase: string): void {
    this.phases.set(phase, { start: performance.now() });
  }

  /**
   * Mark the end of a load phase
   */
  endPhase(phase: string): void {
    const phaseData = this.phases.get(phase);
    if (phaseData) {
      phaseData.end = performance.now();
      const duration = phaseData.end - phaseData.start;
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


    breakdown.forEach((phase, index) => {
      const bar = '█'.repeat(Math.max(1, Math.floor(phase.percentage / 2)));
      const impact = phase.percentage > 30 ? '🚨' : phase.percentage > 15 ? '⚠️' : '💡';
      
    });

    // Identify the biggest bottlenecks
    const majorBottlenecks = breakdown.filter(phase => phase.percentage > 20);
    if (majorBottlenecks.length > 0) {
      majorBottlenecks.forEach(phase => {
      });
    }

    // Performance recommendations
    if (totalTime > 5000) {
    } else if (totalTime > 3000) {
    } else if (totalTime > 1000) {
    } else {
    }

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