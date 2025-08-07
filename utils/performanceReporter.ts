// utils/performanceReporter.ts
/**
 * Performance report writer to save comprehensive analysis to file
 */

import { performanceAnalyzer } from './performanceAnalyzer';
import { loadTimeAnalyzer } from './loadTimeBreakdown';
import { networkOptimizer } from './networkOptimizer';

interface PerformanceReport {
    timestamp: string;
    totalLoadTime: number;
    summary: {
        totalApiCalls: number;
        successfulCalls: number;
        failedCalls: number;
        averageDuration: number;
        totalDuration: number;
    };
    bottlenecks: Array<{
        name: string;
        duration: number;
        category: string;
        impact: 'high' | 'medium' | 'low';
        recommendation: string;
    }>;
    phaseBreakdown: Array<{
        phase: string;
        duration: number;
        percentage: number;
        description: string;
        optimization: string;
    }>;
    categoryBreakdown: Record<string, {
        count: number;
        totalTime: number;
        avgTime: number;
    }>;
    dataStatus: {
        summary: boolean;
        latestBook: boolean;
        randomBook: boolean;
        recentVisit: boolean;
        forgetBooks: boolean;
    };
    cacheStats: {
        size: number;
        entries: string[];
    };
    navigationTiming?: Record<string, number>;
    recommendations: {
        highPriority: string[];
        mediumPriority: string[];
        lowPriority: string[];
        quickWins: string[];
    };
}

class PerformanceReporter {
    private report: PerformanceReport | null = null;

    /**
     * Generate comprehensive performance report
     */
    generateReport(dataStatus: Record<string, any>): PerformanceReport {
        const analysis = performanceAnalyzer.analyzeBottlenecks();
        const breakdown = loadTimeAnalyzer.generateBreakdown();
        const cacheStats = networkOptimizer.getCacheStats();
        const navigationTiming = this.getNavigationTiming();

        // Categorize recommendations by priority
        const recommendations = this.categorizeRecommendations(analysis.bottlenecks);

        // Safely extract summary data with fallbacks
        const apiCategory = analysis.categoryBreakdown?.api;
        const summary = {
            totalApiCalls: apiCategory?.count || 0,
            successfulCalls: analysis.successfulCalls || 0,
            failedCalls: analysis.failedCalls || 0,
            averageDuration: analysis.averageDuration || 0,
            totalDuration: analysis.totalDuration || 0
        };

        this.report = {
            timestamp: new Date().toISOString(),
            totalLoadTime: analysis.totalTime || 0,
            summary,
            bottlenecks: analysis.bottlenecks || [],
            phaseBreakdown: breakdown || [],
            categoryBreakdown: analysis.categoryBreakdown || {},
            dataStatus: {
                summary: !!dataStatus.summary,
                latestBook: !!dataStatus.latestBook,
                randomBook: !!dataStatus.randomBook,
                recentVisit: !!dataStatus.recentVisit,
                forgetBooks: !!dataStatus.forgetBooks
            },
            cacheStats,
            navigationTiming,
            recommendations
        };

        return this.report;
    }

    /**
     * Get navigation timing data
     */
    private getNavigationTiming(): Record<string, number> | undefined {
        if (typeof window !== 'undefined' && window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            return {
                dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
                tcpConnection: timing.connectEnd - timing.connectStart,
                request: timing.responseStart - timing.requestStart,
                response: timing.responseEnd - timing.responseStart,
                domProcessing: timing.domComplete - timing.domLoading,
                loadEvent: timing.loadEventEnd - timing.loadEventStart
            };
        }
        return undefined;
    }

