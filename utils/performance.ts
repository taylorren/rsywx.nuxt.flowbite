// utils/performance.ts
/**
 * Performance monitoring utilities for API calls and page loading
 */

interface PerformanceMetric {
    name: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    status: 'pending' | 'completed' | 'failed';
    error?: Error;
}

class PerformanceMonitor {
    private metrics: Map<string, PerformanceMetric> = new Map();

    /**
     * Start timing a performance metric
     */
    start(name: string): void {
        this.metrics.set(name, {
            name,
            startTime: performance.now(),
            status: 'pending'
        });
        console.log(`⏱️ Started timing: ${name}`);
    }

    /**
     * End timing a performance metric
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
        const errorMsg = error ? ` (Error: ${error.message})` : '';
        console.log(`${statusIcon} ${name}: ${duration.toFixed(2)}ms${errorMsg}`);
    }

    /**
     * Get all metrics
     */
    getMetrics(): PerformanceMetric[] {
        return Array.from(this.metrics.values());
    }

    /**
     * Get summary of all completed metrics
     */
    getSummary(): {
        totalCalls: number;
        successfulCalls: number;
        failedCalls: number;
        averageDuration: number;
        totalDuration: number;
    } {
        const completed = this.getMetrics().filter(m => m.status !== 'pending');
        const successful = completed.filter(m => m.status === 'completed');
        const failed = completed.filter(m => m.status === 'failed');

        const totalDuration = successful.reduce((sum, m) => sum + (m.duration || 0), 0);
        const averageDuration = successful.length > 0 ? totalDuration / successful.length : 0;

        return {
            totalCalls: completed.length,
            successfulCalls: successful.length,
            failedCalls: failed.length,
            averageDuration,
            totalDuration
        };
    }

    /**
     * Print performance summary
     */
    printSummary(): void {
        const summary = this.getSummary();
        console.log('📊 Performance Summary:');
        console.log(`   Total API calls: ${summary.totalCalls}`);
        console.log(`   Successful: ${summary.successfulCalls}`);
        console.log(`   Failed: ${summary.failedCalls}`);
        console.log(`   Average duration: ${summary.averageDuration.toFixed(2)}ms`);
        console.log(`   Total duration: ${summary.totalDuration.toFixed(2)}ms`);
    }

    /**
     * Clear all metrics
     */
    clear(): void {
        this.metrics.clear();
    }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Decorator function to automatically time async functions
 */
export function timed<T extends (...args: any[]) => Promise<any>>(
    name: string,
    fn: T
): T {
    return (async (...args: any[]) => {
        performanceMonitor.start(name);
        try {
            const result = await fn(...args);
            performanceMonitor.end(name);
            return result;
        } catch (error) {
            performanceMonitor.end(name, error as Error);
            throw error;
        }
    }) as T;
}

/**
 * Measure concurrent operations
 */
export async function measureConcurrent<T>(
    name: string,
    operations: Promise<T>[]
): Promise<(T | null)[]> {
    performanceMonitor.start(name);
    try {
        const results = await Promise.allSettled(operations);
        performanceMonitor.end(name);

        // Log individual operation results
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.warn(`❌ Operation ${index + 1} failed:`, result.reason);
            }
        });

        return results.map(result =>
            result.status === 'fulfilled' ? result.value : null
        );
    } catch (error) {
        performanceMonitor.end(name, error as Error);
        throw error;
    }
}