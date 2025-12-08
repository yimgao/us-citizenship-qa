/**
 * Performance monitoring utilities
 * Web Vitals tracking for performance metrics
 * Integrated with Vercel Analytics
 */

export interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

/**
 * Report Web Vitals metrics
 * Integrated with Vercel Analytics (via @vercel/analytics)
 */
export function reportWebVitals(metric: WebVitalsMetric) {
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', metric.name, metric.value, metric.rating);
  }

  // In production, Vercel Analytics automatically tracks Web Vitals
  // when @vercel/analytics is installed and configured
  // Additional custom analytics can be added here if needed
}

/**
 * Measure page load time
 */
export function measurePageLoad() {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

    if (process.env.NODE_ENV === 'development') {
      console.log('[Performance] Page Load Time:', pageLoadTime, 'ms');
    }
  });
}

/**
 * Constants for performance monitoring
 */
const FRAME_TIME_MS = 16; // One frame at 60fps

/**
 * Measure component render time
 * Useful for identifying slow components
 */
export function measureComponentRender(componentName: string) {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return;

  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    if (renderTime > FRAME_TIME_MS) {
      console.warn(`[Performance] ${componentName} render took ${renderTime.toFixed(2)}ms`);
    }
  };
}

/**
 * Track resource load performance
 */
export function trackResourceLoad() {
  if (typeof window === 'undefined') return;

  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            if (process.env.NODE_ENV === 'development') {
              console.log('[Performance] Resource loaded:', {
                name: resourceEntry.name,
                duration: resourceEntry.duration.toFixed(2) + 'ms',
                size: resourceEntry.transferSize,
              });
            }
          }
        }
      });

      observer.observe({ entryTypes: ['resource'] });
    } catch (e) {
      // PerformanceObserver not supported or error
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Performance] PerformanceObserver not available');
      }
    }
  }
}