    /**
     * Categorize recommendations by priority
     */
    private categorizeRecommendations(bottlenecks: any[]): {
        highPriority: string[];
        mediumPriority: string[];
        lowPriority: string[];
        quickWins: string[];
    } {
        const high = bottlenecks.filter(b => b.impact === 'high').map(b => `${b.name}: ${b.recommendation}`);
        const medium = bottlenecks.filter(b => b.impact === 'medium').map(b => `${b.name}: ${b.recommendation}`);
        const low = bottlenecks.filter(b => b.impact === 'low').map(b => `${b.name}: ${b.recommendation}`);

        const quickWins = [
            'Fix API server (currently returning 502 errors)',
            'Cache Creative Commons icons locally',
            'Implement service worker for API caching',
            'Optimize image loading with WebP format',
            'Add request retry logic for failed APIs',
            'Use DNS prefetching for external domains',
            'Implement resource preloading for critical assets'
        ];

        return { highPriority: high, mediumPriority: medium, lowPriority: low, quickWins };
    }

    /**
     * Format report as readable text
     */
    formatReportAsText(report: PerformanceReport): string {
        const lines: string[] = [];

        lines.push('===============================================');
        lines.push('         COMPREHENSIVE PERFORMANCE REPORT');
        lines.push('===============================================');
        lines.push(`Generated: ${report.timestamp}`);
        lines.push(`Total Load Time: ${report.totalLoadTime.toFixed(2)}ms (${(report.totalLoadTime / 1000).toFixed(2)}s)`);
        lines.push('');

        // Performance Summary
        lines.push('📊 PERFORMANCE SUMMARY:');
        lines.push(`   Total API calls: ${report.summary.totalApiCalls}`);
        lines.push(`   Successful: ${report.summary.successfulCalls}`);
        lines.push(`   Failed: ${report.summary.failedCalls}`);
        lines.push(`   Average duration: ${report.summary.averageDuration.toFixed(2)}ms`);
        lines.push(`   Total API time: ${report.summary.totalDuration.toFixed(2)}ms`);
        lines.push('');

        // Top Bottlenecks
        lines.push('🔥 TOP BOTTLENECKS:');
        report.bottlenecks.slice(0, 10).forEach((bottleneck, index) => {
            const impactIcon = bottleneck.impact === 'high' ? '🚨' : bottleneck.impact === 'medium' ? '⚠️' : '💡';
            lines.push(`${index + 1}. ${impactIcon} ${bottleneck.name}`);
            lines.push(`   Duration: ${bottleneck.duration.toFixed(2)}ms`);
            lines.push(`   Category: ${bottleneck.category}`);
            lines.push(`   Recommendation: ${bottleneck.recommendation}`);
            lines.push('');
        });

        // Phase Breakdown
        lines.push('📈 LOAD PHASE BREAKDOWN:');
        report.phaseBreakdown.forEach((phase, index) => {
            const bar = '█'.repeat(Math.max(1, Math.floor(phase.percentage / 2)));
            lines.push(`${index + 1}. ${phase.phase}`);
            lines.push(`   Duration: ${phase.duration.toFixed(2)}ms (${phase.percentage.toFixed(1)}%)`);
            lines.push(`   ${bar} ${phase.percentage.toFixed(1)}%`);
            lines.push(`   Description: ${phase.description}`);
            lines.push(`   Optimization: ${phase.optimization}`);
            lines.push('');
        });

        // Category Breakdown
        lines.push('📊 CATEGORY BREAKDOWN:');
        Object.entries(report.categoryBreakdown).forEach(([category, data]) => {
            lines.push(`${category.toUpperCase()}: ${data.count} calls, ${data.totalTime.toFixed(2)}ms total, ${data.avgTime.toFixed(2)}ms avg`);
        });
        lines.push('');

        // Data Status
        lines.push('📊 DATA LOADING STATUS:');
        Object.entries(report.dataStatus).forEach(([key, status]) => {
            lines.push(`   ${key}: ${status ? '✅ Loaded' : '❌ Failed'}`);
        });
        lines.push('');

        // Navigation Timing
        if (report.navigationTiming) {
            lines.push('🌐 NAVIGATION TIMING:');
            Object.entries(report.navigationTiming).forEach(([phase, duration]) => {
                if (duration > 0) {
                    lines.push(`   ${phase}: ${duration}ms`);
                }
            });
            lines.push('');
        }

        // Cache Statistics
        lines.push('📦 CACHE STATISTICS:');
        lines.push(`   Cached entries: ${report.cacheStats.size}`);
        if (report.cacheStats.size > 0) {
            lines.push('   Cached resources:');
            report.cacheStats.entries.forEach(entry => {
                lines.push(`     - ${entry}`);
            });
        }
        lines.push('');

        // Recommendations
        lines.push('🎯 OPTIMIZATION RECOMMENDATIONS:');
        lines.push('');

        if (report.recommendations.highPriority.length > 0) {
            lines.push('🚨 HIGH PRIORITY (Fix immediately):');
            report.recommendations.highPriority.forEach(rec => {
                lines.push(`   - ${rec}`);
            });
            lines.push('');
        }

        if (report.recommendations.mediumPriority.length > 0) {
            lines.push('⚠️ MEDIUM PRIORITY (Fix soon):');
            report.recommendations.mediumPriority.forEach(rec => {
                lines.push(`   - ${rec}`);
            });
            lines.push('');
        }

        if (report.recommendations.lowPriority.length > 0) {
            lines.push('💡 LOW PRIORITY (Consider for future):');
            report.recommendations.lowPriority.forEach(rec => {
                lines.push(`   - ${rec}`);
            });
            lines.push('');
        }

        lines.push('⚡ QUICK WINS (Easy optimizations):');
        report.recommendations.quickWins.forEach(win => {
            lines.push(`   - ${win}`);
        });
        lines.push('');

        // Performance Assessment
        lines.push('🎯 PERFORMANCE ASSESSMENT:');
        if (report.totalLoadTime > 5000) {
            lines.push('🚨 CRITICAL: Load time > 5s - Immediate action required');
            lines.push('   Target: Reduce to under 3s for acceptable performance');
        } else if (report.totalLoadTime > 3000) {
            lines.push('⚠️ WARNING: Load time > 3s - Optimization recommended');
            lines.push('   Target: Reduce to under 2s for good performance');
        } else if (report.totalLoadTime > 1000) {
            lines.push('💡 INFO: Load time > 1s - Consider optimization');
            lines.push('   Target: Reduce to under 1s for excellent performance');
        } else {
            lines.push('✅ GOOD: Load time < 1s - Performance is acceptable');
        }
        lines.push('');

        lines.push('===============================================');
        lines.push('              END OF REPORT');
        lines.push('===============================================');

        return lines.join('\n');
    }

    /**
     * Save report to file (browser download)
     */
    async saveReportToFile(report: PerformanceReport, filename?: string): Promise<void> {
        const reportText = this.formatReportAsText(report);
        const reportJson = JSON.stringify(report, null, 2);

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const baseFilename = filename || `performance-report-${timestamp}`;

        // Save as text file
        this.downloadFile(`${baseFilename}.txt`, reportText, 'text/plain');

        // Save as JSON file for programmatic analysis
        this.downloadFile(`${baseFilename}.json`, reportJson, 'application/json');

        console.log(`📁 Performance reports saved:`);
        console.log(`   - ${baseFilename}.txt (human-readable)`);
        console.log(`   - ${baseFilename}.json (machine-readable)`);
    }

    /**
     * Download file in browser
     */
    private downloadFile(filename: string, content: string, mimeType: string): void {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    }

    /**
     * Get the current report
     */
    getCurrentReport(): PerformanceReport | null {
        return this.report;
    }
}

// Create singleton instance
export const performanceReporter = new PerformanceReporter();

/**
 * Generate and save comprehensive performance report
 */
export async function generateAndSaveReport(dataStatus: Record<string, any>, filename?: string): Promise<void> {
    console.log('📊 Generating comprehensive performance report...');

    const report = performanceReporter.generateReport(dataStatus);
    await performanceReporter.saveReportToFile(report, filename);

    console.log('✅ Performance report generated and saved successfully!');
    return;
}